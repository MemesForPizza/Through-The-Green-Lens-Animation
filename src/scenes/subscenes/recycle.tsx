import { Node, Rect, View2D } from "@motion-canvas/2d";
import { ThreadGenerator, all, createRef, delay, easeInBounce, easeInQuint, easeOutBack, easeOutBounce, easeOutExpo, easeOutQuint, linear, map, remap, useRandom, waitFor, waitUntil } from "@motion-canvas/core";
import { Earth } from "../../components/Earth";
import { Cursor } from "../../components/Cursor";
import { OsuManiaBeatmap } from "../../components/OsuBeatmap/Mania";
import beatmapraw from "../../../beatmaps/Sidequest-mania-modified/beatmap.osu?raw"
import { BeatmapDecoder } from "osu-parsers";
import IMG_RECYCLABLE from "../../imgs/recyclable";
import { ImageDisplay } from "../../components/ImageDisplay";
import { OsuManiaLane } from "../../components/OsuBeatmap/ManiaLane";
import { Task } from "../../components/Task";
import { OsuBeatSyncedController } from "../../utils/OsuBeatSyncedController";
import { FrameLoop } from "../../utils/FrameLoop";

const decoder = new BeatmapDecoder()
const beatmap = decoder.decodeFromString(beatmapraw)
type recyclables = "paper" | "plastic" | "glass" | "metal"

export default function *SubScene(view: View2D, earth: Earth, cursor: Cursor, beatSyncSource: OsuBeatSyncedController, updateSource: FrameLoop): ThreadGenerator {
    const random = useRandom()
    function getRandomRecyclable(recyclable: recyclables){
        const l = IMG_RECYCLABLE[recyclable]
        const r = random.nextInt(0, l.length)
        return l[r]
    }

    const bm = createRef<OsuManiaBeatmap>()
    const darkenFilter = <Rect size={view.size} zIndex={150} fill={"#000000"} opacity={0}/>
    const earthClone = (<Earth beatSyncTo={beatSyncSource} updateSource={updateSource}></Earth>) as Earth
    earthClone.glowRadius(0)
    earthClone.internalElement().stroke("#ffffff")
    earthClone.internalElement().lineWidth(50)
    earthClone.size(450)
    earthClone.musicScalePercentage(1)
    earthClone.position(()=>[(view.width() / -2) + 150, (view.height() / -2) + 150])
    earthClone.scale(0)
    earthClone.time(earth.time)

    const task = (
        <Task
            left={earthClone.position}
            title={"Recycle waste!"}
            description={"Sort them, Recycle them."}
            scale={()=>earthClone.scale().mul(2)}
        />
    ) as Task

    const g1 = (<Node zIndex={3000} opacity={0}>{task}{earthClone}</Node>)

    const scene = (
        <Node
            opacity={0}
            zIndex={200}
        >
            <OsuManiaBeatmap
                beatmap={beatmap}
                laneLength={()=>view.height()/2}
                laneWidth={0}
                width={view.width}
                height={()=>view.height()*0.95}
                top={()=>[0, view.height()/-2]}
                viewRange={0.7}
                earth={earth}
                ref={bm}
                time={-Infinity}
            />
        </Node>
    )
    bm().play()
    yield* task.PopOut(0)
    view.add(scene)
    view.add(g1)
    view.add(darkenFilter)
    yield g1.opacity(1, 0.5, easeOutQuint)
    yield earthClone.scale(0.5, 0.5, easeOutQuint)
    yield task.PopIn()
    yield darkenFilter.opacity(0.25, 0.5, easeOutQuint)

    function* recycleRandomRecyclable(recyclable: recyclables): ThreadGenerator {
        yield* cursor.position([638, 10], 0.4, easeInQuint)
        yield cursor.mouseDown()
        const e = (<ImageDisplay src={getRandomRecyclable(recyclable)} size={bm().laneWidth} scale={1.5}/>) as ImageDisplay
        e.absolutePosition(()=>cursor.absolutePosition().addY(20))
        const r: Record<recyclables, number> = {
            "paper": 0,
            "plastic": 1,
            "glass": 2,
            "metal": 3
        }
        const lane = bm().children()[0].childrenAs<OsuManiaLane>()[r[recyclable]].childrenAs<Rect>()[0]
        const virtualLane = (
            <Rect height={lane.height} width={2048} zIndex={300}>{e}</Rect>
        ) as Rect
        virtualLane.absolutePosition(lane.absolutePosition)
        view.add(virtualLane)
        const f = random.nextFloat(0, 1)
        yield* cursor.absolutePosition(()=>lane.absolutePosition().addY(map(-250, 250, f)), 0.4, easeOutQuint)
        virtualLane.clip(true)
        yield e.scale(1, 0.5, easeOutBounce)
        yield cursor.mouseUp()
        e.position.save()
        const o = e.y()
        yield e.y(()=>o+(virtualLane.height()), 0.8, linear)
        .do(()=>virtualLane.remove())
    }
    
    earth.stroke("#ffffff")
    yield all(
        view.fill("#000000", 0.5, easeOutQuint),
        earth.glowRadius(100, 0.5, easeOutQuint),
        earth.scale(1, 0.5, easeOutQuint),
        earth.internalElement().lineWidth(0, 0.5, easeOutQuint),
        earth.size(1000, 0.5, easeOutQuint),
        earth.musicScalePercentage(1, 0.5, easeOutQuint),
        earth.position(()=>[0, 0], 0.5, easeOutQuint),
        earth.beatTargetScale(0.98, 0.5, easeOutQuint),
        earth.kiaiTargetScale(0.96, 0.5, easeOutQuint),
        earth.beatTargetSpeed(5, 0.5, easeOutQuint),
        earth.kiaiTargetSpeed(10, 0.5, easeOutQuint),
        earth.kiaiBrightness(1.8, 0.5, easeOutQuint),
        scene.opacity(1, 0.5, easeOutQuint),
        bm().laneWidth(200, 0.5, easeOutQuint)
    )

    yield* waitUntil("recyclable-paper")
    yield* recycleRandomRecyclable("paper")
    yield* waitUntil("recyclable-plastic")
    yield* recycleRandomRecyclable("plastic")
    yield* waitUntil("recyclable-glass")
    yield* recycleRandomRecyclable("glass")
    yield* waitUntil("recyclable-metal")
    yield* recycleRandomRecyclable("metal")
    yield delay(1, cursor.PopOut())
    yield* waitUntil("pause #6")

    yield all(
        g1.opacity(0, 0.5, easeOutQuint),
        earthClone.scale(0, 0.5, easeOutQuint),
        task.PopOut(),
        bm().laneWidth(0, 0.5, easeOutQuint),
        darkenFilter.opacity(0, 0.5, easeOutQuint),
        scene.opacity(0, 0.5, easeOutQuint).do(()=>{
            g1.remove()
            scene.remove()
            darkenFilter.remove()
        })
    )
}