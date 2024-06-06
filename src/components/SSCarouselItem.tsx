import { Circle, Gradient, Rect, RectProps, Txt, blur, colorSignal, initial, signal } from "@motion-canvas/2d";
import { Color, ColorSignal, DEFAULT, Reference, Signal, SignalValue, SimpleSignal, ThreadGenerator, Vector2, cancel, createRef, createSignal, decorate, easeOutQuint, isThreadGenerator, linear, map, threadable, useScene, useThread } from "@motion-canvas/core";
import { Background } from "./Background";
import { SmoothAbs } from "../utils/MathUtils";
import { TriangleBackground } from "./TriangleBackground";
import { getStarDifficultyColor } from "../utils/ColorUtils";
import { SSStarRatingDisplayIcon } from "./SSStarRatingDisplayIcon";
import { FONT } from "../constants/fon";
import Backgrounds from "../imgs/background";

const ShearRatio = 36.75/200
const selectOffset = 200

export interface SSCarouselItemProps extends RectProps {
    subitem?: boolean,
    selected?: boolean,
    time?: SignalValue<number>,
    playbackRate?: SignalValue<number>,
    starDifficulty?: SignalValue<number>,
    title?: SignalValue<string>,
    description?: SignalValue<string>,
    action?: SignalValue<string>,
    starTransitionPercentage?: SignalValue<number>,
    bg?: string,
    ratings?: SignalValue<[number, number, number, number, number, number]>,
    forceSelected?: SignalValue<boolean>
}

export class SSCarouselItem extends Rect {

    @initial(selectOffset)
    @signal()
    private declare readonly selectionPositionOffset: SimpleSignal<number, this>

    @initial(false)
    @signal()
    private declare readonly selected: SimpleSignal<boolean, this>

    @initial(false)
    @signal()
    private declare readonly hovered: SimpleSignal<boolean, this>

    @initial("#000000")
    @signal()
    private declare readonly borderColor: ColorSignal<this>

    @initial(0)
    @signal()
    public declare readonly time: SimpleSignal<number, this>

    @initial(1)
    @signal()
    public declare readonly playbackRate: SimpleSignal<number, this>

    @initial(false)
    @signal()
    public declare readonly playing: SimpleSignal<boolean, this>

    @initial(0)
    @signal()
    public declare readonly starDifficulty: SimpleSignal<number, this>

    @initial("#aaaaaa")
    @signal()
    public declare readonly difficultyColor: ColorSignal<this>

    @initial(false)
    @signal()
    public declare readonly previousHoverState: SimpleSignal<boolean, this>

    @initial("")
    @signal()
    public declare readonly title: SimpleSignal<string, this>

    @initial("")
    @signal()
    public declare readonly description: SimpleSignal<string, this>

    @initial(1)
    @signal()
    public declare readonly starTransitionPercentage: SimpleSignal<number, this>

    @initial("#142b33")
    @colorSignal()
    private declare readonly backgroundColorDark: ColorSignal<this>

    @initial("#0c232b")
    @colorSignal()
    private declare readonly backgroundColorLight: ColorSignal<this>

    @initial([0, 0, 0, 0, 0, 0])
    @signal()
    public declare readonly ratings: SimpleSignal<[number, number, number, number, number, number], this>

    @initial(false)
    @signal()
    public declare readonly forceSelected: SimpleSignal<boolean, this>

    private declare readonly glowRef: Reference<Rect>
    private declare readonly mainRef: Reference<Rect>
    private declare readonly backgroundRef: Reference<Background|TriangleBackground>
    public declare readonly subitem: boolean
    public declare readonly bg: string
    private hoverLastThread: ThreadGenerator | undefined

    public Start() {
        const time = useThread().time
        const start = time()
        const offset = this.time()
        const playbackRate = this.playbackRate()
        this.playing(true)
        this.time(() => offset + (time() - start) * playbackRate)
    }

    public Stop() {
        this.playing(false)
        this.time.save()
    }

