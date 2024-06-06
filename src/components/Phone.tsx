import { CanvasStyleSignal, PossibleCanvasStyle, Rect, RectProps, blur, brightness, canvasStyleSignal, initial, signal } from "@motion-canvas/2d";
import { Color, PossibleColor, Reference, SignalValue, SimpleSignal, createRef, map } from "@motion-canvas/core";

export interface PhoneProps extends RectProps {
    screenColor?: SignalValue<PossibleCanvasStyle>
}

export class Phone extends Rect {

    public declare readonly screen: Reference<Rect>
    public declare readonly glow: Reference<Rect>
    public declare readonly offScreen: Reference<Rect>

    @initial("#ffffff")
    @canvasStyleSignal()
    public declare readonly screenColor: CanvasStyleSignal<this>

    @initial(1)
    @signal()
    public declare readonly onValue: SimpleSignal<number, this>

    constructor(props: PhoneProps){
        super({
            ...props,
            fill: "#000000",
            layout: true,
            padding: 30,
            width: 500,
            height: 500 * 16 / 9,
            radius: 30
        })

        this.screen = createRef<Rect>()
        this.glow = createRef<Rect>()
        this.offScreen = createRef<Rect>() 

        this.add(
            <Rect
                layout={false}
                ref={this.offScreen}
                radius={10}
                fill={"#202020"}
            />
        )

        this.add(
            <Rect
                layout={false}
                filters={()=>[blur(80), brightness(map(2.5, 1, this.onValue()))]}
                radius={10}
                ref={this.glow}
            />
        )

        this.add(
            <Rect
                fill={this.screenColor}
                width={"100%"}
                height={"100%"}
                scaleY={this.onValue}
                radius={10}
                clip
                ref={this.screen}
                alignItems={"center"}
                justifyContent={"center"}
                filters={()=>[brightness(map(2.5, 1, this.onValue()))]}
            >
                {props.children}
            </Rect>
        )
        this.glow().fill(this.screen().fill)
        this.glow().width(this.screen().width)
        this.glow().height(()=>map(0, this.screen().height(), this.onValue()))
        this.offScreen().size(this.screen().size)
    }
}