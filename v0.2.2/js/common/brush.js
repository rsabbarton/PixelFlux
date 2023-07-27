
//  #######################################################
//  #
//  #
//  #
//  #######################################################
const FUNC_SET = 0
const FUNC_PAINT = 1
const FUNC_DARKEN = 2
const FUNC_LIGHTEN = 3
const FUNC_ERASE = 4

class PixelBrush {
    constructor(c){
        this.name = ""
        this.func = FUNC_PAINT
        this.width = false
        this.height = false
        this.opacityArray = false
    }

    loadFromPixelArray(width, heigth, name, pixelArray){

    }

    loadFromOpacityArray(width, height, name, opacityArray){

        let pixelCount = width * height   
        
        if(pixelCount != opacityArray.length){
            console.log("opacityArray not provided or does not contain correct number of pixels")
            this.loadDefaultBrush()
            return
        } else {
            this.width = width
            this.height = height
            this.name = name
            this.opacityArray = new Array()
            opacityArray.forEach(a=>{this.opacityArray.push(a)})
        }

        
    }

    loadDefaultBrush(){
        this.width = 3
        this.height = 3
        this.opacityArray = [0.8, 1, 0.8, 
                             1,   1, 1,  
                             0.8, 1, 0.8]
    }

    paint(sprite, frameNumber, layerNumber, x, y, color, opacity){
        
        let offsetX = Math.round(this.width/2) - (this.width % 2)
        let offsetY = Math.round(this.height/2) - (this.height % 2)

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

    //  #######################################################
    //  #
    //  #   Function blend(c1, c2, opacity)
    //  #
    //  #   c1 = obj {r: red, g: green, b: blue, a: alpha}
    //  #       The original or base colour and alpha
    //  #
    //  #   c2 = obj {r: red, g: green, b: blue, a: alpha}
    //  #       The colour to be applied over the base colour
    //  #
    //  #   opacity = This is a global opacity.  It governs
    //  #   then amount of/opacity of c2 when applied over c1
    //  #
    //  #######################################################
    blend(c1, c2, opacity){

        // first we normalise the colours.  In this we mean take
        // rgb as a vector and convert them to a unit vector where
        // rgb values are between 0 and 1 rather than 0 and 255.
        c1 = normaliseColor(c1)
        c2 = normaliseColor(c2)
        
        // Because we are treating these as vectors we can calculate
        // the magnitute of the colours which is the distance from the 
        // origin and equates to the total brightness of all rbg values
        // combined.
        c1.mag = magnitude3v(c1.r, c1.g, c1.b)
        c2.mag = magnitude3v(c2.r, c2.g, c2.b)

        // The factorTo function takes the value a and moves it towards
        // towards value b by a factor of value c.
        // factorTo(5,10,0.5) will move half way and result in 7.5
        // In this case we want to determin how much of the original colour
        // to use.  If the opacity of the original colour is 0 then the original
        // colour is equal to the new colour.  So we factorTo(new, old, old.opacity)
        c1.r = this.factorTo(c2.r, c1.r, c1.a)
        c1.g = this.factorTo(c2.g, c1.g, c1.a)
        c1.b = this.factorTo(c2.b, c1.b, c1.a)
        c1.mag = this.factorTo(c2.mag, c1.mag, c1.a)

        // Then we work out the target magnitude.  This works out what we 
        // want the magnitude to be based on two colours with different magnitude.
        // We want to adjust the magnitude by the opacity of the colour we are applying.
        let targetMag = c1.mag + ((c2.mag - c1.mag) * opacity)
        
        // Now we have everything we need we can create a NEW colour
        // that we will return.  This is just an empty object.
        let c = {}

        // First we get the blended colours based on the opacity 
        // and the alpha values of the colour being applied.
        c.r = this.factorTo(c1.r, c2.r, opacity * c2.a)
        c.g = this.factorTo(c1.g, c2.g, opacity * c2.a)
        c.b = this.factorTo(c1.b, c2.b, opacity * c2.a)

        // Now, we can create a normalised vector (unit vector)
        // for the new colour.  This would be full brightness.  However,
        // what we really want is the brightness to be equal to the target
        // magnitude.
        let normalisedVector = normalise3v(c.r, c.g, c.b)

        // So here we multiply the unit vector of the rgb by the target
        // magnitude giving us (ALMOST) the final colour.
        c.r = normalisedVector.r * targetMag
        c.g = normalisedVector.g * targetMag
        c.b = normalisedVector.b * targetMag

        // Before we are done we have to consider the alpha to be additive 
        // only so we add the new (opacity adjusted) opacity to the original
        // opacity of c1
        c.a = c1.a + (c2.a * opacity)

        // Finally, some edge cases may have a magnitude of > 1 like white
        // for example.  The math still works but the results need to be bound
        // to 0-255 when they are output which we do here.
        c.r = bound(c.r * 255,0,255)
        c.b = bound(c.b * 255,0,255)
        c.g = bound(c.g * 255,0,255)
        c.a = bound(c.a * 255,0,255)
        // then we are done and return the new blended colour object.
        return c // Whew.
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
            console.log(brush)
            let newBrush = new PixelBrush()
            newBrush.loadFromOpacityArray(brush.width, brush.height, brush.name, brush.opacityArray)
            this.brushes.push(newBrush)
        })
    }

    loadBrushSetFromUrl(url){
        get(url)
        .then(json=>{
            json = JSON.parse(json)
            this.loadBrushSet(json.brushSet)
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