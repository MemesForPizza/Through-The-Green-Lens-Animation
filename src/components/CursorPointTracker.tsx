import { Node, NodeProps } from "@motion-canvas/2d";

export interface CursorPointTrackerProps extends NodeProps {
    
}

export class CursorPointTracker extends Node {
    constructor(props: CursorPointTrackerProps){
        super({
            ...props
        })
    }
}