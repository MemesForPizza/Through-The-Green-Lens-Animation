import { initial, signal } from "@motion-canvas/2d";
import { SimpleSignal, ThreadGenerator, all, createSignal, usePlayback } from "@motion-canvas/core";

export type UpdateListener<T> = (
    param: T
) => ThreadGenerator

export interface UpdateParams {
    delta: number
}

export class FrameLoop {
    @initial(false)
    @signal()
    public declare readonly running: SimpleSignal<boolean, this>

    private declare readonly listeners: UpdateListener<UpdateParams>[]

    constructor() {
        this.running = createSignal(false)
        this.listeners = []
    }

    public *Start(): ThreadGenerator{
        this.running(true)
        while(this.running()){
            const p: UpdateParams = {
                "delta": usePlayback().deltaTime
            }
            yield all(
                ...this.listeners.map((l)=>l(p))
            )
            yield
        }
    }

    public Stop(){
        this.running(false)
    }

    public OnUpdate(e: UpdateListener<UpdateParams>){
        this.listeners.push(e)
    }
}