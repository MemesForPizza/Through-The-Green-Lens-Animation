import { ThreadGenerator, all, decorate, isThreadGenerator, threadable } from "@motion-canvas/core"
import { SSCarouselItem } from "../components/SSCarouselItem"
import { Rect, is } from "@motion-canvas/2d"
import { Cursor } from "../components/Cursor"
import { SSCarousel } from "../components/SSCarousel"

export default function startTrackingHover(Carousel: SSCarousel, cursor: Cursor) {
    let running = true
    function* threadGenerator(): ThreadGenerator {
        while(running){
            yield // this fixes losing track of hover states probably because... i don't know??!?!?!?
            yield all(
                ...Carousel.findAll(is(SSCarouselItem)).map((item)=>{
                    const hoverState = item.isHovering(cursor.absolutePosition())
                    if(item.previousHoverState() === hoverState) return undefined
                    // the state has changed!
                    item.previousHoverState(hoverState)
                    return hoverState ? item.CursorEnter() : item.CursorLeave()
                }).filter((v)=>isThreadGenerator(v)),
            )
        }
    }
    decorate(threadGenerator, threadable("menu scene carousel hover state tracker"))
    return {
        "thread": threadGenerator(),
        "stop": function(){
            if(!running)return
            running = false
        }
    }
}