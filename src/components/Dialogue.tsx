import { Txt, TxtProps, initial, signal } from "@motion-canvas/2d";
import { SignalValue, SimpleSignal } from "@motion-canvas/core";

export interface DialogueProps extends TxtProps {
    attr?: SignalValue<string[]>
}

export class Dialogue extends Txt {
    @initial([])
    @signal()
    public declare readonly attr: SimpleSignal<string[], this>

    constructor(props: DialogueProps){
        super({
            ...props
        })
    }
}