    private Init() {
        if(this.forceSelected())this.selected(true)
        this.borderColor(this.selected() ? "#ddffff" : "#00000080")
        this.backgroundColorDark(this.selected() ? "#24505f" : "#0c232b")
        this.backgroundColorLight(this.selected() ? "#397083" : "#18353f")
        this.glowRef().filters.blur(this.selected() ? 15 : 10)
        this.glowRef().lineWidth(this.selected() ? 40 : 10)
        this.mainRef().lineWidth(this.selected() ? 10 : 0)
        this.selectionPositionOffset(this.selected() ? 0 : selectOffset)
    }

    @threadable("SSCarouselItem Select")
    public *Select(duration = 0.5): ThreadGenerator{
        this.selected(true)
        yield this.borderColor("#ddffff", duration, easeOutQuint, Color.lerp)
        yield this.backgroundColorDark("#152d36", duration, easeOutQuint, Color.lerp)
        yield this.backgroundColorLight("#397083", duration, easeOutQuint, Color.lerp)
        yield this.glowRef().filters.blur(15, duration, easeOutQuint)
        yield this.glowRef().lineWidth(40, duration, easeOutQuint)
        yield this.mainRef().lineWidth(10, duration, easeOutQuint)
        yield* this.selectionPositionOffset(0, duration, easeOutQuint)
    }

    @threadable("SSCarouselItem Deselect")
    public *Deselect(duration = 0.5): ThreadGenerator{
        if(this.forceSelected())return
        this.selected(false)
        yield this.borderColor("#00000080", duration, easeOutQuint, Color.lerp)
        yield this.backgroundColorDark("#0c232b", duration, easeOutQuint, Color.lerp)
        yield this.backgroundColorLight("#18353f", duration, easeOutQuint, Color.lerp)
        yield this.glowRef().filters.blur(10, duration, easeOutQuint)
        yield this.glowRef().lineWidth(10, duration, easeOutQuint)
        yield this.mainRef().lineWidth(0, duration, easeOutQuint)
        yield* this.selectionPositionOffset(selectOffset, duration, easeOutQuint)
    }

    @threadable("SSCarouselItem CursorEnter")
    public *CursorEnter(): ThreadGenerator {
        if(this.hoverLastThread) cancel(this.hoverLastThread)
        this.hoverLastThread = this.backgroundRef().filters.brightness(this.subitem ? 1.4 : 1.2 , 0.125, easeOutQuint)
        yield* this.hoverLastThread
    }

    @threadable("SSCarouselItem CursorLeave")
    public *CursorLeave(): ThreadGenerator {
        if(this.hoverLastThread) cancel(this.hoverLastThread)
        this.hoverLastThread = this.backgroundRef().filters.brightness(DEFAULT, 0.125, linear)
        yield* this.hoverLastThread
    }

    public isHovering(point: Vector2): boolean {
        // a bunch of variables
        const e = this.mainRef()
        const W = e.width()
        const H = e.height()
        const X = point.x
        const Y = point.y
        const XMin = e.absolutePosition().x - W/2
        const XMax = e.absolutePosition().x + W/2
        const YMin = e.absolutePosition().y - H/2
        const YMax = e.absolutePosition().y + H/2
        
        if(X < XMin || X > XMax)return false
        if(Y < YMin || Y > YMax)return false
        return true
    }

