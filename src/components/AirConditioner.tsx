import { Circle, Layout, Rect, RectProps, Txt, initial, signal } from "@motion-canvas/2d";
import { FONT } from "../constants/fon";
import { Color, Reference, SignalValue, SimpleSignal, createRef, easeInExpo, easeInQuint, easeOutQuart, map, range } from "@motion-canvas/core";
import { LED } from "./LED";

export interface AirConditionerProps extends RectProps {
    openness?: SignalValue<number>
}

export class AirConditioner extends Rect {

    @initial(1)
    @signal()
    public declare readonly openness: SimpleSignal<number, this>

    public declare readonly powerLED: Reference<LED>

    constructor(props: RectProps){
        super({
            ...props,
            width: 5000,
            height: 2000,
            fill: "#ffffff",
            layout: true,
            direction: "column",
            clip: true,
            radius: 200
        })

        const grill = createRef<Rect>()
        this.powerLED = createRef<LED>()

        this.add(
            <Rect
                width={"100%"}
                height={"70%"}
                alignContent={"center"}
                alignItems={"center"}
                justifyContent={"center"}
                fontFamily={FONT.REGULAR}
                fontSize={256}
            >
                <Txt>air conditioner</Txt>
            </Rect>
        )

        this.add(
            <Rect width={"100%"} height={50} fill={"#919191"}/>
        )

        this.add(
            <Rect
                width={"100%"}
                grow={1}
                direction={"row"}
                fill={"#ffffff"}
            >
                <Rect
                    fill={"#474747"}
                    width={"80%"}
                    alignItems={"center"}
                    justifyContent={"space-evenly"}
                    direction={"column"}
                    ref={grill}
                >
                    {
                        ...range(5).map(()=>
                            <Rect fill={"#000000"} width={"100%"} height={"7%"}/>
                        )
                    }
                </Rect>
                <Rect
                    size={grill().size}
                    position={()=>grill().position().addY(grill().size.y()/2)}
                    layout={false}
                    fill={"#cfcfcf"}
                    offsetY={()=>map(1, -1, easeInQuint(this.openness()))}
                />
                <Rect height={"100%"} width={50} fill={"#919191"}/>
                <Rect
                    fill={"#cfcfcf"}
                    direction={"column"}
                    grow={1}
                    padding={50}
                    paddingRight={300}
                    justifyContent={"space-evenly"}
                >
                    <Layout direction={"row"} justifyContent={"center"} alignContent={"center"} alignItems={"center"}>
                        <LED
                            fill={()=>Color.lerp("#5e5e5e", "#00ff00", easeInExpo(this.openness()), "rgb")}
                            size={50}
                            glow={()=>map(0, 3, easeInExpo(this.openness()))}
                            glowScale={()=>map(1, 1.5, easeInExpo(this.openness()))}
                            marginRight={50}
                            ref={this.powerLED}
                        />
                        <Rect fill={"#808080"} height={50} grow={1} radius={25}/>
                    </Layout>
                    <Layout direction={"row"} justifyContent={"center"} alignContent={"center"} alignItems={"center"}>
                        <Circle fill={"#5e5e5e"} size={50} marginRight={50}/>
                        <Rect fill={"#808080"} height={50} grow={1} radius={25}/>
                    </Layout>
                    <Layout direction={"row"} justifyContent={"center"} alignContent={"center"} alignItems={"center"}>
                        <Circle fill={"#5e5e5e"} size={50} marginRight={50}/>
                        <Rect fill={"#808080"} height={50} grow={1} radius={25}/>
                    </Layout>
                </Rect>
            </Rect>
        )
    }
}