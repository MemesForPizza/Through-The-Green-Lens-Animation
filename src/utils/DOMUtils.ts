import { Node, View2D } from "@motion-canvas/2d"
import { Dialogue } from "../components/Dialogue"
import { ThreadGenerator, TimingFunction, Vector2, any, chain, easeInCubic, useLogger, waitFor, waitUntil } from "@motion-canvas/core"

export function traverseChildren(node: Node){
    const result: Node[] = [node]
    node.children().forEach((child) => {
        result.push(...traverseChildren(child))
    })
    return result
}

export function prepareDialogue(
    node: Node,
    init: (node: Dialogue) => void
){
    traverseChildren(node).forEach((children) => {
        if(!(children instanceof Dialogue))return
        init(children)
    })
}

export function* animateDialogue(
    node: Node,
    animation: (node: Dialogue) => ThreadGenerator,
    constantDuration: number | undefined = undefined
): ThreadGenerator {
    const traversed = traverseChildren(node)
    for(const children of traversed){
        if(!(children instanceof Dialogue))continue
        if(typeof constantDuration === "number"){
            yield* waitFor(constantDuration)
        } else {
            yield* waitUntil(`${children.text()} (${children.key})`)
        }
        yield* animation(children)
    }
}