import { CanvasStyleSignal, Img, ImgProps, Layout, PossibleCanvasStyle, Rect, RectProps, canvasStyleSignal, initial, signal, vector2Signal } from "@motion-canvas/2d";
import { PossibleVector2, SignalValue, SimpleSignal, Vector2, Vector2Signal, createRef } from "@motion-canvas/core";

export interface SolidIconProps extends RectProps {
    src: string
    iconFill?: SignalValue<PossibleCanvasStyle>
}

export class SolidIcon extends Rect {
    @initial("#ffffff")
    @canvasStyleSignal()
    public declare readonly iconFill: CanvasStyleSignal<this>

    constructor(props: SolidIconProps){
        super({
            ...props,
        })

        const iref = createRef<Img>()

        this.add(
            <Layout layout={false} cache>
                <Img
                    src={props.src}
                    ref={iref}
                />
                <Rect
                    fill={this.iconFill}
                    size={this.size}
                    compositeOperation={"source-in"}
                />
            </Layout>
        )
        
        iref().scale(() => {
            const target = this.size()
            const source = iref().naturalSize()
            const scale = Math.min(target.width/source.width, target.height/source.height)
            return scale
        })
    }
}