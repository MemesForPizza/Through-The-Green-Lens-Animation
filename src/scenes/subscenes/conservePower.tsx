import { Circle, Gradient, Layout, Node, Path, Rect, Spline, Txt, View2D, blur, colorSignal } from "@motion-canvas/2d";
import { Color, EPSILON, PossibleColor, ThreadGenerator, all, createRef, createSignal, delay, easeInCubic, easeInExpo, easeInOutCirc, easeInOutExpo, easeInOutQuint, easeInQuart, easeInQuint, easeInSine, easeOutBack, easeOutBounce, easeOutCirc, easeOutCubic, easeOutExpo, easeOutQuint, easeOutSine, linear, map, waitFor, waitUntil } from "@motion-canvas/core";
import { Earth } from "../../components/Earth";
import { Cursor } from "../../components/Cursor";
import { Task } from "../../components/Task";
import { WallSwitch } from "../../components/WallSwitch";
import { AngularSpotlight } from "../../components/AngularSpotlight";
import { Phone } from "../../components/Phone";
import TextPropStyles from "../../propstyles/text";
import { FONT } from "../../constants/fon";
import { TriangleBackground } from "../../components/TriangleBackground";
import { AirConditioner } from "../../components/AirConditioner";
import { CursorPointTracker } from "../../components/CursorPointTracker";
import { OutdoorWindow } from "../../components/OutdoorWindow";
import { Background } from "../../components/Background";
import IMG_Grasslands from "../../../images/images/background/grasslands.jpg"
import { SolidIcon } from "../../components/SolidIcon";

import ICON_LIFE from "../../../images/masks/shield-heart-solid.svg"
import ICON_PLUG from "../../../images/masks/plug-solid.svg"
import { ProgressBar } from "../../components/ProgressBar";
import { Dialogue } from "../../components/Dialogue";
import LayoutStyles from "../../propstyles/layout";
import { animateDialogue, prepareDialogue } from "../../utils/DOMUtils";


