export function Round(value: number, digits: number = 0) {
    return Math.round(value * (10 ** Math.floor(digits))) / (10 ** Math.floor(digits))
}
export function SmoothAbs(value: number, epilson = 0.01) {
    return Math.sqrt(value ** 2 + epilson)
}