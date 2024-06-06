import { Circle, CircleProps, Img, Node, PossibleCanvasStyle, Rect, RectProps, Txt, blur, brightness, colorSignal, initial, signal } from "@motion-canvas/2d";
import TextPropStyles from "../propstyles/text";
import { Color, PossibleColor, Promisable, Reference, SignalValue, SimpleSignal, ThreadGenerator, TimingFunction, createComputed, createRef, createSignal, decorate, delay, easeOutCubic, easeOutQuint, linear, loop, loopFor, loopUntil, map, remap, run, sequence, threadable, usePlayback, useThread, useTime } from "@motion-canvas/core";
import world_map from "../../images/masks/world_map.svg"
import cloud_map from "../../images/masks/cloud.svg"
import { BeatSyncedController } from "../utils/BeatSyncedController";
import { OsuBeatSyncedController, OsuBeatSyncedParam } from "../utils/OsuBeatSyncedController";
import { FrameLoop } from "../utils/FrameLoop";

export interface EarthProps extends CircleProps {
    time?: SignalValue<number>
    playbackRate?: SignalValue<number>,
    landColor?: SignalValue<PossibleColor>,
    waterColor?: SignalValue<PossibleColor>,
    glowRadius?: SignalValue<number>,
    musicScalePercentage?: SignalValue<number>,
    beatSyncTo?: OsuBeatSyncedController,
    updateSource?: FrameLoop,
    kiaiBrightness?: SignalValue<number>,
    beatTargetScale?: SignalValue<number>,
    kiaiTargetScale?: SignalValue<number>
}

export class Earth extends Circle {
    @initial(0)
    @signal()
    public declare readonly time: SimpleSignal<number, this>

    @initial(false)
    @signal()
    public declare readonly playing: SimpleSignal<boolean, this>

    @initial(1)
    @signal()
    public declare readonly playbackRate: SimpleSignal<number, this>

    @initial("#00df00")
    @colorSignal()
    public declare readonly landColor: SimpleSignal<Color, this>

    @initial("#0060ff")
    @colorSignal()
    public declare readonly waterColor: SimpleSignal<Color, this>

    @initial(100)
    @signal()
    public declare readonly glowRadius: SimpleSignal<number, this>

    @initial(false)
    @signal()
    private declare readonly rippling: SimpleSignal<boolean, this>

    @initial(0)
    @signal()
    public declare readonly musicScalePercentage: SimpleSignal<number, this>
    
    @initial(1)
    @signal()
    private declare readonly beatContainerTargetScale: SimpleSignal<number, this>

    @initial(0.95)
    @signal()
    public declare readonly beatTargetScale: SimpleSignal<number, this>

    @initial(0.90)
    @signal()
    public declare readonly kiaiTargetScale: SimpleSignal<number, this>

    @initial(1.2)
    @signal()
    public declare readonly kiaiBrightness: SimpleSignal<number, this>
    
    @initial(10)
    @signal()
    public declare readonly beatTargetSpeed: SimpleSignal<number, this>

    @initial(20)
    @signal()
    public declare readonly kiaiTargetSpeed: SimpleSignal<number, this>

    public declare readonly internalElement: Reference<Circle>

    private declare readonly beatSyncTo: OsuBeatSyncedController | undefined
    private declare readonly updateSource: FrameLoop | undefined
    
    play(){
        this.playing(true)
        if(this.updateSource instanceof FrameLoop){
            // new update method
            const self = this
            this.updateSource.OnUpdate(function*(e){
                self.time(self.time() + e.delta * self.playbackRate())
            })
        } else {
            // classic update method
            const time = useThread().time
            const start = time()
            const offset = this.time()
            const playbackRate = this.playbackRate()
            this.time(() => offset + (time() - start) * playbackRate)
        }
    }

