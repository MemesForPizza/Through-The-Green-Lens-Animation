import { LayoutProps } from "@motion-canvas/2d"

namespace LayoutStyles {
    export const base: LayoutProps = {
        layout: true,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center"
    }

    export const horizontal: LayoutProps = {
        ...base,
        direction: "row"
    }

    export const vertical: LayoutProps = {
        ...base,
        direction: "column"
    }
}

export default LayoutStyles