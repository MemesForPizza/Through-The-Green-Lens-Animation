import { initial, signal } from "@motion-canvas/2d";
import { SimpleSignal, ThreadGenerator, all, createSignal, threadable, useThread, waitFor } from "@motion-canvas/core";

export interface BeatSyncedParam {
    newBar: boolean,
    time: number,
    earlyActivation: number,
    instance: BeatSyncedController
}

export type BeatSyncedListener<T> = (
    param: T
) => ThreadGenerator

export class BeatSyncedController {

    public readonly listeners: BeatSyncedListener<BeatSyncedParam>[] = []
    
    @initial(0)
    @signal()
    public declare readonly time: SimpleSignal<number, this>

    @initial(0)
    @signal()
    public declare readonly lastEmitted: SimpleSignal<number, this>

    @initial(1)
    @signal()
    public declare readonly playbackRate: SimpleSignal<number, this>

    @initial(false)
    @signal()
    public declare readonly playing: SimpleSignal<boolean, this>
    
    constructor(
        public BPM: number,
        public BeatsPerBar: number,
        public NoteValue: number,
        public earlyActivation: number = 0.06,
        public startOffset: number = 0
    ){
        this.time = createSignal(startOffset)
        this.lastEmitted = createSignal(0)
        this.playbackRate = createSignal(1)
        this.playing = createSignal(false)
    }

    @threadable("BeatSyncedController thread loop")
    public *Start(){
        const time = useThread().time
        const start = time()
        const offset = this.time()
        const playbackRate = this.playbackRate()
        this.playing(true)
        this.time(() => offset + (time() - start) * playbackRate)

        while(this.playing){
            // in theory, this should emit to listeners every beat right?
            yield* waitFor(this.getNextBeat() - this.time() - this.earlyActivation)
            yield this.emit()
            yield
        }
    }

    public generateParams(): BeatSyncedParam {
        return ({
            newBar: this.isNewBar(),
            time: this.time(),
            earlyActivation: this.earlyActivation,
            instance: this
        })
    }

    @threadable("Beat Emit")
    public *emit(): ThreadGenerator {
        const p = this.generateParams()
        yield* all(...this.listeners.map((v)=>v(p)))
    }

    public updateTiming(
        BPM?: number | undefined,
        BeatsPerBar?: number | undefined,
        NoteValue?: number | undefined,
        startOffset?: number | undefined
    ): void {
        if(typeof BPM === "number")this.BPM = BPM
        if(typeof BeatsPerBar === "number")this.BeatsPerBar = BeatsPerBar
        if(typeof NoteValue === "number")this.NoteValue = NoteValue
        if(typeof startOffset === "number")this.startOffset = startOffset
    }

    public onNewBeat(listener: BeatSyncedListener<BeatSyncedParam>): void {
        this.listeners.push(listener)
    }

    public getBeatLength(beats: number = 1): number {
        return (60 / this.BPM) * beats
    }

    public getNextBeat(): number {
        const a = (60/this.BPM)
        return this.startOffset + (Math.ceil((this.time()-this.startOffset)/a) * a)
    }

    public isNewBar(): boolean {
        // TODO: Implement this
        return false
    }
}