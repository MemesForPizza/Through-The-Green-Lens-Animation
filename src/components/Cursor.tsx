// this code replicates https://github.com/ppy/osu/blob/master/osu.Game/Graphics/Cursor/MenuCursorContainer.cs

import { Circle, Img, Layout, Node, NodeProps, Rect, brightness, initial, signal, useScene2D } from "@motion-canvas/2d";
import CursorImage from "../../images/images/cursor/cursor.png"
import CursorImage_Additive from "../../images/images/cursor/cursor-additive.png"
import { ColorSignal, PossibleColor, RAD2DEG, Reference, SimpleSignal, arcLerp, boolLerp, chain, createRef, createSignal, deepLerp, easeOutBounce, easeOutElastic, easeOutQuint, remap, sequence, threadable, useScene, waitFor } from "@motion-canvas/core";
import { SSCarouselItem } from "./SSCarouselItem";
import { Earth } from "./Earth";
import { Vector2 } from "osu-classes";
import { SSCarousel } from "./SSCarousel";
import { FrameLoop } from "../utils/FrameLoop";
import { EventWriter } from "../utils/EventWriter";
import { AudioEvent } from "../utils/AudioEvent";

export interface CursorProps extends NodeProps {
    accentColor?: SimpleSignal<PossibleColor>,
    updateSource?: FrameLoop,
    audioTimingPointWriter?: EventWriter<AudioEvent>
}

export type ClickableItem = SSCarouselItem | Earth | Node

type cursorEventTypes = "cursor.down" | "cursor.up"

const elastic_const = 2 * Math.PI / 0.3
const elastic_const2 = 0.3 / 4
const elastic_offset_quarter = Math.pow(2, -10) * Math.sin((0.25 - elastic_const2) * elastic_const);

function easeOutElasticQuarter(x: number) {
    return Math.pow(2, -10 * x) * Math.sin((0.25 * x - elastic_const2) * elastic_const) + 1 - elastic_offset_quarter * x
}

enum DragRotationState {
    NotDragging,
    DragStarted,
    Rotating
}

export class Cursor extends Rect {
    @initial("#0060ff")
    @signal()
    private declare readonly accentColor: ColorSignal<this>

    @initial(false)
    @signal()
    private declare readonly cursorIsDown: SimpleSignal<boolean, this>

    private declare readonly additiveRef: Reference<Node>
    private declare readonly cursorDisplay: Reference<Node>
    private declare readonly audioTimingPointWriter: EventWriter<AudioEvent> | undefined

    private dragRotationState = DragRotationState.NotDragging
    private positionMouseDown = new Vector2(0, 0)
    private lastMovePosition = new Vector2(0, 0)

    private writeAudio(ev: cursorEventTypes){
        const scene = useScene()
        const w = scene.getSize().width
        this.audioTimingPointWriter.write(ev, {
            volume: 1,
            pan: remap(0, w, -1, 1, this.absolutePosition().x)
        })
    }

    @threadable("Cursor Down")
    public *mouseDown(){
        this.cursorIsDown(true)
        this.writeAudio("cursor.down")
        if(this.dragRotationState != DragRotationState.Rotating){
            // if cursor is already rotating don't reset its rotate origin
            this.dragRotationState = DragRotationState.DragStarted
            const v = this.absolutePosition()
            this.positionMouseDown = new Vector2(v.x, v.y)
        }

        yield this.cursorDisplay().scale(0.9, 0.500, easeOutQuint)
        yield* this.additiveRef().opacity(1, 0.500, easeOutQuint)
    }

    @threadable("Cursor Up")
    public *mouseUp(){
        this.cursorIsDown(false)
        this.writeAudio("cursor.up")

        if(this.dragRotationState != DragRotationState.NotDragging){
            yield this.rotation(0, 0.4 * (0.5 + Math.abs(this.rotation() / 960)), easeOutElasticQuarter)
            this.dragRotationState = DragRotationState.NotDragging
        }

        yield this.cursorDisplay().scale(1, 0.300, easeOutBounce)
        yield* this.additiveRef().opacity(0, 0.300, easeOutQuint)
    }

    @threadable("Cursor Click")
    public *Click(duration = 0.2){
        yield this.mouseDown()
        yield* waitFor(duration)
        yield this.mouseUp()
    }

    @threadable("Cursor PopIn")
    public *PopIn(){
        this.dragRotationState = DragRotationState.NotDragging
        yield this.opacity(1, 0.25, easeOutQuint)
        yield this.scale(1, 0.4, easeOutQuint)
        yield* this.rotation(0, 0.4, easeOutQuint)
    }

