import { Gradient, Layout, Node, Rect, RectProps, Spline, Txt, TxtProps, blur, initial, signal } from "@motion-canvas/2d";
import { Color, ColorSignal, RAD2DEG, Reference, Signal, SignalValue, SimpleSignal, ThreadGenerator, createRef, decorate, easeInCubic, easeInOutCubic, easeOutCubic, easeOutQuint, linear, threadable } from "@motion-canvas/core";
import { ProgressBar } from "./ProgressBar";
import { getStarDifficultyColor } from "../utils/ColorUtils";
import { Round } from "../utils/MathUtils";
import { SSStarRatingDisplay } from "./SSStarRatingDisplay";
import LayoutStyles from "../propstyles/layout";
import { Background } from "./Background";
import { FONT } from "../constants/fon";

const AttrTextStyle: TxtProps = {
    "fontFamily": FONT.REGULAR,
    "fill": "#ffffff",
    "fontSize": 36
}

const ProgressTextStyle: TxtProps = {
    "fontFamily": FONT.REGULAR,
    "fill": "#ffffff",
    "fontSize": 24  
}

export interface SSInfoDisplayProps extends RectProps {
    ratings?: SignalValue<number[]>,
    difficulty?: SignalValue<number>,
    actionText?: SignalValue<string>,
    titleText?: SignalValue<string>,
    descriptionText?: SignalValue<string>
}

const ShearRatio = 36.75/200
const RatingPadding = 20

export class SSInfoDisplay extends Rect {
    @initial("#aaaaaa")
    @signal()
    private declare readonly difficultyColor: ColorSignal<this>

    @initial(0)
    @signal()
    public declare readonly difficulty: SimpleSignal<number, this>

    @initial([0, 0, 0, 0, 0, 0])
    @signal()
    public declare readonly ratings: SimpleSignal<[number, number, number, number, number, number], this>

    @initial("")
    @signal()
    public declare readonly actionText: SimpleSignal<string, this>

    @initial("no selection made!")
    @signal()
    public declare readonly titleText: SimpleSignal<string, this>

    @initial("please make a selection!")
    @signal()
    public declare readonly descriptionText: SimpleSignal<string, this>

    private declare readonly backgroundRef: Reference<Background>

    public declare readonly mainRef: Reference<Node>
    public declare readonly statsRef: Reference<Node>

    public *setBackground(src: string, duration: number = 1): ThreadGenerator {
        yield* this.backgroundRef().setBackground(src, duration)
    }

    @threadable("SSInfoDisplay popIn")
    public *PopIn(duration: number = 0.8){
        yield this.mainRef().x(0, duration, easeOutQuint)
        yield* this.opacity(1, duration, easeOutQuint)
    }

    @threadable("SSInfoDisplay popOut")
    public *PopOut(duration: number = 0.8){
        yield this.opacity(0, duration, easeInOutCubic)
        yield* this.mainRef().x(-100, duration, easeInOutCubic)
    }

