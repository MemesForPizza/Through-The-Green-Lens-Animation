import { makeScene2D } from "@motion-canvas/2d";
import { TriangleBackground } from "../components/TriangleBackground";
import { waitFor } from "@motion-canvas/core";

const seeds = [614833950, 909614402, 981922811, 967479572, 472828443, 583610267, 236783577, 586869850, 262385382, 586810782]

export default makeScene2D(function*(view){
    const bg = (
        <TriangleBackground 
            seed={seeds[9]}
            size={view.size}
            colorDark={"#E866A0"}
            colorLight={"#FB79B4"}
            baseVelocity={0.01}
            triangleScale={3}
            spawnAmount={100}
        />
    ) as TriangleBackground
    view.add(bg)
    bg.Start()
    yield* waitFor(10)
})