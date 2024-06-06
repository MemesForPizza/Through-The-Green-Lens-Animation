import { Img, Node, Rect, RectProps, Txt, initial, signal } from "@motion-canvas/2d";
import { Color, SignalValue, SimpleSignal, createSignal } from "@motion-canvas/core";
import StarIcon from "../../images/masks/star-solid.svg"
import { FONT } from "../constants/fon";

export interface SSStarRatingDisplayProps extends RectProps {
    difficulty?: SignalValue<number>
}

export class SSStarRatingDisplay extends Rect {
    @initial(0)
    @signal()
    public declare readonly difficulty: SimpleSignal<number, this>

    constructor(props: SSStarRatingDisplayProps){
        super({
            height: 40,
            ...props,
            clip: true,
        })

        this.radius(()=>Math.min(this.width(), this.height())/2)

        const starsText = createSignal(()=>this.difficulty().toFixed(2))
        const foregroundColor = Color.createSignal(()=>this.difficulty()>=6.5?"#ffd966":"#000000")

        this.add(
            <Rect
                layout
                direction={"row"}
                alignContent={"center"}
                justifyContent={"center"}
                alignItems={"center"}
                marginLeft={10}
                marginRight={10}
            >
                <Rect width={20} height={20} marginRight={5} cache>
                    <Img
                        src={StarIcon}
                        height={20}
                    />
                    <Rect
                        layout={false}
                        width={50}
                        height={50}
                        fill={foregroundColor}
                        compositeOperation={"source-in"}
                    />
                </Rect>
                <Rect width={()=>66 + Math.max(starsText().length - 4, 0) * 16.5} alignContent={"center"} justifyContent={"center"} alignItems={"center"}>
                    <Txt
                        fontFamily={FONT.BOLD}
                        fontSize={30}
                        fill={foregroundColor}
                        text={starsText}
                    />
                </Rect>
            </Rect>
        )
    }
}