import { usePlayback } from "@motion-canvas/core";

export interface EventData<T> {
    event: string,
    data: T
    start: number,
    startFrame: number
}

// motion canvas can't play audio on the fly 😭
export class EventWriter<T> {
    private readonly points: EventData<T>[] = []

    public write(event: string, data: T){
        const playback = usePlayback()
        const e: EventData<T> = {
            event: event,
            data: data,
            start: playback.time,
            startFrame: playback.frame
        }
        console.log(`Event ${event} written:`, data)
        this.points.push(e)
    }

    public retrieve(){
        return this.points.sort((a, b)=>a.start - b.start)
    }
}