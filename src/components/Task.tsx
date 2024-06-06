import { Rect, RectProps, Txt, initial, signal } from "@motion-canvas/2d";
import { SignalValue, SimpleSignal, ThreadGenerator, TimingFunction, easeOutQuint, threadable } from "@motion-canvas/core";
import { FONT } from "../constants/fon";

export interface TaskProps extends RectProps {
    title?: SignalValue<string>,
    description?: SignalValue<string>
}

export class Task extends Rect {
    @initial("Task Title")
    @signal()
    public declare readonly title: SimpleSignal<string, this>

    @initial("Description")
    @signal()
    public declare readonly description: SimpleSignal<string, this>

    @threadable("Task PopIn")
    public *PopIn(duration: number = 0.5, easing: TimingFunction = easeOutQuint): ThreadGenerator {
        yield this.opacity(1, duration, easing)
        yield* this.width(880, duration, easing)
    }

    @threadable("Task PopOut")
    public *PopOut(duration: number = 0.5, easing: TimingFunction = easeOutQuint): ThreadGenerator {
        yield this.opacity(0, duration, easing)
        yield* this.width(0, duration, easing)
    }

    constructor(props: TaskProps){
        super({
            layout: true,
            direction: "column",
            alignItems: "center",
            justifyContent: "center",
            width:880,
            height:200,
            radius: [0, 50, 50, 0],
            fill: "#000000",
            stroke: "#ffffff",
            lineWidth: 10,
            padding: 20,
            paddingLeft: 130,
            clip: true,
            ...props
        })

        this.add(
            <Txt
                text={this.title}
                fontFamily={FONT.REGULAR}
                fill={"#ffffff"}
                fontSize={90}
                textAlign={"center"}
            />
        )

        this.add(
            <Txt
                text={this.description}
                fontFamily={FONT.REGULAR}
                fill={"#ffffff"}
                fontSize={50}
                textAlign={"center"}
            />
        )
    }
}