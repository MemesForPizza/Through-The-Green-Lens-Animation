import { Path, PathProps, Rect, RectProps, Spline, colorSignal, initial, signal } from "@motion-canvas/2d";
import { ColorSignal, PossibleColor, SignalValue, SimpleSignal, createSignal, map } from "@motion-canvas/core";

const ShearRatio = 36.75/200

export interface SSBackgroundOverlayProps extends RectProps {
    color?: SignalValue<PossibleColor>,
    transitionValue?: SignalValue<number>,
    insetLength?: SignalValue<number>
}

export class SSBackgroundOverlay extends Rect {
    @initial("#00000080")
    @colorSignal()
    public declare readonly color: ColorSignal<this>

    @initial(1)
    @signal()
    public declare readonly transitionValue: SimpleSignal<number, this>

    @initial(0)
    @signal()
    public declare readonly insetLength: SimpleSignal<number, this>

    constructor(props: SSBackgroundOverlayProps){
        super({
            ...props
        })

        const Top = createSignal(()=>this.height()/2)
        const Bottom = createSignal(()=>this.height()/-2)
        const Left = createSignal(()=>this.width()/-2)
        const Right = createSignal(()=>this.width()/2)

        const computedInsetLength = createSignal(()=>map(0, this.insetLength(), this.transitionValue()))

        this.add(
            <Spline
                fill={this.color}
                smoothness={0}
                opacity={this.transitionValue}
                points={()=>[
                    [Left(), Top()],
                    [Right() - computedInsetLength() + (Top() * ShearRatio), Top()],
                    [Right() - computedInsetLength(), 0],
                    [Right() - computedInsetLength() + (Top() * ShearRatio), Bottom()],
                    [Left(), Bottom()]
                ]}
            />
        )
    }
}