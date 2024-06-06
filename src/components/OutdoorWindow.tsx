import { CanvasStyle, CanvasStyleSignal, Node, Rect, RectProps, blur, canvasStyleSignal, initial, signal } from "@motion-canvas/2d";
import { Reference, SignalValue, SimpleSignal, createRef } from "@motion-canvas/core";
import { CursorPointTracker } from "./CursorPointTracker";

export interface OutdoorWindowProps extends RectProps {
    openness?: SignalValue<number>
}

export class OutdoorWindow extends Rect {
    @initial(1)
    @signal()
    public declare readonly openness: SimpleSignal<number, this>

    public declare readonly cursorTracker: Reference<CursorPointTracker>

    constructor(props: OutdoorWindowProps){
        super({
            ...props,
            strokeFirst: true
        })

        this.cursorTracker = createRef<CursorPointTracker>()

        // this.add(
        //     <Rect
        //         fill={this.fill}
        //         size={this.size}
        //         scale={1.2}
        //         filters={[blur(200)]}
        //     />
        // )

        this.add(
            <Rect
                size={this.size}
                fill={this.fill}
                stroke={this.stroke}
                lineWidth={()=>this.lineWidth()}
                radius={this.radius}
                strokeFirst
            >
                {props.children}
            </Rect>
        )

        this.add(
            <Rect
                size={this.size}
                offsetX={1}
                x={()=>this.width()/2}
                scaleX={this.openness}
                fill={"#b5b5b5a0"}
            >
                <Rect
                    width={()=>this.lineWidth()/2}
                    height={this.height}
                    fill={this.stroke}
                />
                <Rect
                    width={this.width}
                    height={()=>this.lineWidth()/2}
                    fill={this.stroke}
                />
                <Rect
                    x={(this.width()/-2)-(this.lineWidth()/4)}
                    width={()=>this.lineWidth()/2}
                    height={this.height}
                    fill={this.stroke}
                />
                <CursorPointTracker x={()=>this.width()/-2} ref={this.cursorTracker}/>
            </Rect>
        )
    }
}