    @threadable("Cursor PopOut")
    public *PopOut(){
        this.dragRotationState = DragRotationState.NotDragging
        yield this.opacity(0, 0.25, easeOutQuint)
        yield this.scale(0.6, 0.4, easeOutQuint)
        yield* this.rotation(0, 0.4, easeOutQuint)
    }

    @threadable("Cursor Click Item")
    public *ClickOn(item: ClickableItem, duration: number = 0.3){
        if(item instanceof SSCarouselItem){
            // do some maths to get position
            const clickX = createSignal(()=>(item.absolutePosition().x + item.width()/2) - 100)
            const clickY = createSignal(()=>(item.absolutePosition().y + item.height()/2) - 20)
            // interpolate
            yield* this.absolutePosition(()=>new Vector2(clickX(), clickY()), duration, easeOutQuint)
            this.absolutePosition.save() //just to ensure that it doesn't continue following the item
            yield* this.Click()
            const parent = item.parent()?.parent() // find the parent SSCarousel
            if(parent instanceof SSCarousel) yield parent.Select(item) // select it
            return
        }
        if(item instanceof Earth){
            yield* this.absolutePosition(item.absolutePosition, duration, easeOutQuint)
            yield* this.Click()
            this.absolutePosition.save()
            return
        }
        // allow any <Node> to be clickable
        if(item instanceof Node){
            yield* this.absolutePosition(item.absolutePosition, duration, easeOutQuint)
            yield* this.Click()
            this.absolutePosition.save()
            return
        }
    }

    constructor(props: CursorProps){
        super({
            ...props,
            zIndex: 1000
        })

        const CursorAdditiveRef = createRef<Img>()
        this.additiveRef = createRef<Node>()
        this.cursorDisplay = createRef<Node>()

        this.add(
            <Node
            scale={0.3}
            >
                <Node
                    ref={this.cursorDisplay}
                >
                    <Node
                        cache
                        position={[131, 216]}
                    >
                        <Img
                            src={CursorImage}
                        />
                        <Node cache
                            compositeOperation={"screen"}
                            ref={this.additiveRef}
                            opacity={0}
                        >
                            <Img
                                src={CursorImage_Additive}
                                ref={CursorAdditiveRef}
                            />
                            <Rect
                                compositeOperation={"source-in"}
                                size={CursorAdditiveRef().size}
                                fill={this.accentColor}
                            />
                        </Node>
                    </Node>
                </Node>
            </Node>
        )

        if(props.updateSource instanceof FrameLoop){
            const self = this
            props.updateSource.OnUpdate(function*(e){
                if(self.dragRotationState != DragRotationState.NotDragging && self.positionMouseDown.distance(self.lastMovePosition) > 60){
                    // make the rotation centre point floating.
                    const r = 0.04 * e.delta
                    self.positionMouseDown = new Vector2(
                        self.positionMouseDown.x + r * (self.lastMovePosition.x - self.positionMouseDown.x),
                        self.positionMouseDown.y + r * (self.lastMovePosition.y - self.positionMouseDown.y)
                    )                    
                }

                const c = self.absolutePosition()
                const p = self.lastMovePosition

                if(c.x === p.x && c.y === p.y)return // mouse is not moving
                // console.log("mouse move")
                // mosue move

                if(self.dragRotationState != DragRotationState.NotDragging){
                    self.lastMovePosition = new Vector2(c.x, c.y)

                    const distance = self.lastMovePosition.distance(self.positionMouseDown)
                    // don't start rotating until we're moved a minimum distance away from the mouse down location,
                    // else it can have an annoying effect.
                    if(self.dragRotationState == DragRotationState.DragStarted && distance > 80)
                        self.dragRotationState = DragRotationState.Rotating

                    // don't rotate when distance is zero to avoid NaN
                    if(self.dragRotationState == DragRotationState.Rotating && distance > 0){
                        let offset = c.addX(-self.positionMouseDown.x).addY(-self.positionMouseDown.y)
                        let degrees = Math.atan2(-offset.x, offset.y) * RAD2DEG + 24.3

                        let diff = (degrees - self.rotation()) % 360
                        if(diff < -180) diff += 360
                        if(diff > 180) diff -= 360
                        degrees = self.rotation() + diff

                        yield* self.rotation(degrees, 0.12, easeOutQuint)
                    }
                }
            })
        }

        if(props.audioTimingPointWriter instanceof EventWriter){
            this.audioTimingPointWriter = props.audioTimingPointWriter
        }
    }
}