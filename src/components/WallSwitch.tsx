import { Rect, RectProps, Txt, TxtProps, colorSignal, initial, signal } from "@motion-canvas/2d";
import { FONT } from "../constants/fon";
import { Color, ColorSignal, PossibleColor, Reference, SignalValue, SimpleSignal, createRef, map } from "@motion-canvas/core";
import { CursorPointTracker } from "./CursorPointTracker";

const LabelStyle: TxtProps = {
	fontFamily: FONT.BOLD,
	fontSize: 64,
	fill: "#000000"
}

export interface WallSwitchProps extends RectProps {
	switchState?: SignalValue<number>,
	OnColor?: SignalValue<PossibleColor>,
	OffColor?: SignalValue<PossibleColor>
}

export class WallSwitch extends Rect {
	@initial(1)
	@signal()
	public declare readonly switchState: SimpleSignal<number, this>

	@initial("#bfbfbf")
	@colorSignal()
	public declare readonly OnColor: ColorSignal<this>

	@initial("#bfbfbf")
	@colorSignal()
	public declare readonly OffColor: ColorSignal<this>

	public declare readonly mainSwitchPart: Reference<Rect>
	public declare readonly cursorPointTracker: Reference<CursorPointTracker>

	constructor(props: WallSwitchProps){
		super({
			...props,
			layout: true,
			clip: true,
			alignContent: "center",
			alignItems: "center",
			justifyContent: "center",
			size: 500,
			radius: 50,
			fill: "#ffffff",
			stroke: "#e5e5e5",
			lineWidth: 10,
			direction: "column"
		})

		this.mainSwitchPart = createRef<Rect>()
		this.cursorPointTracker = createRef<CursorPointTracker>()

		this.add(<Txt {...LabelStyle}>ON</Txt>)
		this.add(
			<Rect
				fill={()=>Color.lerp(this.OffColor(), this.OnColor(), this.switchState())}
				stroke={"#acacac"}
				lineWidth={10}
				width={150}
				height={300}
				margin={10}
				ref={this.mainSwitchPart}
				padding={10}
				radius={20}
			/>
		)
		this.add(<Txt {...LabelStyle}>OFF</Txt>)

		this.mainSwitchPart().add(
			<Rect
				layout={false}
				width={this.mainSwitchPart().width}
				height={100}
				fill={"#ffffff"}
				stroke={"#acacac"}
				lineWidth={10}
				radius={20}
				y={()=>map(
					(this.mainSwitchPart().height() / 2) - (100 / 2),
					(this.mainSwitchPart().height() / -2) + (100 / 2),
					this.switchState()
				)}
			>
				<CursorPointTracker ref={this.cursorPointTracker} position={[55, 30]}/>
			</Rect>
		)
	}
}