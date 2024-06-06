import { Vector2 } from "@motion-canvas/core";

export function getDistance(v1: Vector2, v2: Vector2): number {
    return Math.sqrt((v1.x-v2.x)**2 + ((v1.y-v2.y)**2))
}