    constructor(props: SSCarouselItemProps){
        super({
            ...props,
            width: "100%",
            height: props.subitem ? 100 : 150,
            marginTop: props.subitem ? 12 : 25,
            marginBottom: props.subitem ? 12 : 25,
        })

        this.selected(props.selected)
        this.selectionPositionOffset(+!props.selected)
        this.subitem = props.subitem ?? false
        this.bg = props.bg

        const scene = useScene()
        const screenSize = scene.getRealSize()

        const itemWidth = props.subitem ? 950 : 1000
        
        // const borderColor = Color.createSignal(()=>Color.lerp("#ddffff", "#00000080", this.selectionPositionOffset()))

        this.glowRef = createRef<Rect>()
        this.mainRef = createRef<Rect>()
        this.backgroundRef = createRef<Background|TriangleBackground>()
        this.difficultyColor(()=>getStarDifficultyColor(this.starDifficulty()))

        this.add(
            <Rect layout={false}>
                <Rect
                    height={this.height}
                    width={itemWidth}
                    radius={[20, 0, 0, 20]}
                    x={()=>{
                        const hpW = this.width() / 2
                        const hW = itemWidth / 2
                        const cy = screenSize.y / 2
                        const d = this.absolutePosition().y - cy
                        const s = (SmoothAbs(d, 50000) - 200) * ShearRatio
                        return hpW - hW + s + (this.selectionPositionOffset())
                    }}
                >
                    <Rect
                        width={itemWidth}
                        height={this.height}
                        fill={this.borderColor}
                        stroke={this.borderColor}
                        radius={[20, 0, 0, 20]}
                        ref={this.glowRef}
                    />
                    <Rect
                        width={itemWidth}
                        height={this.height}
                        radius={[20, 0, 0, 20]}
                        fill={"#000000"}
                        stroke={this.borderColor}
                        strokeFirst
                        ref={this.mainRef}
                        clip
                    >
                        {
                            !props.subitem ? 
                            <Background
                                width={itemWidth}
                                height={this.height}
                                ref={this.backgroundRef}
                                src={props.bg ?? Backgrounds.DEFAULT}
                                opacity={0.7}
                            /> :
                            <TriangleBackground
                                width={itemWidth}
                                height={this.height}
                                ref={this.backgroundRef}
                                time={this.time}
                                baseVelocity={0.05}
                                colorDark={this.backgroundColorDark}
                                colorLight={this.backgroundColorLight}
                                triangleScale={3}
                                fill={()=>new Gradient({
                                    from: [0, -this.height()/2],
                                    to: [0, this.height()/2],
                                    stops: [
                                        {color: this.backgroundColorDark, offset: 0},
                                        {color: this.backgroundColorLight, offset: 1}
                                    ]
                                })}
                            />
                        }
                        {
                            !props.subitem ?
                            <Rect
                                width={itemWidth}
                                height={this.height}
                                layout
                                padding={20}
                                paddingLeft={30}
                                direction={"column"}
                            >
                                <Txt
                                    fill={"#ffffff"}
                                    fontFamily={FONT.SEMIBOLD}
                                    fontSize={48}
                                    text={this.title}
                                />
                                <Txt
                                    fill={"#ffffff"}
                                    fontFamily={FONT.REGULAR}
                                    fontSize={32}
                                    text={this.description}
                                />
                            </Rect> :
                            <Rect
                                width={itemWidth}
                                height={this.height}
                                layout
                                direction={"row"}
                                alignItems={"center"}
                                padding={10}
                            >
                                <Circle
                                    height={"100%"}
                                    ratio={1} 
                                    fill={"#ffffff"}
                                    marginRight={20}
                                    alignContent={"center"}
                                    alignItems={"center"}
                                    justifyContent={"center"}
                                >
                                    <Circle
                                        height={"75%"}
                                        ratio={1}
                                        stroke={this.difficultyColor}
                                        lineWidth={6}
                                    />
                                </Circle>
                                <Rect direction={"column"}>
                                    <Rect direction={"row"} alignItems={"end"}>
                                        <Txt
                                            fill={"#ffffff"}
                                            fontFamily={FONT.REGULAR}
                                            fontSize={36}
                                            text={this.title}
                                        />
                                        <Txt
                                            marginLeft={10}
                                            fill={"#ffffff"}
                                            fontFamily={FONT.REGULAR}
                                            fontSize={24}
                                            text={this.description}
                                        />
                                    </Rect>
                                    <SSStarRatingDisplayIcon starRating={()=>this.starDifficulty() * this.starTransitionPercentage()}/>
                                </Rect>
                            </Rect>
                        }
                    </Rect>
                </Rect>
            </Rect>
        )

        this.Init()
    }
}