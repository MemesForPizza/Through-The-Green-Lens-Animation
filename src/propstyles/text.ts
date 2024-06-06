import { TxtProps } from "@motion-canvas/2d";
import { FONT } from "../constants/fon";

namespace TextPropStyles {
    export const mainLight: TxtProps = {
        "fontSize": 100,
        "fontFamily": FONT.REGULAR,
        "textAlign": "center",
        "fill": "#ffffff"
    }

    export const mainDark: TxtProps = {
        "fontSize": 100,
        "fontFamily": FONT.REGULAR,
        "textAlign": "center",
        "fill": "#000000"
    }

    export const title: TxtProps = {
        ...mainLight,
        "fontSize": 150,
        "fontFamily": FONT.REGULAR,
        "fill": "#ffffff",
        "marginLeft": 30,
        "marginRight": 30
    }

    export const boldTitle = {
        ...title,
        "fontFamily": FONT.BOLD
    }
}

export default TextPropStyles