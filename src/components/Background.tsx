import { Filter, FiltersSignal, Img, ImgProps, Node, Rect, RectProps, filtersSignal, initial, signal, vector2Signal } from "@motion-canvas/2d";
import DefaultBackground from '../../images/images/background/bg1.jpg'
import { DEFAULT, Reference, SignalValue, ThreadGenerator, Vector2, Vector2Signal, createRef, createRefArray, createSignal, easeOutQuint, linear, threadable } from "@motion-canvas/core";
import Backgrounds from "../imgs/background";

export interface BackgroundProps extends RectProps {
    internalFilters?: SignalValue<Filter>,
    src?: string
}

export class Background extends Rect {
    @initial([])
    @filtersSignal()
    public declare readonly internalFilters: FiltersSignal<this>


    @threadable("background set")
    public *setBackground(src: string, duration: number = 1): ThreadGenerator{
        if(typeof src !== "string")src = Backgrounds.DEFAULT
        const animationPercentage = createSignal(0)
        const newImg = <BackgroundImg src={src} targetBackgroundSize={this.size} filters={this.internalFilters} cache cachePadding={this.internalFilters.blur}/>
        yield newImg    
        const deletionQueue = createRefArray<Img>()
        this.ActiveArea().children().forEach((img: Img)=>{
            // move all active <Img>s to the post area
            deletionQueue.push(img)
            this.PostActiveArea().add(img)
        })
        newImg.opacity(()=>easeOutQuint(animationPercentage()))
        this.ActiveArea().add(newImg)
        yield* animationPercentage(1, duration, linear)
        deletionQueue.forEach((img) => img.remove())
    }

    private declare readonly PreActiveArea: Reference<Node>
    private declare readonly ActiveArea: Reference<Node>
    private declare readonly PostActiveArea: Reference<Node>

    constructor(props: BackgroundProps){
        super({
            ...props,
            layout: false
        })

        this.PreActiveArea = createRef<Node>()
        this.ActiveArea = createRef<Node>()
        this.PostActiveArea = createRef<Node>()

        this.add(
            <Node ref={this.PostActiveArea}>

            </Node>
        )

        this.add(
            <Node ref={this.ActiveArea}>
                <BackgroundImg src={props.src??DefaultBackground} targetBackgroundSize={this.size} filters={this.internalFilters} cache cachePadding={this.internalFilters.blur}/>
            </Node>
        )

        this.add(
            <Node ref={this.PreActiveArea}>

            </Node>
        )
    }
}

interface BackgroundImgProps extends ImgProps {
    targetBackgroundSize?: SignalValue<Vector2>
}

class BackgroundImg extends Img {
    @initial(new Vector2(0, 0))
    @signal()
    public declare readonly targetBackgroundSize: Vector2Signal<this>

    constructor(props: BackgroundImgProps){
        super({
            ...props,
        })
        
        this.scale(() => {
            const target = this.targetBackgroundSize()
            const source = this.naturalSize()
            const scale = Math.max(target.width/source.width, target.height/source.height)
            return scale
        })

    }
}