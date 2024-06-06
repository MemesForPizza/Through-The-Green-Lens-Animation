import { makeScene2D } from "@motion-canvas/2d";
import { SSInfoDisplay } from "../components/SSInfoDisplay";
import { createRef, easeInCubic, easeInQuint, easeOutQuint, linear, waitFor } from "@motion-canvas/core";
import testBackground from "../../images/images/background/bg2.jpg"
import { SSCarousel } from "../components/SSCarousel";
import { SSCarouselItem } from "../components/SSCarouselItem";

export default makeScene2D(function*(view){
    const c1 = createRef<SSCarouselItem>()
    const c2 = createRef<SSCarouselItem>()
    const c3 = createRef<SSCarouselItem>()
    const c4 = createRef<SSCarouselItem>()
    const c5 = createRef<SSCarouselItem>()

    //test area 
    const i = 
    <SSInfoDisplay
        topLeft={()=>[view.width()/-2, (view.height()/-2)+20]}
        width={1000}
        height={350}
    /> as SSInfoDisplay

    const c =
    <SSCarousel width={view.width} height={()=>view.height()-700} y={700/2} lineWidth={5} stroke={"#ffffff"}>
        <SSCarouselItem/>
        <SSCarouselItem subitem starDifficulty={5}/>
        <SSCarouselItem ref={c3} subitem starDifficulty={0}/>
        <SSCarouselItem ref={c1}/>
        <SSCarouselItem ref={c2}/>
        <SSCarouselItem subitem ref={c4} starDifficulty={6}/>
        <SSCarouselItem subitem starDifficulty={9}/>
        <SSCarouselItem ref={c5} subitem starDifficulty={4}/>
        <SSCarouselItem subitem starDifficulty={2}/>
        <SSCarouselItem subitem starDifficulty={0}/>
    </SSCarousel> as SSCarousel
    c.Start()
    view.add(c)
    view.add(i)
    yield* c.PopOut(0)
    yield* i.PopOut(0)
    yield* i.PopIn()
    yield* c.Select(c1())
    yield* c1().CursorEnter()
    yield* c1().CursorLeave ()
    yield* c.Select(c2())
    yield* c.Select(c3())
    yield* c.Select(c4())
    yield* c.Select(c5())
    yield* c.Select(c1()) 
    yield* c.scroll(0, 1, easeOutQuint)
    yield c3().starDifficulty(10, 2.6, easeOutQuint)
    yield* c1().Select()
    yield* c1().Deselect()
    yield* c5().Select()
    yield* c5().Deselect()
    yield* c.scroll(800, 1)
    yield* c.scroll(-800, 1)
    yield* c.scroll(0, 0.5)
    yield* i.PopOut()
    yield* i.PopIn()
    yield i.difficulty(10, 1, linear)
    yield* i.ratings([10, 10, 10, 10, 10, 10], 0.5, easeInQuint)
    yield* i.ratings([6, 5, 4, 3, 2, 1], 0.5, easeInQuint)
    yield* i.setBackground(testBackground)
    yield* i.PopOut()

    // yield* waitFor(5);return 
})