export default function* SubScene(view: View2D, earth: Earth, cursor: Cursor): ThreadGenerator {
    earth.internalElement().stroke("#ffffff")
    earth.zIndex(100)

    const light = createRef<AngularSpotlight>()
    const wallSwitch = createRef<WallSwitch>()
    const phone = createRef<Phone>()
    const phoneCharger = createRef<Spline>()
    const phoneChargerHead = createRef<Rect>()
    const cursorTracker = createRef<CursorPointTracker>()
    const airConditioner = createRef<AirConditioner>()
    const outdoorWindow = createRef<OutdoorWindow>()
    const windowBackground = createRef<TriangleBackground>()

    const task = (
        <Task
            left={earth.position}
            title={"Conserve Power"}
            description={"save some electricity!"}
        />
    ) as Task


    const darkenFilter = (
        <Rect fill={"#000000"} size={view.size} opacity={0} zIndex={1000}/>
    ) as Rect
    const scene = (
        <Node
            // scale={0.2}
        >
            <WallSwitch
                OnColor={"#bfffbf"}
                OffColor={"#ffbfbf"}
                opacity={0}
                scale={0.8}
                ref={wallSwitch}
            />
            <AngularSpotlight
                y={-1200}
                opacity={0.3}
                radius={2500}
                angle={0}
                endOffset={0.3}
                ref={light}
            />
            <Phone
                x={view.width}
                ref={phone}
                screenColor={()=>new Gradient({
                    from: [0, ((500 * 16 / 9)-(30*2))/-2],
                    to: [0, ((500 * 16 / 9)-(30*2))/2],
                    stops: [
                        {color: "#24505f", offset: 0},
                        {color: "#397083", offset: 1}
                    ]
                })}
            >
                <TriangleBackground
                    width = {(500)-(30*2)}
                    height = {(500 * 16 / 9)-(30*2)}
                    time={earth.time}
                    baseVelocity={0.02}
                    colorDark={"#24505f"}
                    colorLight={"#397083"}
                    triangleScale={3}
                    fill={()=>new Gradient({
                        from: [0, ((500 * 16 / 9)-(30*2))/-2],
                        to: [0, ((500 * 16 / 9)-(30*2))/2],
                        stops: [
                            {color: "#24505f", offset: 0},
                            {color: "#397083", offset: 1}
                        ]
                    })}
                />
            </Phone>
            <Rect
                zIndex={-1}
                width={50}
                height={80}
                ref={phoneChargerHead}
                fill={"#000000"}
                offsetY={-1} 
                position={phone().bottom()}
                radius={[5, 5, 20, 20]}
            >
                <Rect
                    fill={"#ffffff"}
                    y={-40}
                    offsetY={1}
                    width={30} 
                    height={20}
                />
            </Rect>
            <Spline
                zIndex={-1}
                lineWidth={30}
                stroke={"#000000"}
                ref={phoneCharger}
                points={()=>[
                    [view.width()-400, 1200],
                    [view.width()-118, 1200],
                    phoneChargerHead().position(),
                ]}
            />
            <AirConditioner
                x={()=>(view.width()*2)+5000}
                y={-2300}
                ref={airConditioner}
            />
            <OutdoorWindow
                x={airConditioner().x}
                y={1500}
                width={3000}
                height={4000}
                // fill={new Gradient(
                //     {
                //         fromY: -1500,
                //         toY: 1500,
                //         stops: [
                //             {"color": "#78dfff", "offset":0},
                //             {"color": "#00c3ff", "offset":1}
                //         ]
                //     }
                // )}
                fill={new Gradient(
                    {
                        fromY: -2000,
                        toY: 2000,
                        stops: [
                            {"color": "#5782c6", "offset":0},
                            {"color": "#83922a", "offset":1}
                        ]
                    }
                )}
                stroke={"#ffffff"}
                lineWidth={400}
                ref={outdoorWindow}
            >
                <Background
                    width={3000}
                    height={4000}
                    src={IMG_Grasslands}
                    clip
                />
                {/* <TriangleBackground
                    size={3000}
                    triangleScale={8}
                    baseVelocity={0.02}
                    spawnAmount={80 }
                    colorDark={"#00c3ff"}
                    colorLight={"#78dfff"}
                    clip
                    ref={windowBackground}
                /> */}
            </OutdoorWindow>
            <CursorPointTracker ref={cursorTracker}/>
        </Node>
    ) as Node
    const Dialogue1 = (
        <Layout {...LayoutStyles.vertical} zIndex={1100}>
            <Layout {...LayoutStyles.vertical}>
                <Layout {...LayoutStyles.horizontal}>
                    <Dialogue {...TextPropStyles.title}>Even</Dialogue>
                    <Dialogue {...TextPropStyles.title}>a</Dialogue>
                    <Dialogue {...TextPropStyles.title}>few</Dialogue>
                </Layout>
                <Layout {...LayoutStyles.horizontal}>
                    <Dialogue {...TextPropStyles.title}>minutes</Dialogue>
                </Layout>
            </Layout>
            <Layout size={wallSwitch().size} margin={50}/>
            <Layout {...LayoutStyles.vertical}>
                <Layout {...LayoutStyles.horizontal}>
                    <Dialogue {...TextPropStyles.title}>can</Dialogue>
                    <Dialogue {...TextPropStyles.title}>make</Dialogue>
                </Layout>
                <Layout {...LayoutStyles.horizontal}>
                    <Dialogue {...TextPropStyles.title}>a</Dialogue>
                    <Dialogue {...TextPropStyles.title}>difference!</Dialogue>
                </Layout>
            </Layout>
        </Layout>
    )
    prepareDialogue(Dialogue1, (e)=>e.opacity(0).scale(0))
    Dialogue1.x(scene.x)
    phoneChargerHead().rotation(()=>phoneCharger().getPointAtPercentage(1-EPSILON).normal.flipped.degrees)
    
    yield* task.PopOut(0)
    view.add(scene)
    view.add(task)
    view.add(darkenFilter)
    view.add(Dialogue1)
    // yield* all(
	// 	view.fill("#000000", 0.5, easeOutQuint),
	// 	earth.glowRadius(0, 0.5, easeOutQuint),
    //     earth.scale(1, 0.5, easeOutQuint),
	// 	earth.internalElement().lineWidth(50, 0.5, easeOutQuint),
	// 	earth.size(450, 0.5, easeOutQuint),
	// 	earth.position([391, 865], 0.5, easeOutQuint),
	// 	earth.musicScalePercentage(1, 0.5, easeOutQuint),
	// )
    light().intensity(wallSwitch().switchState)
    darkenFilter.opacity(()=>map(0.3, 0, wallSwitch().switchState()))
    yield all(
        view.fill("#808080", 0.5, easeOutQuint),
        earth.glowRadius(0, 0.5, easeOutQuint),
        earth.scale(0.5, 0.5, easeOutQuint),
        earth.internalElement().lineWidth(50, 0.5, easeOutQuint),
        earth.size(450, 0.5, easeOutQuint),
        earth.musicScalePercentage(1, 0.5, easeOutQuint),
        earth.position(()=>[(view.width() / -2) + 150, (view.height() / -2) + 150], 0.5, easeOutQuint),
        wallSwitch().opacity(1, 0.5, easeOutQuint),
        wallSwitch().scale(1, 0.5, easeOutQuint),
        light().angle(60, 0.5, easeOutQuint),
        task.PopIn(0.5, easeOutQuint)
    )

    yield* cursor.absolutePosition(wallSwitch().cursorPointTracker().absolutePosition, 0.5, easeOutQuint)
    yield cursor.mouseDown()
    yield* wallSwitch().switchState(0, 0.5, easeOutQuint)
    yield cursor.mouseUp()
    yield* animateDialogue(Dialogue1, function*(e){
        yield e.opacity(1, 0.25, easeOutBack)
        yield e.scale(1, 0.25, easeOutBack)
    })
    yield* waitUntil("pause #2")

    yield cursor.absolutePosition(()=>phoneChargerHead().absolutePosition().addY(40), 1, easeOutQuint)
    yield darkenFilter.opacity(0, 1 , easeInOutQuint)
    yield* scene.x(()=>-view.width(), 1, easeInOutQuint)
    yield cursor.mouseDown()
    yield phoneChargerHead().position(phoneChargerHead().position().add([300, 800]), 0.5, easeInQuint)
    yield* waitFor(0.35)
    yield phone().onValue(0, 0.5, easeInOutQuint)
    yield cursor.absolutePosition.save()
    yield cursor.mouseUp()
    cursor.position.save()
    yield* waitUntil("pause #3")
    cursorTracker().absolutePosition(cursor.absolutePosition()).save()
    cursor.absolutePosition(cursorTracker().absolutePosition)
    yield scene.scale(0.2, 1, easeInOutQuint)
    yield scene.position.x((view.width())-(5000/2)-8, 1, easeInOutQuint)
    yield* scene.position.y(0, 1, easeInOutQuint)
    yield* cursor.absolutePosition(()=>airConditioner().powerLED().absolutePosition().add(5), 0.5, easeOutQuint)
    yield* cursor.Click()
    yield* airConditioner().openness(0, 0.5, linear)
    yield* cursor.absolutePosition(outdoorWindow().cursorTracker().absolutePosition, 0.5, easeOutQuint)
    yield cursor.mouseDown()
    yield* outdoorWindow().openness(0, 0.5, easeOutQuint)
    yield* cursor.mouseUp()
    yield* waitUntil("pause #4")
    yield* cursor.ClickOn(earth)
    // cursor.absolutePosition.save()
    scene.remove()
    const tempelement = <Node>{scene}</Node>
    view.add(tempelement)
    const bars = [
        createRef<ProgressBar>(),
        createRef<ProgressBar>()
    ]
    const icons = [
        createRef<SolidIcon>(),
        createRef<SolidIcon>()
    ]
    const statelement = (
        <Node opacity={0} scale={0.8}>
            <Layout direction={"column"} layout y={500}>
                <Layout direction={"row"} alignItems={"center"} marginTop={25} marginBottom={25}>
                    <SolidIcon src={ICON_PLUG} size={200} iconFill={"#ffffff"} marginRight={50} ref={icons[0]}/>
                    <Layout direction={"column"}>
                        <ProgressBar width={700} height={50} radius={25} backgroundColor={"#80808080"} progressFill={icons[0]().iconFill} ref={bars[0]}/>
                        <Layout layout={false}>
                            <Txt fill={bars[0]().progressFill} fontFamily={FONT.REGULAR} textAlign={"right"} fontSize={40} topLeft={()=>bars[0]().bottomLeft().addY(10)}>Electricity consumption</Txt>
                        </Layout>
                    </Layout>
                </Layout>
                <Layout direction={"row"} alignItems={"center"} marginTop={25} marginBottom={25}>
                    <SolidIcon src={ICON_LIFE} size={200} iconFill={"#ffffff"} marginRight={50} ref={icons[1]}/>
                    <Layout direction={"column"}>
                        <ProgressBar width={700} height={50} radius={25} backgroundColor={"#80808080"} progressFill={icons[1]().iconFill} ref={bars[1]}/>
                        <Layout layout={false}>
                            <Txt fill={bars[1]().progressFill} fontFamily={FONT.REGULAR} textAlign={"right"} fontSize={40} topLeft={()=>bars[0]().bottomLeft().addY(10)}>Health</Txt>
                        </Layout>
                    </Layout>
                </Layout>
            </Layout>
        </Node>
    )
    yield statelement
    view.add(statelement)
    yield statelement.scale(1, 0.5, easeOutQuint)
    yield statelement.opacity(1, 0.5, easeOutQuint)
    yield tempelement.scale(1.2, 0.5, easeOutQuint)
    yield tempelement.opacity(0, 0.5, easeOutQuint)
    yield view.fill("#000000", 0.5, easeOutQuint)
    yield earth.scale(1, 0.5, easeOutQuint)
    yield earth.size(1000, 0.5, easeOutQuint)
    yield earth.musicScalePercentage(0, 0.5, easeOutQuint)
    yield earth.position([0, -400], 0.5, easeOutQuint)
    yield earth.internalElement().lineWidth(0, 0.5, easeOutQuint)
    yield earth.glowRadius(100, 0.5, easeOutQuint).do(()=>{
        tempelement.remove()
        darkenFilter.remove()
        Dialogue1.remove()
    })
    yield cursor.PopOut()
    yield task.PopOut()
    yield* waitUntil("stat-electricity")
    yield icons[0]().iconFill("#80ff80", 0.25, easeOutSine).to("#ffffff", 0.25, easeInSine)
    yield icons[0]().scale(1.1, 0.25, easeOutSine).to(1, 0.5, easeOutBounce)
    yield* bars[0]().progress(0.2, 0.5, easeOutQuint)
    yield* waitUntil("stat-health")
    yield icons[1]().iconFill("#80ff80", 0.25, easeOutSine).to("#ffffff", 0.25, easeInSine)
    yield icons[1]().scale(1.1, 0.25, easeOutSine).to(1, 0.5, easeOutBounce)
    yield* bars[1]().progress(0.8, 0.5, easeOutQuint)
    yield* waitUntil("pause #5")
    yield statelement.opacity(0, 0.5, easeOutQuint).do(()=>{
        statelement.remove()
        task.remove()
    })
}