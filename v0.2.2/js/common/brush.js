const FUNC_SET = 0
const FUNC_PAINT = 1
const FUNC_DARKEN = 2
const FUNC_LIGHTEN = 3

class PixelBrush {
    constructor(){
        this.name = ""
        this.functionArray = new Array()
    }


    paint(sprite, frameNumber, layerNumber, x, y, color, opacity){
        this.functionArray.forEach(f=>{
            f.execute(sprite, frameNumber, layerNumber, x, y, color, opacity)
        })
        //sprite.frames[frameNumber].layers[layerNumber].updateCanvas()
        sprite.updateCanvasChain()
        pixelFlux.updateCanvasAndPreview()
    }

    addPixelFunction(func, relativeX, relativeY, opacity){
        let pixelFunction = new PixelFunction(
            func,
            relativeX,
            relativeY,
            opacity
        )
        this.functionArray.push(pixelFunction)
    }

    load(brushJSON){
        this.name = brushJSON.name
        brushJSON.functionArray.forEach(f=>{
            this.addPixelFunction(f.func, f.relativeX, f.relativeY, f.opacity)
        })

    }
}


class PixelFunction {
    constructor(func, relativeX, relativeY, opacity){
        this.func = func
        this.opacity = opacity
        this.relativeX = relativeX
        this.relativeY = relativeY
    }

    execute (sprite, frameNumber, layerNumber, x, y, color, opacity){
        
        let frame = sprite.frames[frameNumber]
        let layer = frame.layers[layerNumber]

        let w = layer.width
        let h = layer.height
        
        let drawX = x + this.relativeX
        let drawY = y + this.relativeY
        
        let o = opacity * this.opacity

        let pixel = layer.getPixel(x,y)

        //let currentColor = pixel.getRGBA()
        //console.log(currentColor)
        switch (this.func){
            case FUNC_SET: 
                this.set(layer, drawX, drawY, color.r, color.g, color.b, color.a * opacity * this.opacity) 
                break
            case FUNC_PAINT: 
                this.set(layer, drawX, drawY, color.r, color.g, color.b, color.a * opacity * this.opacity) 
                break
            case FUNC_DARKEN: 
                this.darken(layer, drawX, drawY, this.opacity * (255/color.a) * opacity) 
                break
            case FUNC_LIGHTEN: 
                this.lighten(layer, drawX, drawY, opacity) 
                break
        
        }

    }

    set(layer, drawX, drawY, r, g, b, a){
        console.log(drawX, drawY, r, g, b, a)
        let pixel = layer.getPixel(drawX, drawY)
        let currentColor = pixel.getRGBA()
        
        layer.setPixelRGBA(drawX, drawY, r, g, b, a)
    }
    
    paint(layer, drawX, drawY, r, g, b, a){
        console.log(drawX, drawY, r, g, b, a)
        let pixel = layer.getPixel(drawX, drawY)
        let currentColor = pixel.getRGBA()
        
        layer.setPixelRGBA(drawX, drawY, r, g, b, bound(a + currentColor.a, 0, 255))
    }

    darken(layer, drawX, drawY, opacity){
        let pixel = layer.getPixel(drawX, drawY)
        let currentColor = pixel.getRGBA()
        let adjuster = 1 - (opacity)
        let newColor = {
            r: bound(currentColor.r * adjuster,0,255),
            g: bound(currentColor.g * adjuster,0,255),
            b: bound(currentColor.b * adjuster,0,255),
            a: bound(currentColor.a,0,255)
        }
        console.log(newColor)
        layer.setPixelRGBA(drawX, drawY, newColor.r, newColor.g, newColor.b, newColor.a)
    }
    lighten(layer, drawX, drawY, opacity){
        let pixel = layer.getPixel(drawX, drawY)
        let currentColor = pixel.getRGBA()
        let adjuster = (opacity * this.opacity)
        let newColor = {
            r: bound(currentColor.r + (adjuster * 255),0,255),
            g: bound(currentColor.g + (adjuster * 255),0,255),
            b: bound(currentColor.b + (adjuster * 255),0,255),
            a: bound(currentColor.a,0,255)
        }
        console.log(newColor)
        
        layer.setPixelRGBA(drawX, drawY, newColor.r, newColor.g, newColor.b, newColor.a)
    }

}





const BRUSH_BASIC = {
    name: "Basic Brush",
    functionArray: [
        {func: FUNC_PAINT, relativeX: -1, relativeY: -1, opacity: 0.5},
        {func: FUNC_PAINT, relativeX: 0, relativeY: -1, opacity: 1},
        {func: FUNC_PAINT, relativeX: 1, relativeY: -1, opacity: 0.5},
        {func: FUNC_PAINT, relativeX: -1, relativeY: 0, opacity: 1},
        {func: FUNC_PAINT, relativeX: 0, relativeY: 0, opacity: 1},
        {func: FUNC_PAINT, relativeX: 1, relativeY: 0, opacity: 1},
        {func: FUNC_PAINT, relativeX: -1, relativeY: 1, opacity: 0.5},
        {func: FUNC_PAINT, relativeX: 0, relativeY: 1, opacity: 1},
        {func: FUNC_PAINT, relativeX: 1, relativeY: 1, opacity: 0.5},
    ]
}

const BRUSH_BASIC_DARKEN = {
    name: "Basic Darkening Brush",
    functionArray: [
        {func: FUNC_DARKEN, relativeX: -1, relativeY: -1, opacity: 0.5},
        {func: FUNC_DARKEN, relativeX: 0, relativeY: -1, opacity: 1},
        {func: FUNC_DARKEN, relativeX: 1, relativeY: -1, opacity: 0.5},
        {func: FUNC_DARKEN, relativeX: -1, relativeY: 0, opacity: 1},
        {func: FUNC_DARKEN, relativeX: 0, relativeY: 0, opacity: 1},
        {func: FUNC_DARKEN, relativeX: 1, relativeY: 0, opacity: 1},
        {func: FUNC_DARKEN, relativeX: -1, relativeY: 1, opacity: 0.5},
        {func: FUNC_DARKEN, relativeX: 0, relativeY: 1, opacity: 1},
        {func: FUNC_DARKEN, relativeX: 1, relativeY: 1, opacity: 0.5},
    ]
}


const BRUSH_BASIC_LIGHTEN = {
    name: "Basic Darkening Brush",
    functionArray: [
        {func: FUNC_LIGHTEN, relativeX: -1, relativeY: -1, opacity: 0.5},
        {func: FUNC_LIGHTEN, relativeX: 0, relativeY: -1, opacity: 1},
        {func: FUNC_LIGHTEN, relativeX: 1, relativeY: -1, opacity: 0.5},
        {func: FUNC_LIGHTEN, relativeX: -1, relativeY: 0, opacity: 1},
        {func: FUNC_LIGHTEN, relativeX: 0, relativeY: 0, opacity: 1},
        {func: FUNC_LIGHTEN, relativeX: 1, relativeY: 0, opacity: 1},
        {func: FUNC_LIGHTEN, relativeX: -1, relativeY: 1, opacity: 0.5},
        {func: FUNC_LIGHTEN, relativeX: 0, relativeY: 1, opacity: 1},
        {func: FUNC_LIGHTEN, relativeX: 1, relativeY: 1, opacity: 0.5},
    ]
}