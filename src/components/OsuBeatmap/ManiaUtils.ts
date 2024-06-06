import {Beatmap, HitObject} from "osu-classes"
import { Indexed } from "../../utils/general"


export function getLaneIndex(x: number, count: number): number {
    return Math.max(0, Math.min(Math.floor(x * count / 512), count - 1))
}

export function splitLanes(beatmap: Beatmap): Indexed<HitObject>[][] {
    const laneCount = beatmap.difficulty.circleSize
    const hitObjects = beatmap.hitObjects
    const o: Indexed<HitObject>[][] = []
    for(let i = 0; i < laneCount; i ++){
        o.push([])
    }
    hitObjects.forEach((hitObject, i) => {
        o[getLaneIndex(hitObject.startX, laneCount)].push({
            id: i,
            obj: hitObject
        })
    })
    return o
}

export function isVisible(f: number, t: number, n: number): boolean{
    if(n > t) return false
    if(n < f) return false
    return true
}