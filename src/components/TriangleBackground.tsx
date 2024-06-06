import { Polygon, PolygonProps, Rect, RectProps, colorSignal, initial, signal } from "@motion-canvas/2d";
import { Color, ColorSignal, PlaybackState, PossibleColor, Random, SignalValue, SimpleSignal, ThreadGenerator, Vector2, Vector2Signal, createSignal, map, remap, useLogger, usePlayback, useRandom, useThread } from "@motion-canvas/core";

const EQUILATERAL_TRIANGLE_RATIO = Math.sqrt(3) / 2

export interface TriangleBackgroundProps extends RectProps {
    time?: SignalValue<number>,
    playbackRate?: SignalValue<number>,
    triangleSize?: SignalValue<number>,
    triangleScale?: SignalValue<number>,
    baseVelocity?: SignalValue<number>,
    spawnRatio?: SignalValue<number>,
    colorDark?: SignalValue<PossibleColor>,
    colorLight?: SignalValue<PossibleColor>,
    spawnAmount?: number
    seed?: number,
}

export class TriangleBackground extends Rect {

    @initial(0)
    @signal()
    public declare readonly time: SimpleSignal<number, this>

    @initial(1)
    @signal()
    public declare readonly playbackRate: SimpleSignal<number, this>

    @initial(false)
    @signal()
    public declare readonly playing: SimpleSignal<boolean, this>

    @initial(1)
    @signal()
    public declare readonly triangleScale: SimpleSignal<number, this>

    @initial(1)
    @signal()
    public declare readonly baseVelocity: SimpleSignal<number, this>

    @initial(100)
    @signal()
    public declare readonly triangleSize: SimpleSignal<number, this>

    @initial(1)
    @signal()
    public declare readonly spawnRatio: SimpleSignal<number, this>

    @initial("#000000")
    @colorSignal()
    public declare readonly colorDark: ColorSignal<this>

    @initial("#ffffff")
    @colorSignal()
    public declare readonly colorLight: ColorSignal<this>

    private declare readonly random: Random

    private spawnTriangles(randomY: boolean, amount: number){
        const hard_limit = amount ?? usePlayback().state === PlaybackState.Rendering ? amount : amount/3
        // const aim_count = Math.floor(Math.min(hard_limit, this.width() * this.height() * 0.002 / (this.triangleScale()**2) * this.spawnRatio() ))
        const current_count = this.children().length
        for(let i = 0; i < hard_limit - current_count; i++) {
            this.add(this.createTriangle(randomY))
        }
    }

    private createTriangle(randomY: boolean): TriangleParticle {
        const particle = new TriangleParticle({
            "size": this.triangleSize(),
            "sides": 3,
        })
        particle.colorShade(this.random.nextFloat())
        particle.velocity(this.random.nextFloat(0.5, 2))
        particle.scale(this.random.nextFloat(0.5, 1)*this.triangleScale())
        particle.positionPercentage(this.getRandomPosition(randomY))
        particle.fill(()=>this.createTriangleShade(particle.colorShade()))
        particle.opacity(particle.colorShade())
        particle.position(()=>{
            const top = (this.height() / -2) - ((particle.height() * particle.scale.y())/2)
            const bottom = (this.height() / 2) + ((particle.height() * particle.scale.y())/2)
            const left = (this.width() / -2) - ((particle.width() * particle.scale.x())/2)
            const right = (this.width() / 2) + ((particle.width() * particle.scale.x())/2)
            return [
                map(left, right, particle.positionPercentage().x),
                map(bottom, top, particle.positionPercentage().y)
            ]
        })

        const offset = particle.positionPercentage()
        const velocity = particle.velocity()
        particle.positionPercentage(()=>{
            return new Vector2(
                offset.x,
                (offset.y + (this.time() * (velocity * this.baseVelocity()))) % 1 
            )
        })

        
        return particle
    }

    private getRandomPosition(randomY: boolean){
        let y = 1
        if(randomY){
            y = this.random.nextFloat(0, 1)
        }
        return new Vector2(this.random.nextFloat(), y)
    }

    private createTriangleShade(shade: number): Color{
        return Color.lerp(this.colorDark(), this.colorLight(), shade)
    }

    public Start() {
        const time = useThread().time
        const start = time()
        const offset = this.time()
        const playbackRate = this.playbackRate()
        this.playing(true)
        this.time(() => offset + (time() - start) * playbackRate)
    }

    public Stop() {
        this.playing(false)
        this.time.save()
    }

    constructor(props: TriangleBackgroundProps) {
        super({
            ...props,
            layout: false
        })

        this.random = useRandom(props.seed)
        this.spawnTriangles(true, props.spawnAmount ?? 32)
    }
}

interface TriangleParticleProps extends PolygonProps {
    colorShade?: SignalValue<number>,
    positionPercentage?: SignalValue<Vector2>,
    velocity?: SignalValue<number>
}

class TriangleParticle extends Polygon {
    @initial(0)
    @signal()
    public declare readonly colorShade: SimpleSignal<number, this>

    @initial([0, 0])
    @signal()
    public declare readonly positionPercentage: Vector2Signal<this>

    @initial(1)
    @signal()
    public declare velocity: SimpleSignal<number, this>

    constructor(props: TriangleParticleProps){
        super({
            ...props,
            clip: true
        })
    }
}