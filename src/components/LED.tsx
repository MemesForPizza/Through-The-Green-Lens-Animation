import { Circle, CircleProps, blur, initial, signal } from "@motion-canvas/2d";
import { SignalValue, SimpleSignal } from "@motion-canvas/core";

export interface LEDProps extends CircleProps {
    glow?: SignalValue<number>,
    glowScale?: SignalValue<number>
}

export class LED extends Circle {
    @initial(10)
    @signal()
    public declare readonly glow: SimpleSignal<number, this>

    @initial(1.3)
    @signal()
    public declare readonly glowScale: SimpleSignal<number, this>

    constructor(props: LEDProps){
        super({
            ...props
        })

        this.add(
            <Circle
                layout={false}
                size={this.size}
                fill={this.fill}
                scale={this.glowScale}
                filters={[blur(this.glow)]}
            />
        )
    }
}