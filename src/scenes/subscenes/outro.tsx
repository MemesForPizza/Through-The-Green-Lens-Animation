import { Node, Rect, Txt, View2D } from "@motion-canvas/2d";
import { ThreadGenerator, all, createRef, easeInQuint, easeOutBack, easeOutCubic, easeOutQuint, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { Earth } from "../../components/Earth";
import { ExclamationMark } from "../../components/ExclamationMark";
import LayoutStyles from "../../propstyles/layout";
import TextPropStyles from "../../propstyles/text";
import { Dialogue } from "../../components/Dialogue";
import { animateDialogue, prepareDialogue } from "../../utils/DOMUtils";
import { Cursor } from "../../components/Cursor";

export default function* SubScene(view: View2D, earth: Earth, cursor: Cursor): ThreadGenerator {
  yield all(
    view.fill("#000000", 0.5, easeOutQuint),
    earth.glowRadius(100, 0.5, easeOutQuint),
    earth.scale(1, 0.5, easeOutQuint),
    earth.internalElement().lineWidth(0, 0.5, easeOutQuint),
    earth.size(1000, 0.5, easeOutQuint),
    earth.musicScalePercentage(0, 0.5, easeOutQuint),
    earth.position(()=>[0, 0], 0.5, easeOutQuint),
    cursor.PopOut()
)

  const earthFollower1 = createRef<Rect>()
  const earthFollower2 = createRef<Rect>()
  const earthFollower3 = createRef<Rect>()
  const dialogue1 = (
    <Node>
      <Rect {...LayoutStyles.vertical}>
        <Rect {...LayoutStyles.horizontal}>
          <Dialogue {...TextPropStyles.title}>Let's</Dialogue>
          <Dialogue {...TextPropStyles.title}>do</Dialogue>
        </Rect>
        <Rect layout size={earth.size} margin={50} ref={earthFollower1}>
          <Rect layout={false}>
          </Rect>
        </Rect>
        <Rect {...LayoutStyles.horizontal}>
          <Dialogue {...TextPropStyles.title}>our</Dialogue>
          <Dialogue {...TextPropStyles.title}>part</Dialogue>
        </Rect>
      </Rect>
    </Node>
  )
  const dialogue2 = (
    <Node>
      <Rect {...LayoutStyles.vertical}>
        <Rect {...LayoutStyles.horizontal}>
          <Dialogue {...TextPropStyles.title} attr={["trans"]}>and</Dialogue>
        </Rect>
        <Rect layout size={earth.size} margin={50} ref={earthFollower2}>
          <Rect layout={false}>
          </Rect>
        </Rect>
        <Rect {...LayoutStyles.horizontal}>
          <Dialogue {...TextPropStyles.title}>remember:</Dialogue>
        </Rect>
      </Rect>
    </Node>
  )
  dialogue1.position.x(()=>earth.position.x() - earthFollower1().position().x)
  dialogue1.position.y(()=>earth.position.y() - earthFollower1().position().y)
  dialogue2.position.x(()=>earth.position.x() - earthFollower2().position().x)
  dialogue2.position.y(()=>earth.position.y() - earthFollower2().position().y)
  
  prepareDialogue(dialogue1, (d)=>d.scale(0).opacity(0))
  prepareDialogue(dialogue2, (d)=>d.scale(0).opacity(0))
  view.add(dialogue1)
  view.add(dialogue2)

  yield* animateDialogue(dialogue1, function*(e){
    yield e.opacity(1, 0.25, easeOutBack)
    yield e.scale(1, 0.25, easeOutBack)
  })
  yield* animateDialogue(dialogue2, function* (node){
    if(node.attr().includes("trans")){
      yield dialogue2.opacity(1, 1/4, easeOutCubic)
      yield dialogue2.scale(1, 1/4, easeOutCubic)
      yield dialogue1.opacity(0, 1/4, easeOutCubic)
      yield dialogue1.scale(1.2, 1/4, easeOutCubic)
    }
    yield node.opacity(1, 1/4, easeOutBack)
    yield node.scale(1, 1/4, easeOutBack)
  })
  yield* waitUntil("pause #8")
  yield dialogue2.opacity(0, 1/4, easeOutCubic)
  yield* dialogue2.scale(1.2, 1/4, easeOutCubic)
}