import { CanvasStyleSignal, Img, ImgProps, Layout, PossibleCanvasStyle, Rect, RectProps, canvasStyleSignal, initial, signal, vector2Signal } from "@motion-canvas/2d";
import { PossibleVector2, SignalValue, SimpleSignal, Vector2, Vector2Signal, createRef } from "@motion-canvas/core";

export interface ImageDisplayProps extends RectProps {
    src: string
    iconFill?: SignalValue<PossibleCanvasStyle>
}

export class ImageDisplay extends Rect {
    @initial("#ffffff")
    @canvasStyleSignal()
    public declare readonly iconFill: CanvasStyleSignal<this>

    constructor(props: ImageDisplayProps){
        super({
            ...props,
            layout: false
        })

        const iref = createRef<Img>()

        this.add(
            <Img
                src={props.src}
                ref={iref}
            />
        )
        
        iref().scale(() => {
            const target = this.size()
            const source = iref().naturalSize()
            const scale = Math.min(target.width/source.width, target.height/source.height)
            return scale
        })
    }
}