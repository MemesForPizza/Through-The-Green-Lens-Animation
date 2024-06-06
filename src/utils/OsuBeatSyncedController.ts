import { Beatmap } from "osu-classes";
import { BeatSyncedController, BeatSyncedListener, BeatSyncedParam } from "./BeatSyncedController";
import { ThreadGenerator, Promisable, useThread, waitFor, all, decorate, threadable } from "@motion-canvas/core";

export interface OsuBeatSyncedParam extends BeatSyncedParam {
    kiai: boolean,
    instance: OsuBeatSyncedController
}

export class OsuBeatSyncedController extends BeatSyncedController {
    public readonly listeners: BeatSyncedListener<OsuBeatSyncedParam>[] = []

    constructor(public beatmap: Beatmap, offset = 0){
        const t = beatmap.controlPoints.timingPointAt(offset)
        super(t.bpm, t.timeSignature, 4, offset)
        decorate(this.Start, threadable("OsuBeatSyncedController thread loop"))
    }

    public generateParams(): OsuBeatSyncedParam {
        const timecomputed = (this.time() + this.earlyActivation + 0.1) * 1000
        const t = this.beatmap.controlPoints.effectPointAt(timecomputed)
        const e = this.beatmap.controlPoints.effectPointAt(timecomputed)
        return ({
            newBar: this.isNewBar(),
            time: this.time(),
            kiai: e.kiai,
            earlyActivation: this.earlyActivation,
            instance: this
        })
    }

    public onNewBeat(listener: BeatSyncedListener<OsuBeatSyncedParam>): void {
        this.listeners.push(listener)
    }
}