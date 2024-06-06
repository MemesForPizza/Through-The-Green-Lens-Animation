import { CanvasStyleSignal, PossibleCanvasStyle, Rect, RectProps, canvasStyleSignal, colorSignal, initial, signal } from "@motion-canvas/2d";
import { Color, ColorSignal, PossibleColor, SignalValue, SimpleSignal } from "@motion-canvas/core";

export interface ProgressBarProps extends RectProps {
    backgroundColor?: SignalValue<PossibleColor>
    progressFill?: SignalValue<PossibleCanvasStyle>
    progress?: SignalValue<number>
}

export class ProgressBar extends Rect {
    @initial("#808080")
    @colorSignal()
    public declare readonly backgroundColor: ColorSignal<this>

    @initial("#ffffff")
    @canvasStyleSignal()
    public declare readonly progressFill: CanvasStyleSignal<this>

    @initial(0.5)
    @signal()
    public declare readonly progress: SimpleSignal<number, this>

    constructor(props: ProgressBarProps){
        super({
            clip: true,
            ...props,
        })

        // this.layout(false)
        this.fill(this.backgroundColor)
        this.add(
            <Rect
                layout={false}
                fill={this.progressFill}
                height={this.height}
                width={()=>this.width() * this.progress()}
                x={()=>(this.width() * this.progress() / 2) - (this.width() / 2)}
            />
        )

    }
}