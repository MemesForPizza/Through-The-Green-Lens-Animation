import { Color, PossibleColor, remap } from "@motion-canvas/core";

export function SampleFromLinearGradient(gradient: [number, PossibleColor][], point: number): Color {
    if(point < gradient[0][0]) return new Color(gradient[0][1])

    for(let i = 0; i < gradient.length - 1; i++){
        const startStop = gradient[i]
        const endStop = gradient[i + 1]

        if(point >= endStop[0]) continue
        return Color.lerp(new Color(startStop[1]), new Color(endStop[1]), remap(startStop[0], endStop[0], 0, 1, point), "lab")
    }

    return new Color(gradient[gradient.length - 1][1])
}

export function getStarDifficultyColor(difficulty: number): Color {
    return SampleFromLinearGradient([
        [0.1, "#aaaaaa"],
        [0.1, "#4290fb"],
        [1.25, "#4fc0ff"],
        [2.0, "#4fffd5"],
        [2.5, "#7cff4f"],
        [3.3, "#f6f05c"],
        [4.2, "#ff8068"],
        [4.9, "#ff4e6f"],
        [5.8, "#c645b8"],
        [6.7, "#6563de"],
        [7.7, "#18158e"],
        [9.0, "#000000"],
    ], difficulty)
}