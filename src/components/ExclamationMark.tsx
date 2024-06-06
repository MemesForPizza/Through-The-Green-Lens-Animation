import { Node, NodeProps, Path, Rect, initial, signal } from "@motion-canvas/2d";
import { SignalValue, SimpleSignal, createSignal, easeOutCubic, map, range, useThread } from "@motion-canvas/core";

export interface ExclamationMarkProps extends NodeProps {
    time?: SignalValue<number>
    playbackRate?: SignalValue<number>
}

export class ExclamationMark extends Node {

    @initial(0)
    @signal()
    public declare readonly time: SimpleSignal<number, this>

    @initial(false)
    @signal()
    public readonly playing: SimpleSignal<boolean, this>

    @initial(1)
    @signal()
    public readonly playbackRate: SimpleSignal<number, this>

    play(){
        const time = useThread().time
        const start = time()
        const offset = this.time()
        const playbackRate = this.playbackRate()
        this.playing(true)
        this.time(() => offset + (time() - start) * playbackRate)
    }

    pause(){
        this.playing(false)
        this.time.save()
    }

    constructor(props: ExclamationMarkProps){
        super({
            ...props
        })

        const CYCLE_DURATION = 3
        const CLONES = 5

        this.add(
            <Node>
                {()=>range(CLONES).map((i) => {
                    const p = createSignal(()=>((this.time()+CYCLE_DURATION*(i/CLONES)) % CYCLE_DURATION) / CYCLE_DURATION)
                    return(
                        <Path
                            data={"m 256,32 c 14.2,0 27.3,7.5 34.5,19.8 l 216,368 c 7.3,12.4 7.3,27.7 0.2,40.1 C 499.6,472.3 486.3,480 472,480 H 40 c -14.3,0 -27.6,-7.7 -34.7,-20.1 -7.1,-12.4 -7,-27.8 0.2,-40.1 l 216,-368 C 228.7,39.5 241.8,32 256,32 Z"}
                            fill={"#ffff00"}
                            lineWidth={()=>{
                                return map(1, 200, easeOutCubic(p()))
                            }}
                            opacity={()=>{
                                return map(1, 0, easeOutCubic(p()))
                            }}
                            stroke={"#ffff00"}
                            position={[-256,-256]}
                        />
                    )
                })}
            </Node>
        )

        this.add(
            <Node
                scale={1}
            >
                <Rect
                    width={80}
                    height={300}
                    y={30}
                    fill={"#000000"}
                />
                <Path
                  data={"m 256,32 c 14.2,0 27.3,7.5 34.5,19.8 l 216,368 c 7.3,12.4 7.3,27.7 0.2,40.1 C 499.6,472.3 486.3,480 472,480 H 40 c -14.3,0 -27.6,-7.7 -34.7,-20.1 -7.1,-12.4 -7,-27.8 0.2,-40.1 l 216,-368 C 228.7,39.5 241.8,32 256,32 Z m 0,128 c -13.3,0 -24,10.7 -24,24 v 112 c 0,13.3 10.7,24 24,24 13.3,0 24,-10.7 24,-24 V 184 c 0,-13.3 -10.7,-24 -24,-24 z m 32,224 a 32,32 0 1 0 -64,0 32,32 0 1 0 64,0 z"}
                  fill={"#ffff00"}
                  lineWidth={10}
                  stroke={"#000000"}
                  position={[-256,-256]}
                />
            </Node>
        )
    }
}