import { Color, PossibleColor } from "@motion-canvas/core";

namespace ColorUtils {
    export function Darken(color: PossibleColor, amount: number): Color {
        return Multiply(color, 1 / (1 + amount))
    }

    export function Lighten(color: PossibleColor, amount: number): Color {
        return Multiply(color, 1 + amount)
    }
    
    export function Multiply(color: PossibleColor, scalar: number): Color {
        if(scalar < 0)throw RangeError("Scalar must be a non-negative value.")
        const c = new Color(color)
        return new Color({
            r: Math.min(1, c.rgb()[0] / 0xff * scalar) * 0xff,
            g: Math.min(1, c.rgb()[1] / 0xff * scalar) * 0xff,
            b: Math.min(1, c.rgb()[2] / 0xff * scalar) * 0xff,
            a: c.alpha()
        })
    }
}

export default ColorUtils