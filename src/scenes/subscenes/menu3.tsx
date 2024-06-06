import { Rect, Txt, View2D, blur } from "@motion-canvas/2d";
import { Color, ThreadGenerator, TimingFunction, Vector2, all, any, chain, createRef, createSignal, decorate, easeInOutQuint, easeInQuint, easeOutCubic, easeOutExpo, easeOutQuint, isThreadGenerator, loop, makeRef, makeRefs, map, range, sequence, threadable, waitFor, waitUntil } from "@motion-canvas/core";
import LayoutStyles from "../../propstyles/layout";
import TextPropStyles from "../../propstyles/text";
import { Dropdown } from "../../components/Dropdown";
import { Cursor } from "../../components/Cursor";
import { Earth } from "../../components/Earth";
import { SSInfoDisplay } from "../../components/SSInfoDisplay";
import { SSCarousel } from "../../components/SSCarousel";
import { SSCarouselItem } from "../../components/SSCarouselItem";
import { Background } from "../../components/Background";
import { getDistance } from "../../utils/Vector2Utils";
import { SSBackgroundOverlay } from "../../components/SSBackgroundOverlay";
import Backgrounds from "../../imgs/background";
import startTrackingHover from "../../utils/SSCarouselHoverTracker";


export default function* SubScene(view: View2D, earth: Earth, cursor: Cursor): ThreadGenerator {
	// global refs
	const I: SSCarouselItem[] = []
	const IGroup = createRef<SSCarouselItem>()

	// objects
	const BG = (
		<Background
			size={view.size}
			opacity={0}
			filters={[blur(32)]}
		/>
	) as Background

	const BGOverlay = (
		<SSBackgroundOverlay
			size={view.size}
			color={"#00000040"}
			insetLength={870}
			transitionValue={0}
		/>
	) as SSBackgroundOverlay

	const InfoDisplay = (
		<SSInfoDisplay
			topLeft={()=>[view.width()/-2, (view.height()/-2)+20]}
			width={1000}
			height={350}
		/>
	)  as SSInfoDisplay


	const Carousel = (
		<SSCarousel
			width={view.width}
			height={()=>view.height()-700}
			y={700/2}
			display={InfoDisplay}
			time={earth.time}
			background={BG}
		>
			<SSCarouselItem title={"Introduction to Global Warming"} description={"Overview of Earth's rising temperatures and impacts"}  bg={Backgrounds.Introduction}/>
			<SSCarouselItem title={"Scientific Basis of Global Warming"} description={"The underlying science of climate change"} bg={Backgrounds.ScientificBasis}/>
			<SSCarouselItem title={"Evidence of Climate Change"} description={"Indicators of global environmental shifts"} bg={Backgrounds.Evidence}/>
			<SSCarouselItem title={"Impacts of Global Warming"} description={"Rising temperatures, extreme weather, and ecological disruption"} bg={Backgrounds.Impacts}/>
			<SSCarouselItem title={"Solutions to Global Warming"} description={"From the easiest to the hardest!"} ref={IGroup} bg={Backgrounds.Solutions} forceSelected/>
			<SSCarouselItem title={"Conserve Power"} description={"save some electricity!"} starDifficulty={1.4} subitem ref={makeRef(I, 0)} ratings={[9, 6, 2, 1, 0, 0]} bg={Backgrounds.ConservingPower}/>
			<SSCarouselItem title={"Reduce, Reuse, Recycle!"} description={"reduce waste!"} starDifficulty={1.5} subitem ref={makeRef(I, 1)} ratings={[7, 7, 6, 3, 1, 2]} bg={Backgrounds.Recycle}/>
			<SSCarouselItem title={"Public Transports"} description={"this reduces traffic too!"} starDifficulty={2.6} subitem ref={makeRef(I, 2)} ratings={[5, 8, 5, 3, 5, 1]} bg={Backgrounds.PublicTransport}/>
			<SSCarouselItem title={"Change Diet Habits"} description={"healthier option for your body!"} starDifficulty={3.2} subitem ref={makeRef(I, 3)} ratings={[5, 9, 4, 5, 0, 0]} bg={Backgrounds.DietHabits}/>
			<SSCarouselItem title={"Green Electricity"} description={"a greener alternative!"} starDifficulty={6.3} subitem ref={makeRef(I, 4)} ratings={[6, 8, 10, 8, 9, 10]} bg={Backgrounds.GreenElectricity}/>
			<SSCarouselItem title={"Adaptation Measures"} description={"Strategies to mitigate climate impacts"} bg={Backgrounds.AdaptationMeasures}/>
			<SSCarouselItem title={"Role of Technology and Innovation"} description={"Mitigating climate change through technology and innovation"} bg={Backgrounds.Technology}/>
			<SSCarouselItem title={"Policy and Governance"} description={"Strategic frameworks addressing climate change"} bg={Backgrounds.Policy}/>
			<SSCarouselItem title={"Public Awareness and Education"} description={"Promoting knowledge and action against climate change"} bg={Backgrounds.Awareness}/>
			<SSCarouselItem title={"Conclusion"} bg={Backgrounds.Conclusion}/>
		</SSCarousel>
	) as SSCarousel

	yield* InfoDisplay.PopOut(0)
	Carousel.opacity(0)
	earth.zIndex(100)
	view.add(BG)
	view.add(BGOverlay)
	view.add(Carousel)
	view.add(InfoDisplay)
	const CarouselContainer = Carousel.containerRef()
	earth.internalElement().stroke("#ffffff")
	cursor.position([-352, 473])
	yield all(
		cursor.PopIn(),
		view.fill("#000000", 0.5, easeOutQuint),
		BG.opacity(0.8, 0.5, easeOutQuint),
		earth.scale(1, 0.5, easeOutQuint),
		earth.glowRadius(0, 0.5, easeOutQuint),
		earth.internalElement().lineWidth(50, 0.5, easeOutQuint),
		earth.size(450, 0.5, easeOutQuint),
		earth.position([391, 865], 0.5, easeOutQuint),
		earth.musicScalePercentage(1, 0.5, easeOutQuint),
		BGOverlay.transitionValue(1, 1, easeOutExpo)
	)

	const hoverTracker = startTrackingHover(Carousel, cursor);
	yield hoverTracker.thread
	yield InfoDisplay.PopIn()
	yield Carousel.PopIn(I[1])
	yield* waitUntil("pause #7")
	yield* cursor.ClickOn(earth)
	hoverTracker.stop()
	yield all(
		Carousel.PopOut(0.5),
		InfoDisplay.PopOut(0.5),
		BG.internalFilters.blur(25, 0.5, easeOutQuint),
		BG.opacity(0, 0.5, easeOutQuint),
		BGOverlay.transitionValue(0, 0.5, easeOutQuint).do(()=>{
			BG.remove()
			BGOverlay.remove()
			Carousel.remove()
			InfoDisplay.remove()
		})
	)
}