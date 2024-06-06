import { Img, Length, Path, Rect, RectProps, Txt, initial, signal } from "@motion-canvas/2d";
import { DEFAULT, Reference, SignalValue, SimpleSignal, createRef, easeOutQuint } from "@motion-canvas/core";
import TextPropStyles from "../propstyles/text";
import LayoutStyles from "../propstyles/layout";
import CaretImg from "../../images/masks/caret-right-solid.svg"

export interface DropdownProps extends RectProps {
    text?: SignalValue<string>
}

export class Dropdown extends Rect {
    @initial("")
    @signal()
    public declare readonly text: SimpleSignal<string, this>

    // private declare readonly caretRef: Reference<Rect>
    private declare readonly bodyRef: Reference<Rect>

    public *open(duration = 0.25) {
        yield* this.bodyRef().height(DEFAULT, duration, easeOutQuint)
        // yield* this.caretRef().rotation(90, duration, easeOutQuint)
    }

    public *close(duration = 0.25) {
        yield* this.bodyRef().height(0, duration, easeOutQuint)
        // yield* this.caretRef().rotation(0, duration, easeOutQuint)
    }

    constructor(props: DropdownProps){
        super({
            width: "100%",
            direction: "column",
            fill: "#404040",
            padding: 20,
            margin: 10,
            radius: 24,
            ...props,
        })
        // this.caretRef = createRef<Rect>()
        this.bodyRef = createRef<Rect>()
        this.add(
            <Rect
                direction={"row"}
            >
                {/* <Rect
                    size={80}
                >
                    <Rect
                        layout={false}
                        cache
                        ref={this.caretRef}
                    >
                        <Img
                            src={CaretImg}
                            height={70}
                        />
                        <Rect
                            compositeOperation={"source-in"}
                            size={70}
                            fill={"#ffffff"}
                        />
                    </Rect>
                </Rect> */}
                <Txt
                    {...TextPropStyles.mainLight}
                    text={this.text}
                />
            </Rect>
        )
        this.add(
            <Rect
                width={"100%"}
                direction={"column"}
                height={0}
                ref={this.bodyRef}
                clip
            >
                {props.children}
            </Rect>
        )
    }
}