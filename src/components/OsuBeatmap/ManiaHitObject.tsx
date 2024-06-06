import { Layout, Line, Node, Rect, RectProps, colorSignal, initial, signal } from "@motion-canvas/2d";
import { ColorSignal, PossibleColor, SignalValue, SimpleSignal } from "@motion-canvas/core";
import { Background } from "../Background";
import { IMG_RECYCLABLE_PAPER, IMG_RECYCLABLE_PLASTIC } from "../../imgs/recyclable";
import { ImageDisplay } from "../ImageDisplay";

export interface ManiaHitObjectProps extends RectProps {
    free?: SignalValue<boolean>
    accentColor?: SignalValue<PossibleColor>,
}

export class ManiaHitObject extends Rect {
    @initial("#000000")
    @colorSignal()
    public declare readonly accentColor: ColorSignal<this>;

    @initial(true)
    @signal()
    public declare readonly free: SimpleSignal<boolean, this>

    public setImg(img: string){
        const o = this.children()[0]
        o.children().forEach(i=>i.remove())
        const n = <ImageDisplay src={img} size={this.size}/>
        o.add(n)
    }

    constructor(props: ManiaHitObjectProps){
        super({
            offsetY: -1,
            height: 200,
            ...props,
        })

        this.add(
        <Rect
            fill={this.accentColor}
            size={this.size}
            radius={4.5}
            clip
            layout
            direction={"column"}
            justifyContent={"end"}
        />
        )
    }
}