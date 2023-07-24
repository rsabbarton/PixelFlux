const FUNC_SET = 0
const FUNC_PAINT = 1
const FUNC_DARKEN = 2
const FUNC_LIGHTEN = 3
const FUNC_ERASE = 4

class PixelBrush {
    constructor(width, height, func){
        this.name = ""
        this.func = func
        this.width = width
        this.height = height
        this.opacityArray = new Array()
    }

    loadFromPixelArray(pixelArray){

    }

    loadFromOpacityArray(opacityArray){
        let pixelCount = this.width * this.height       
        if(!opacityArray || (this.pixelCount != opacityArray.length)){
            console.log("opacityArray not provided or does not contain correct number of pixels")
            this.loadDefaultBrush()
            return
        }

        
    }

    loadDefaultBrush(){
        this.width = 3
        this.height = 3
        this.opacityArray = [0.8, 1, 0.8 , 1, 1, 1, 0.8, 1, 0.8]
    }

    paint(sprite, frameNumber, layerNumber, x, y, color, opacity){
        
        let offsetX = Math.round(this.width/2)
        let offsetY = Math.round(this.height/2)

        let frame = sprite.frames[frameNumber]
        let layer = frame.layers[layerNumber]

        for(let sY = 0; sY < this.height; sY++){
            for(let sX = 0; sX < this.width; sX++){
                let oIndex = (sY * this.width) + sX
                let drawX = x - offsetX + sX
                let drawY = y - offsetY + sY
                
                if(drawX > -1 &&
                   drawX < sprite.width &&
                   drawY > -1 &&
                   drawY < sprite.height){
                    switch (this.func){
                        case FUNC_SET:   this.setPixel(layer, drawX, drawY, color.r, color.g, color.b, this.opacityArray[oIndex]*255, opacity); break;
                        case FUNC_PAINT: this.paintPixel(layer, drawX, drawY, color.r, color.g, color.b, this.opacityArray[oIndex]*255, opacity); break;
                        case FUNC_DARKEN: break;
                        case FUNC_LIGTHEN: break;
                        case FUNC_ERASE: break;
                    }

                }
            }
        }
        sprite.updateCanvasChain()
        pixelFlux.updateCanvasAndPreview()
    }

    setPixel(layer, drawX, drawY, r, g, b, a){
        //console.log(drawX, drawY, r, g, b, a)
        let pixel = layer.getPixel(drawX, drawY)
        let currentColor = pixel.getRGBA()
        
        layer.setPixelRGBA(drawX, drawY, r, g, b, a)
    }
    
    paintPixel(layer, drawX, drawY, r, g, b, a, opacity){
        let pixel = layer.getPixel(drawX, drawY)
        let currentColor = pixel.getRGBA()
        let newColor = this.blend(currentColor, {r:r,g:g,b:b,a:a}, opacity)
        //console.log(newColor)
        layer.setPixelRGBA(drawX, drawY, newColor.r, newColor.g, newColor.b, newColor.a, 0, 255)
    }

    blend(c1, c2, opacity){

        c1 = normaliseColor(c1)
        c2 = normaliseColor(c2)
        
        c1.r = this.factorTo(c2.r, c1.r, c1.a)
        c1.g = this.factorTo(c2.g, c1.g, c1.a)
        c1.b = this.factorTo(c2.b, c1.b, c1.a)
        
        let c = {}

        c.r = this.factorTo(c1.r, c2.r, opacity * c2.a)
        c.g = this.factorTo(c1.g, c2.g, opacity * c2.a)
        c.b = this.factorTo(c1.b, c2.b, opacity * c2.a)


        c.a = 
            c1.a + (c2.a * opacity)
        

        c.r = bound(c.r * 255,0,255)
        c.b = bound(c.b * 255,0,255)
        c.g = bound(c.g * 255,0,255)
        c.a = bound(c.a * 255,0,255)
        //console.log(c1,c2,c)
        return c
    }


    darkenPixel(layer, drawX, drawY, opacity){
        let pixel = layer.getPixel(drawX, drawY)
        let currentColor = pixel.getRGBA()
        let adjuster = 1 - (opacity)
        let newColor = {
            r: bound(currentColor.r * adjuster,0,255),
            g: bound(currentColor.g * adjuster,0,255),
            b: bound(currentColor.b * adjuster,0,255),
            a: bound(currentColor.a,0,255)
        }
        //console.log(newColor)
        layer.setPixelRGBA(drawX, drawY, newColor.r, newColor.g, newColor.b, newColor.a)
    }

    lightenPixel(layer, drawX, drawY, opacity){
        let pixel = layer.getPixel(drawX, drawY)
        let currentColor = pixel.getRGBA()
        let adjuster = (opacity * this.opacity)
        let newColor = {
            r: bound(currentColor.r + (adjuster * 255),0,255),
            g: bound(currentColor.g + (adjuster * 255),0,255),
            b: bound(currentColor.b + (adjuster * 255),0,255),
            a: bound(currentColor.a,0,255)
        }
        //console.log(newColor)
        
        layer.setPixelRGBA(drawX, drawY, newColor.r, newColor.g, newColor.b, newColor.a)
    }

    factorTo(o, n, factor){
        let diff = n - o
        let f = diff * factor
        //console.log(o,n,factor,diff,f)
        return o + f
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







class BrushSet {
    constructor(){
        this.brushes = new Array()
        this.currentBrush = false
        this.currentBrushIndex = false

    }

    loadBrushSet(brushSet){
        brushSet.forEach(brush=>{
            let newBrush = new PixelBrush(brush.width, brush.height, FUNC_PAINT)
            newBrush.loadFromOpacityArray(brush.opacityArray)
            this.brushes.push(newBrush)
        })
    }

    getBrushCount(){
        return this.brushes.length
    }

    selectBrush(index){
        if(index > -1 && index < this.brushes.length){
            this.currentBrush = this.brushes[index]
            this.currentBrushIndex = index

        }
    }

    getCurrentBrush(){
        return this.currentBrush
    }
}