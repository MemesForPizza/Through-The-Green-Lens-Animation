import { Img, Rect, RectProps, colorSignal, initial, signal } from "@motion-canvas/2d";
import { ColorSignal, PossibleColor, SignalValue, SimpleSignal, easeOutQuint, map, range, remap } from "@motion-canvas/core";
import StarIcon from "../../images/masks/star-solid.svg"

export interface SSStarRatingDisplayIconProps extends RectProps {
    starRating?: SignalValue<number>
    iconSize?: SignalValue<number>
    starColor?: SignalValue<PossibleColor>
    iconCount?: number
}

export class SSStarRatingDisplayIcon extends Rect {
    @initial(5.5)
    @signal()
    public declare readonly starRating: SimpleSignal<number, this>

    @initial(30)
    @signal()
    public declare readonly iconSize: SimpleSignal<number, this>

    @initial("#ffffff")
    @colorSignal()
    public declare readonly starColor: ColorSignal<this>

    constructor(props: SSStarRatingDisplayIconProps){
        super({
            ...props,
            layout: true,
            direction: "row",
            cache: true,
        })
        this.add(<Rect fill={"#ffffff"} size={this.size} layout={false}/>)
        this.add(<Rect compositeOperation={"destination-in"}>
            {range(Math.floor(props.iconCount ?? 10)).map((v, i) => {
                return <Img
                    src={StarIcon}
                    height={this.iconSize}
                    scale={()=>{
                        const d = this.starRating() - i
                        const s = this.starRating() % 1
                        const m = 0.5
                        if(d >= 1){
                            return 1
                        }
                        if(d >= 0){
                            return map(m, 1, s)
                        }
                        return m
                    }}
                    opacity={()=>{
                        const d = this.starRating() - i
                        const s = this.starRating() % 1
                        const m = 0.3
                        if(d >= 1){
                            return 1
                        }
                        if(d >= 0){
                            return easeOutQuint(s, m, 1)
                        }
                        return m
                    }}
                    marginLeft={2}
                    marginRight={2}
                />
            })}
        </Rect>)
    }
}