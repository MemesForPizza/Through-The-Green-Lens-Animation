import { Node, Rect, Txt, View2D } from "@motion-canvas/2d";
import { ThreadGenerator, createRef, easeInQuint, easeOutBack, easeOutCubic, easeOutQuint, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { Earth } from "../../components/Earth";
import { ExclamationMark } from "../../components/ExclamationMark";
import LayoutStyles from "../../propstyles/layout";
import TextPropStyles from "../../propstyles/text";
import { Dialogue } from "../../components/Dialogue";
import { animateDialogue, prepareDialogue } from "../../utils/DOMUtils";
import { Cursor } from "../../components/Cursor";

export default function* SubScene(view: View2D, earth: Earth, cursor: Cursor): ThreadGenerator {
  view.fill("#000000")
  const root = view
  const earthFollower1 = createRef<Rect>()
  const exclamationMark = createRef<ExclamationMark>()
  const earthContainer = <ExclamationMark ref={exclamationMark} position={earth.position} zIndex={900}/>
  const dialogue1 = (
    <Node>
      <Rect {...LayoutStyles.vertical}>
        <Rect {...LayoutStyles.horizontal}>
          <Dialogue {...TextPropStyles.title}>Our</Dialogue>
          <Dialogue {...TextPropStyles.title}>world</Dialogue>
        </Rect>
        <Rect layout size={earth.size} margin={50} ref={earthFollower1}>
          <Rect layout={false}>
          </Rect>
        </Rect>
        <Rect {...LayoutStyles.horizontal}>
          <Dialogue {...TextPropStyles.title}>is</Dialogue>
          <Dialogue {...TextPropStyles.title}>in</Dialogue>
        </Rect>
        <Rect {...LayoutStyles.horizontal}>
          <Dialogue {...TextPropStyles.boldTitle} attr={["danger"]}>DANGER!</Dialogue>
        </Rect>
      </Rect>
    </Node>
  )
  // root.add(<Txt y={()=>(-view.height()/2) + 50} opacity={0.5} {...TextPropStyles.mainLight} fontSize={48}>Project P5: Through the green lens</Txt>)
  dialogue1.position.x(()=>earthContainer.position.x() - earthFollower1().position().x)
  dialogue1.position.y(()=>earthContainer.position.y() - earthFollower1().position().y)
  root.add(dialogue1)
  root.add(earthContainer)
  prepareDialogue(dialogue1, (d)=>d.scale(0).opacity(0))
  exclamationMark().scale(0)
  exclamationMark().play()
  
  yield* animateDialogue(dialogue1, function* (node){
    if(node.attr().includes("danger")){
      yield node.fill("#ff0000", 1/4)
      yield exclamationMark().opacity(0, 0).to(1, 1/4, easeOutBack)
      yield exclamationMark().scale(0.5, 0).to(1, 1/4, easeOutBack)
      yield node.opacity(0, 0).to(1, 1/4, easeOutBack)
      yield node.scale(0, 0).to(1, 1/4, easeOutBack)
      // yield earth().landColor("#ff0000", 1, easeOutCubic)
      return
    }
    yield node.opacity(1, 1/4, easeOutBack)
    yield node.scale(1, 1/4, easeOutBack)
  })


  const earthFollower2 = createRef<Rect>()

  const dialogue2 = (
		<Node>
			<Rect {...LayoutStyles.vertical}>
				<Rect {...LayoutStyles.horizontal}>
					<Dialogue {...TextPropStyles.title} attr={["trans"]}>Preserve</Dialogue>
				</Rect>
				<Rect layout size={earth.size} margin={50} ref={earthFollower2}>
					<Rect layout={false}>
					</Rect>
				</Rect>
				<Rect {...LayoutStyles.horizontal}>
					<Dialogue {...TextPropStyles.title}>our</Dialogue>
					<Dialogue {...TextPropStyles.title}>planet.</Dialogue>
				</Rect>
			</Rect>
		</Node>
  )
  dialogue2.position.x(()=>earthContainer.position.x() - earthFollower2().position().x)
  dialogue2.position.y(()=>earthContainer.position.y() - earthFollower2().position().y)
  prepareDialogue(dialogue2, (d)=>d.scale(0).opacity(0))
  dialogue2.scale(0.8).opacity(0)
  root.add(dialogue2)

  yield* animateDialogue(dialogue2, function* (node){
    if(node.attr().includes("trans")){
      yield dialogue2.opacity(1, 1/4, easeOutCubic)
      yield dialogue2.scale(1, 1/4, easeOutCubic)
      yield dialogue1.opacity(0, 1/4, easeOutCubic)
      yield dialogue1.scale(1.2, 1/4, easeOutCubic)
    }
    if(node.attr().includes("danger")){
      yield node.fill("#ff0000", 1/4)
      yield node.opacity(0, 0).to(1, 1/4, easeOutBack)
      yield node.scale(0, 0).to(1, 1/4, easeOutBack)
       return
    }
    yield node.opacity(1, 1/4, easeOutBack)
    yield node.scale(1, 1/4, easeOutBack)
  })

  const earthFollower3 = createRef<Rect>()
  const dialogue3 = (
		<Node>
			<Rect {...LayoutStyles.vertical}>
				<Rect {...LayoutStyles.horizontal}>
					<Dialogue {...TextPropStyles.title} attr={["trans"]}>It</Dialogue>
					<Dialogue {...TextPropStyles.title}>starts</Dialogue>
				</Rect>
				<Rect layout size={earth.size} margin={50} ref={earthFollower3}>
					<Rect layout={false}>
					</Rect>
				</Rect>
				<Rect {...LayoutStyles.horizontal}>
					<Dialogue {...TextPropStyles.boldTitle} fill={"#ffff00"}>WITH</Dialogue>
					<Dialogue {...TextPropStyles.boldTitle} fill={"#ffff00"}>YOU!</Dialogue>
				</Rect>
			</Rect>
		</Node>
  )
  dialogue3.position.x(()=>earthContainer.position.x() - earthFollower3().position().x)
  dialogue3.position.y(()=>earthContainer.position.y() - earthFollower3().position().y)
  prepareDialogue(dialogue3, (d)=>d.scale(0).opacity(0))
  dialogue3.scale(0.8).opacity(0)
  root.add(dialogue3)

  yield* animateDialogue(dialogue3, function* (node){
    if(node.attr().includes("trans")){
      yield dialogue3.opacity(1, 1/4, easeOutCubic)
      yield dialogue3.scale(1, 1/4, easeOutCubic)
      yield dialogue2.opacity(0, 1/4, easeOutCubic)
      yield dialogue2.scale(1.2, 1/4, easeOutCubic)
    }
    if(node.attr().includes("danger")){
      yield node.fill("#ff0000", 1/4)
      yield node.opacity(0, 0).to(1, 1/4, easeOutBack)
      yield node.scale(0, 0).to(1, 1/4, easeOutBack)
       return
    }
    yield node.opacity(1, 1/4, easeOutBack)
    yield node.scale(1, 1/4, easeOutBack)
  })

  yield* waitUntil("pause #1")

  yield cursor.position([124, 133], 0.5, easeOutQuint)
  yield* waitFor(0.2)
  yield* cursor.Click()

  // yield cursor.position([664, 88], 0.5, easeInQuint)
	yield exclamationMark().scale(0.8, 1/4, easeOutCubic)
	yield exclamationMark().opacity(0, 1/4, easeOutCubic)
	yield dialogue3.scale(0.8, 1/2, easeOutCubic)
	yield dialogue3.opacity(0, 1/2, easeOutCubic).do(()=>{
    // clean up the scene
    exclamationMark().pause()
    dialogue1.remove()
    dialogue2.remove()
    dialogue3.remove()
    exclamationMark().remove()
  })
}