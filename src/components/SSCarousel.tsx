import { Rect, RectProps, initial, signal } from "@motion-canvas/2d";
import { Reference, SignalValue, SimpleSignal, ThreadGenerator, TimingFunction, createRef, delay, easeInExpo, easeInOutQuint, easeInQuint, easeOutExpo, easeOutQuint, linear, sequence, threadable, useScene, useThread } from "@motion-canvas/core";
import { SSCarouselItem } from "./SSCarouselItem";
import { SSInfoDisplay } from "./SSInfoDisplay";
import { Background } from "./Background";

export interface SSCarouselProps extends RectProps {
    scroll?: SignalValue<number>,
    time?: SignalValue<number>,
    playbackRate?: SignalValue<number>,
    display?: SSInfoDisplay,
    background?: Background
}

export class SSCarousel extends Rect {
    @initial(0)
    @signal()
    public declare readonly time: SimpleSignal<number, this>

    @initial(1)
    @signal()
    public declare readonly playbackRate: SimpleSignal<number, this>

    @initial(false)
    @signal()
    public declare readonly playing: SimpleSignal<boolean, this>

    @initial(0)
    @signal()
    public declare readonly scroll: SimpleSignal<number, this>

    public declare readonly containerRef: Reference<Rect>
    public declare readonly display: SSInfoDisplay | undefined
    public declare readonly background: Background | undefined

    private declare previousSelection: SSCarouselItem | undefined

    public Start() {
        const time = useThread().time
        const start = time()
        const offset = this.time()
        const playbackRate = this.playbackRate()
        this.playing(true)
        this.time(() => offset + (time() - start) * playbackRate)
    }

    public Stop() {
        this.playing(false)
        this.time.save()
    }

    @threadable("SSCarousel Select")
    public *Select(selection: SSCarouselItem, duration: number = 0.5, easing: TimingFunction = easeOutQuint): ThreadGenerator {
        const screenSize = useScene().getRealSize()
        const prevScroll = this.scroll()
        this.scroll(0)
        const sY = selection.absolutePosition().y
        this.scroll(prevScroll)
        
        if(this.display instanceof SSInfoDisplay){
            this.display.titleText(selection.title)
            this.display.descriptionText(selection.description)
            yield this.display.setBackground(selection.bg)
            yield this.display.ratings(selection.ratings, 0.5, easeOutQuint)
            yield this.display.difficulty(selection.starDifficulty, duration, easeOutQuint)
        }
        if(this.background instanceof Background){
            yield this.background.setBackground(selection.bg)
        }

        yield selection.Select()
        if(this.previousSelection)yield this.previousSelection.Deselect()

        this.previousSelection = selection
        yield* this.scroll(()=>{
            return (screenSize.y/2) - sY
        },  duration, easing)
    }

    @threadable("SSCarousel PopOut")
    public *PopOut(duration: number = 0.5, easing: TimingFunction = easeOutQuint){
        const screenSize = useScene().getRealSize()
        const prevScroll = this.scroll()
        this.scroll(0)
        const cY = this.containerRef().absolutePosition().y
        this.scroll(prevScroll)
        yield* this.scroll(()=>{
            return ((screenSize.y) - cY) + (this.containerRef().height()/2)
        },  duration, easing)
    }
    
    @threadable("SSCarousel PopIn")
    public *PopIn(selection: SSCarouselItem, duration: number = 1, easing: TimingFunction = easeOutQuint): ThreadGenerator{
        yield this.PopOut(0)
        this.containerRef().childrenAs<SSCarouselItem>().filter((e)=>e.subitem).forEach((e)=>e.starTransitionPercentage(0))
        yield this.opacity(0, 0).to(1, duration, easing)
        yield this.Select(selection, duration, easing)
        yield* delay(duration*0.1, sequence(0.05, ...this.containerRef().childrenAs<SSCarouselItem>().filter((e)=>e.subitem).map((e)=>e.starTransitionPercentage(0, 0).to(1, e.starDifficulty()/5, linear))))
    }

    constructor(props: SSCarouselProps) {
        super({
            ...props,
        })

        this.display = props.display
        this.background = props.background

        this.containerRef = createRef<Rect>()

        this.add(
            <Rect layout width={this.width} alignItems={"end"} direction={"column"} y={this.scroll} ref={this.containerRef}>
                {props.children}
            </Rect>
        )

        this.containerRef().children().forEach((child) => {
            // synchronize time signals
            if(child instanceof SSCarouselItem)child.time(this.time)
        })
    }
}