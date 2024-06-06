import { CanvasStyleSignal, Layout, Length, Rect, RectProps, Txt, colorSignal, initial, signal } from "@motion-canvas/2d";
import { Color, ColorSignal, PossibleColor, Reference, SignalValue, SimpleSignal, SpacingSignal, createRef, createSignal, easeOutCirc, easeOutQuint, linear, map, remap, useLogger, usePlayback, useRandom, useThread } from "@motion-canvas/core";
import { HitObject } from "osu-classes"
import { isVisible } from "./ManiaUtils";
import { Indexed } from "../../utils/general";
import { PoolManager, PooledObject } from "../../utils/poolManager";
import { ManiaHitObject } from "./ManiaHitObject";
import ColorUtils from "../../utils/color";
import { SolidIcon } from "../SolidIcon";
import { FONT } from "../../constants/fon";

export interface OsuManiaLaneProps extends RectProps {
    hitObjectRange: SignalValue<[number, number]>
    hitObjects: SignalValue<Indexed<HitObject>[]>,
    pool: SignalValue<PoolManager<ManiaHitObject>>,
    isHeld?: SignalValue<boolean>,
    Autoplay?: SignalValue<boolean>,
    accentColor?: SignalValue<PossibleColor>,
    startCutoff?: SignalValue<number>,
    b?: SignalValue<number>,
    icon: string,
    images: string[],
    name: string
}

export class OsuManiaLane extends Rect {
    @initial("#000000")
    @colorSignal()
    public declare readonly accentColor: ColorSignal<this>;

    @initial(4.5)
    @signal()
    public override readonly radius: SpacingSignal<this>;

    @initial([0, 0])
    @signal()
    public declare readonly hitObjectRange: SimpleSignal<[number, number], this>

    @initial([])
    @signal()
    public declare readonly hitObjects: SimpleSignal<Indexed<HitObject>[], this>

    @signal()
    public declare readonly pool: SimpleSignal<PoolManager<ManiaHitObject>, this>

    @initial(false)
    @signal()
    public declare readonly isHeld: SimpleSignal<boolean, this>

    @initial(true)
    @signal()
    public declare readonly Autoplay: SimpleSignal<boolean, this>

    @initial(0)
    @signal()
    public declare readonly startCutoff: SimpleSignal<number, this>

    @initial(0)
    @signal()
    public declare readonly b: SimpleSignal<number, this>

    public hitObjectArea: Reference<Rect>
    public bottomClickArea: Reference<Rect>
    public readonly lastHeldTime = createSignal(-Infinity)
    private images: string[]

    // colors
    private backgroundColor = Color.createSignal(()=>ColorUtils.Darken(this.accentColor(), 3).alpha(0.8))

    private lastRandom = 0;

    private randomImage(){
        const i = useRandom()
        let random = i.nextInt(0, this.images.length)
        while(random == this.lastRandom){
            random = i.nextInt(0, this.images.length)
        }
        this.lastRandom = random
        return this.images[random]
    }

    private computeIsHeld(h: Indexed<HitObject>){
        if(Math.abs(h.obj.startTime/1000 - this.hitObjectRange()[0]) < 0.02){
            if((h.obj.startTime/1000 - this.hitObjectRange()[0]) > 0){
                return false
            }
            return true
        }
        return false
    }

    public constructor(props: OsuManiaLaneProps){
        
        super({
            ...props,
            layout: true,
            justifyContent: "end",
            alignItems: "center",
            direction: "column",
        })
        
        this.hitObjectArea = createRef<Rect>()
        this.bottomClickArea = createRef<Rect>()
        this.images = props.images

        const t = createRef<Rect>()

        this.add(
            <Rect
                ref={t}
                width={"100%"}
                grow={1}
                >
                <Rect
                    fill={()=>Color.lerp(
                        this.backgroundColor(),
                        ColorUtils.Lighten(this.backgroundColor(), 1),
                        this.b()
                    )}
                    radius={4.5}
                    width={"100%"}
                />
            </Rect>
        )

        t().add(<Rect
            ref={this.hitObjectArea}
            width={t().width}
            height={t().height}
            layout={false}
            radius={4.5}
            clip={true}
        />)
        
        const thread = useThread()

        this.add(
            <Rect
                ref={this.bottomClickArea}
                cache
                width={"100%"}
                opacity={1}
                height={"20%"}
                alignItems={"center"}
                alignContent={"center"}
                justifyContent={"center"}
                direction={"column"}
                clip
                fill={()=>{
                    const held = this.isHeld()
                    const time = thread.time()
                    const t = 1/2**2
                    if(held){
                        this.lastHeldTime(time)
                    }
                    const lastHeldTime = this.lastHeldTime()
                    // some very badly programmed formula (at least it works!)
                    const p = remap(time, time+t, 0, 1, lastHeldTime) + 1
                    return Color.lerp("#008000", "#80ff80", Math.max(0, Math.min(p, 1)))
                }}
            >
                <SolidIcon src={props.icon} width={"50%"} ratio={1}/>
                <Txt fill={"#ffffff"} fontFamily={FONT.REGULAR} fontSize={48} text={props.name} marginTop={24}/>
            </Rect>
        )

        const HitObjectMap: Map<number, PooledObject<ManiaHitObject>> = new Map<number, PooledObject<ManiaHitObject>>()

        this.hitObjectArea().children(() => {
            let held = false
            const children = this.hitObjects().map((h) => {
                if((h.obj.startTime / 1000) < (this.startCutoff() + (this.hitObjectRange()[1] - this.hitObjectRange()[0]))) return undefined
                if(isVisible(this.hitObjectRange()[0], this.hitObjectRange()[1]+1, h.obj.startTime/1000)){
                    if(!HitObjectMap.has(h.id)){
                        const node = this.pool().allocate()
                        node.obj.layout(false)
                        node.obj.width(this.hitObjectArea().width)
                        node.obj.accentColor("#00000000")
                        node.obj.setImg(this.randomImage())
                        node.obj.position.y(()=>remap(this.hitObjectRange()[0], this.hitObjectRange()[1], this.hitObjectArea().height()/2, -this.hitObjectArea().height()/2, h.obj.startTime/1000))
                        HitObjectMap.set(h.id, node)
                    }
                    const node = HitObjectMap.get(h.id)
                    return node.obj
                } else {
                    if(HitObjectMap.has(h.id)){
                        this.pool().release(HitObjectMap.get(h.id))
                        HitObjectMap.delete(h.id)
                    }
                    if(h.obj.startTime>this.hitObjectRange()[0]){
                        if(!held)held = this.computeIsHeld(h)
                    }
                    return undefined
                }
            })
            if(held !== this.isHeld())this.isHeld(held)
            return children
        })
    }
}