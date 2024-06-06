import { Layout, Length, Rect, RectProps, Txt, initial, signal } from "@motion-canvas/2d";
import { PossibleColor, Signal, SignalValue, SimpleSignal, createRef, createSignal, range, remap, useThread } from "@motion-canvas/core";
import { Beatmap } from "osu-classes"
import { OsuManiaLane } from "./ManiaLane";
import { splitLanes } from "./ManiaUtils";
import { ManiaHitObject } from "./ManiaHitObject";
import { PoolManager } from "../../utils/poolManager";

import ICON_PAPER from "../../../images/masks/newspaper-solid.svg"
import ICON_PLASTIC from "../../../images/masks/bottle-water-solid.svg"
import ICON_GLASS from "../../../images/masks/wine-glass-empty-solid.svg"
import ICON_METAL from "../../../images/masks/bridge-solid.svg"

import IMG_RECYCLABLE from "../../imgs/recyclable";
import { FONT } from "../../constants/fon";
import { Earth } from "../Earth";

const ICONS = [ICON_PAPER, ICON_PLASTIC, ICON_GLASS, ICON_METAL]
const NAMES = ["Paper", "Plastic", "Glass", "Metal"]
const KEYS = ["paper", "plastic", "glass", "metal"]
type recyclables = "paper" | "plastic" | "glass" | "metal"

const OSU_RULESETS = ["osu", "taiko", "fruits", "mania"]

export interface OsuManiaBeatmapProps extends RectProps {
    time?: SignalValue<Number>
    beatmap: SignalValue<Beatmap>
    laneLength?: SignalValue<Length>
    laneWidth?: SignalValue<Length>
    laneMargin?: SignalValue<number>
    playbackRate?: SignalValue<number>
    accentColors?: SignalValue<PossibleColor[]>,
    viewRange?: SignalValue<number>,
    earth?: Earth
}

export class OsuManiaBeatmap extends Rect {
    @initial(0)
    @signal()
    public declare readonly time: SimpleSignal<number, this>

    @signal()
    public declare readonly beatmap: SimpleSignal<Beatmap, this>

    @initial("30%")
    @signal()
    public declare readonly laneLength: SimpleSignal<Length, this>

    @initial(200)
    @signal()
    public declare readonly laneWidth: SimpleSignal<number, this>

    @initial(4.5333)
    @signal()
    public declare readonly laneMargin: SimpleSignal<number, this>

    @initial(false)
    @signal()
    public readonly playing: SimpleSignal<boolean, this>

    @initial(1)
    @signal()
    public readonly playbackRate: SimpleSignal<number, this>

    @initial(["#00a0ff", "#ffff00", "#00ff00", "#ff4040"])
    @signal()
    public readonly accentColors: SimpleSignal<PossibleColor[], this>

    @initial(1)
    @signal()
    public readonly viewRange: SimpleSignal<number, this>

    @initial(0)
    @signal()
    public readonly startCutoff: SimpleSignal<number, this>

    public readonly creditsElement = createRef<Txt>()

    play(){
        const time = useThread().time
        this.playing(true)
        this.startCutoff(time())
        this.time(time)
    }

    pause(){
        this.playing(false)
        this.time.save()
    }

    private getAccentColor(index: number): PossibleColor{
        return this.accentColors()[index] ?? "#000000"
    }

    private pool = new PoolManager<ManiaHitObject>(5,
        () => {
            return new ManiaHitObject({})
        },
        (obj: ManiaHitObject) => {
            obj.position([0, 0])
        }
    )

    public constructor(props?: OsuManiaBeatmapProps) {
        super({
            ...props,
            justifyContent: "center",
            alignItems: "center",
        })

        const rangeTemp = createSignal(()=>this.viewRange())

        // hit object view ranges
        const hitObjectRange = createSignal(()=>[this.time(), this.time()+rangeTemp()] as [number, number])

        const laneContainer = createRef<Rect>()
        const laneHitObjects = createSignal(() => splitLanes(this.beatmap()))

        // generate the lanes
        this.add(
            <Layout
                layout
                size={this.size}
                padding={0}
                ref={laneContainer}
                alignItems={"center"}
                justifyContent={"center"}
            >
                {range(this.beatmap().difficulty.circleSize).map((i)=>
                    <OsuManiaLane
                        height={"100%"}
                        // width={()=>this.laneWidth() * (+(i == Math.floor(this.beatmap().difficulty.circleSize/2)) + 1)}
                        width={()=>this.laneWidth()}
                        marginLeft={()=>this.laneMargin()/2}
                        marginRight={()=>this.laneMargin()/2}
                        hitObjectRange={hitObjectRange}
                        hitObjects={laneHitObjects()[i]}
                        accentColor={this.getAccentColor(i)}
                        startCutoff={this.startCutoff}
                        pool={this.pool}
                        icon={ICONS[i]}
                        name={NAMES[i]}
                        images={IMG_RECYCLABLE[KEYS[i] as recyclables]}
                        b={()=>{
                            if(!(props.earth instanceof Earth))return 0.5
                            const e = props.earth
                            return remap(1, e.kiaiBrightness(), 0.5, 0.8, e.internalElement().filters.brightness())
                        }}
                    />
                )}
            </Layout>
        )

        this.add(
            <Layout layout={false}>
                <Txt 
                    y={()=>(this.height()/2)+10}
                    fill={"#ffffff"}
                    fontFamily={FONT.REGULAR}
                    fontSize={25}
                    offsetY={-1}
                    opacity={()=>{
                        if(!(props.earth instanceof Earth))return 0.5
                        const e = props.earth
                        return remap(1, e.kiaiBrightness(), 0.5, 0.8, e.internalElement().filters.brightness())
                    }}
                    textAlign={"center"}
                    text={()=>
                        `${this.beatmap().metadata.title} by ${this.beatmap().metadata.artist}, mapped by ${this.beatmap().metadata.creator} \n` +
                        `URL: https://osu.ppy.sh/beatmapsets/${this.beatmap().metadata.beatmapSetId}#${OSU_RULESETS[this.beatmap().originalMode]}/${this.beatmap().metadata.beatmapId}`
                    }
                    ref={this.creditsElement}
                />
            </Layout>
        )
    }
}