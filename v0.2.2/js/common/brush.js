const FUNC_SET = 0
const FUNC_PAINT = 1
const FUNC_DARKEN = 2
const FUNC_LIGHTEN = 3

class Brush {
    constructor(sprite){
        this.sprite = sprite
        this.functionArray = new Array()
    }


    paint(layer, x, y, intensity)
}


class Function {
    constructor(func, relativeX, relativeY, opacity, intensity){
        this.function = func
        this.intensity = intesnsity
        this.opacity = opacity
        this.relativeX = relativeX
        this.relativeY = relativeY
    }

    execute (layer, x, y, intensity){
        let w = layer.width
        let h = layer.height
        let drawX = x + this.relativeX
        let drawY = y + this.relativeY
        let o = this.opacity
        let i = intensity * this.intensity

        let pixel = layer.get
    }
}