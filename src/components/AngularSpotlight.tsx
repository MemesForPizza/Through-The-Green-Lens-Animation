import { Circle, Gradient, Node, NodeProps, Rect, RectProps, Spline, colorSignal, initial, signal } from "@motion-canvas/2d";
import { Color, ColorSignal, PossibleColor, PossibleVector2, SignalValue, SimpleSignal, createSignal } from "@motion-canvas/core";

export interface AngularSpotlightProps extends NodeProps {
    color?: SignalValue<PossibleColor>,
    closed?: SignalValue<boolean>,
    radius?: SignalValue<number>,
    angle?: SignalValue<number>,
    intensity?: SignalValue<number>,
    startOffset?: SignalValue<number>,
    endOffset?: SignalValue<number>
}

export class AngularSpotlight extends Node {
    @initial(true)
    @signal()
    public declare readonly closed: SimpleSignal<boolean, this>

    @initial(500)
    @signal()
    public declare readonly radius: SimpleSignal<number, this>

    @initial("#ffffff")
    @colorSignal()
    public declare readonly color: ColorSignal<this>

    @initial(45)
    @signal()
    public declare readonly angle: SimpleSignal<number, this>

    @initial(0)
    @signal()
    public declare readonly startOffset: SimpleSignal<number, this>

    @initial(0)
    @signal()
    public declare readonly endOffset: SimpleSignal<number, this>

    @initial(1)
    @signal()
    public declare readonly intensity: SimpleSignal<number, this>

    constructor(props: AngularSpotlightProps){
        super({
            ...props,
            cache: true
        })

        this.add(
            <Circle
                fill={()=>new Gradient({
                    "fromY": this.radius(),
                    "stops": [
                        {"color": this.color().alpha(0), offset: 0},
                        {"color": this.color().alpha(0), offset: this.endOffset()},
                        {"color": this.color(), offset: 1-this.startOffset()},
                        {"color": this.color(), offset: 1}
                    ],

                })}
                startAngle={()=>90-this.angle()/2}
                endAngle={()=>90+this.angle()/2}
                size={()=>this.radius()*2}
                closed={this.closed}
                opacity={this.intensity}
            />
        )
    }
}