    constructor(props: SSInfoDisplayProps){
        super({
            ...props,
        })

        this.backgroundRef = createRef<Background>()
        this.difficultyColor(()=>getStarDifficultyColor(this.difficulty()))

        this.mainRef = createRef<Node>()
        this.statsRef = createRef<Node>()

        this.add(
            <Node ref={this.mainRef}>
                <Spline
                    lineWidth={10}
                    fill={"#ddffff"}
                    stroke={"#ddffff"}
                    offset={1}
                    points={()=>[
                        [0, 0],
                        [0, this.height()],
                        [this.width()-(ShearRatio*this.height()), this.height()],
                        [this.width(), 0],
                        [0, 0]
                    ]}
                    smoothness={0}
                    strokeFirst={true}
                    filters={[blur(15)]}
                />
                <Spline
                    lineWidth={10}
                    fill={"#000000"}
                    stroke={"#ddffff"}
                    offset={1}
                    points={()=>[
                        [0, 0],
                        [0, this.height()],
                        [this.width()-(ShearRatio*this.height()), this.height()],
                        [this.width(), 0],
                        [0, 0]
                    ]}
                    smoothness={0}
                    strokeFirst={true}
                    clip
                >
                    <Rect width={()=>this.width()-30} height={this.height} x={30} offset={-1}>
                        <Background
                            height={this.height}
                            width={()=>this.width()-30}
                            ref={this.backgroundRef}/>
                        <Rect
                            opacity={0.6}
                            height={this.height}
                            width={this.width()-30}
                            fill={() => new Gradient({
                                from: [0, -this.height()/2],
                                to: [0, this.height()/2],
                                stops: [
                                    {color: "#00000000", offset: 0},
                                    {color: "#000000ff", offset: 0.7}
                                ]
                            })}
                        />
                    </Rect>
                    <Rect
                        offset={-1}
                        height={this.height}
                        width={30}
                        fill={this.difficultyColor}
                    />
                    <Rect
                        x={30}
                        offset={-1}
                        height={this.height}
                        width={20}
                        fill={this.difficultyColor}
                        opacity={0.5}
                    />
                    <Rect
                        x={50}
                        offset={-1}
                        width={()=>this.width()-50}
                        height={this.height}
                        padding={30}
                        direction={"column"}
                        layout
                    >
                        <Rect width={"100%"} height={"60%"} direction={"column"}>
                            <Rect direction={"row"} width={"100%"} justifyContent={"space-between"} alignItems={"center"} alignContent={"center"}>
                                <Txt fill={"#ffffff"} fontFamily={FONT.REGULAR} fontSize={36} text={this.actionText}/>
                                <Rect width={128} marginRight={12} alignContent={"center"} justifyContent={"center"} alignItems={"center"}>
                                    <SSStarRatingDisplay fill={this.difficultyColor} difficulty={this.difficulty}></SSStarRatingDisplay>
                                </Rect>
                            </Rect>
                        </Rect>
                        <Rect width={"100%"} height={"40%"} direction={"column"}>
                            <Txt fill={"#ffffff"} fontFamily={FONT.REGULAR} fontSize={48} text={this.titleText}/>
                            <Txt fill={"#ffffff"} fontFamily={FONT.REGULAR} fontSize={32} text={this.descriptionText}/>
                        </Rect>
                    </Rect>
                </Spline>
            </Node>
        )

        this.add(
            <Rect
                ref={this.statsRef}
                fill={"#000000b2"}
                radius={20}
                width={()=>this.width() - (ShearRatio*this.height()) - 50 - 20}
                y={()=>(this.height()/2) + 20}
                x={()=>(this.width()/-2) + 50}
                offset={-1}
                padding={RatingPadding}
                layout
                direction={"row"}
            >
                <Rect direction={"column"} width={"100%"} marginRight={RatingPadding/2}>
                    <Txt {...AttrTextStyle}>Convenience</Txt>
                    <Rect direction={"row"} alignItems={"center"}>
                        <ProgressBar width={"100%"} height={12} radius={6} progress={()=>this.ratings()[0]/10}/>
                        <Rect width={30} direction={"row"} justifyContent={"end"}>
                            <Txt {...ProgressTextStyle} text={()=>`${Math.round(this.ratings()[0])}`}></Txt>
                        </Rect>
                    </Rect>
                    <Txt {...AttrTextStyle}>Impact</Txt>
                    <Rect direction={"row"} alignItems={"center"}>
                        <ProgressBar width={"100%"} height={12} radius={6} progress={()=>this.ratings()[1]/10}/>
                        <Rect width={30} direction={"row"} justifyContent={"end"}>
                            <Txt {...ProgressTextStyle} text={()=>`${Math.round(this.ratings()[1])}`}></Txt>
                        </Rect>
                    </Rect>
                    <Txt {...AttrTextStyle}>Scalability</Txt>
                    <Rect direction={"row"} alignItems={"center"}>
                        <ProgressBar width={"100%"} height={12} radius={6} progress={()=>this.ratings()[2]/10}/>
                        <Rect width={30} direction={"row"} justifyContent={"end"}>
                            <Txt {...ProgressTextStyle} text={()=>`${Math.round(this.ratings()[2])}`}></Txt>
                        </Rect>
                    </Rect>
                </Rect>
                <Rect direction={"column"} width={"100%"} marginLeft={RatingPadding/2}>
                    <Txt {...AttrTextStyle}>Tediousness</Txt>
                    <Rect direction={"row"} alignItems={"center"}>
                        <ProgressBar width={"100%"} height={12} radius={6} progress={()=>this.ratings()[3]/10}/>
                        <Rect width={30} direction={"row"} justifyContent={"end"}>
                            <Txt {...ProgressTextStyle} text={()=>`${Math.round(this.ratings()[3])}`}></Txt>
                        </Rect>
                    </Rect>
                    <Txt {...AttrTextStyle}>Risk</Txt>
                    <Rect direction={"row"} alignItems={"center"}>
                        <ProgressBar width={"100%"} height={12} radius={6} progress={()=>this.ratings()[4]/10}/>
                        <Rect width={30} direction={"row"} justifyContent={"end"}>
                            <Txt {...ProgressTextStyle} text={()=>`${Math.round(this.ratings()[4])}`}></Txt>
                        </Rect>
                    </Rect>
                    <Txt {...AttrTextStyle}>Cost</Txt>
                    <Rect direction={"row"} alignItems={"center"}>
                        <ProgressBar width={"100%"} height={12} radius={6} progress={()=>this.ratings()[5]/10}/>
                        <Rect width={30} direction={"row"} justifyContent={"end"}>
                            <Txt {...ProgressTextStyle} text={()=>`${Math.round(this.ratings()[5])}`}></Txt>
                        </Rect>
                    </Rect>
                </Rect>
            </Rect>
        )
    }
}