    constructor(props: EarthProps){
        super({
            rotation: 23.5,
            ...props,
            layout: false
        })

        const size = createSignal(()=>Math.min(this.width(), this.height()))
        const parralax = createSignal(()=>this.time())
        const cloudMap1 = createRef<Img>()
        const cloudMap2 = createRef<Img>()
        const worldMap1 = createRef<Img>()
        const worldMap2 = createRef<Img>()
        this.internalElement = createRef<Circle>()
        const self = this

        this.beatSyncTo = props.beatSyncTo
        this.updateSource = props.updateSource

        if(props.beatSyncTo instanceof BeatSyncedController){
            function* onNewBeat(e: OsuBeatSyncedParam){
                if(e.kiai){
                    yield self.internalElement().filters.brightness(self.kiaiBrightness, e.earlyActivation, easeOutCubic).to(1, props.beatSyncTo.getBeatLength() * 2, easeOutCubic)
                }
                if(self.updateSource instanceof FrameLoop) yield self.playbackRate(map(1, (e.kiai ? self.kiaiTargetSpeed() : self.beatTargetSpeed()), self.musicScalePercentage()), e.earlyActivation, easeOutCubic).to(1, props.beatSyncTo.getBeatLength() * 2, easeOutQuint)
                yield* self.beatContainerTargetScale(e.kiai ? self.kiaiTargetScale : self.beatTargetScale, e.earlyActivation, easeOutCubic).to(1, props.beatSyncTo.getBeatLength() * 2, easeOutQuint)
            }
            decorate(onNewBeat, threadable(`${this.key}: Beat`))
            props.beatSyncTo.onNewBeat(onNewBeat)
        }

        this.add(
            <Node scale={()=>map(1, this.beatContainerTargetScale(), this.musicScalePercentage())}>
                 <Circle ref={this.internalElement} size={size}>
                    {/* the earth's glow */}
                    <Circle
                        fill={this.waterColor}
                        size={size}
                        filters={[blur(this.glowRadius), brightness(1)]}
                    />
                    <Node cache>
                        {/* the mask of the earth */}
                        <Circle
                            size={size}
                            fill={"#ffffff"}
                        />
                        {/* the map of the earth */}
                        <Rect
                            compositeOperation={"source-in"}
                            fill={this.waterColor}
                            size={size}
                            
                        >
                            <Node cache>
                                <Node>
                                    <Img src={world_map} height={size} ref={worldMap1}/>
                                    <Img src={world_map} height={size} ref={worldMap2}/>
                                </Node>
                                <Rect
                                    compositeOperation={"source-in"}
                                    fill={this.landColor}
                                    size={size}
                                />
                            </Node>
                            <Node cache>
                                <Node>
                                    <Img src={cloud_map} height={size} ref={cloudMap1}/>
                                    <Img src={cloud_map} height={size} ref={cloudMap2}/>
                                </Node>
                                <Rect
                                    size={size}
                                    compositeOperation={"source-in"}
                                    fill={"#ffffff"}
                                    opacity={0.5}
                                />
                            </Node>
                        </Rect>
                    </Node>
                </Circle>
            </Node>
        )

        const worldMapWidth = createSignal(()=>worldMap1().width())
        const worldMapMultiplier = createSignal(0.01)
        const cloudMapWidth = createSignal(()=>cloudMap1().width())
        const cloudMapMultiplier = createSignal(0.013)

        worldMap1().x(()=>{
            let p = (parralax() * worldMapMultiplier() ) % 1
            if(p<0)p++
            const l = (worldMapWidth()/-2) + (size()/-2)
            const r = (worldMapWidth()/2) + (size()/2)
            return map(l, r, p)
        })
        worldMap2().x(()=>{
            let p = (parralax() * worldMapMultiplier() + 0.5 ) % 1
            if(p<0)p++
            const l = (worldMapWidth()/-2) + (size()/-2)
            const r = (worldMapWidth()/2) + (size()/2)
            return map(l, r, p)
        })
        cloudMap1().x(()=>{
            let p = (parralax() * cloudMapMultiplier() + 0.5 ) % 1
            if(p<0)p++
            const l = (cloudMapWidth()/-2) + (size()/-2)
            const r = (cloudMapWidth()/2) + (size()/2)
            return map(l, r, p)
        })
        cloudMap2().x(()=>{
            let p = (parralax() * cloudMapMultiplier() ) % 1
            if(p<0)p++
            const l = (cloudMapWidth()/-2) + (size()/-2)
            const r = (cloudMapWidth()/2) + (size()/2)
            return map(l, r, p)
        })
    }
}