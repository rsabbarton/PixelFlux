document.addEventListener("toolButtonClicked", (event)=>{
  var srcElement = event.detail.srcElement
  switch (srcElement.id) {
    case "SELECTION": 
      log("Selection Tool Selected")
      pixelFlux.currentTool = new Selection(pixelFlux.sprite)
      break
    case "MOVE": 
      log("Move Tool Selected")
      pixelFlux.currentTool = new Move(pixelFlux.sprite)
      break
    case "PENCIL": 
      log("Pencil Tool Selected")
      pixelFlux.currentTool = new Pencil(pixelFlux.sprite)
      break
    case "ERASER":
      log("Eraser Tool Selected")
      pixelFlux.currentTool = new Eraser(pixelFlux.sprite)
      break
    case "BRUSH":
      log("Brush Tool Selected")
      pixelFlux.currentTool = new Brush(pixelFlux.sprite)
      break
    case "SPRAYCAN":
      log("Spray Can Tool Selected")
      pixelFlux.currentTool = new SprayCan(pixelFlux.sprite)
      break
    case "FLOODFILL":
      log("Flood Fill Tool Selected")
      pixelFlux.currentTool = new FloodFill(pixelFlux.sprite)
      break
    case "DARKENLIGHTEN":
      log("Darken Lighten Tool Selected")
      pixelFlux.currentTool = new DarkenLighten(pixelFlux.sprite)
      break
    case "BLEND":
      log("Blend Tool Selected")
      pixelFlux.currentTool = new Blend(pixelFlux.sprite)
      break
    case "STRAIGHTLINE":
      log("Straight Line Tool Selected")
      pixelFlux.currentTool = new StraightLine(pixelFlux.sprite)
      break
    case "SQUARE":
      log("Square Tool Selected")
      pixelFlux.currentTool = new Square(pixelFlux.sprite)
      break
    case "FILLEDSQUARE":
      log("Filled Square Tool Selected")
      pixelFlux.currentTool = new FilledSquare(pixelFlux.sprite)
      break
    case "ELLIPSE":
      log("Ellipse Tool Selected")
      pixelFlux.currentTool = new Ellipse(pixelFlux.sprite)
      break
    case "FILLEDELLIPSE":
      log("Filled Ellipse Tool Selected")
      pixelFlux.currentTool = new FilledEllipse(pixelFlux.sprite)
      break
    
  }
})






class Selection {
  constructor(sprite){
    this.sprite = sprite
    this.sourceSprite = new Sprite(this.sprite.width, this.sprite.height)
    this.alpha = 255
    this.enabled = true
    this.startX = 0
    this.startY = 0
    this.toolOptions = "None Available!"
    document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions
  }
  
  down(x,y, pri, sec, btn){
    
    this.startX = x
    this.startY = y
    
  }
  
  up(x,y, pri, sec){
    if(y<this.startY)
      y-=1
    if(x<this.startX)
      x-=1
    pixelFlux.currentSelection = {
                                  enabled: true,
                                  x1: this.startX, 
                                  y1: this.startY,
                                  x2: x,
                                  y2: y
                                 }
  }
  
  drag(x1,y1,x2,y2, pri, sec, btn){

    if(y2<this.startY)
      y2-=1
    if(x2<this.startX)
      x2-=1
    pixelFlux.currentSelection = {
                                  enabled: true,
                                  x1: this.startX, 
                                  y1: this.startY,
                                  x2: x2,
                                  y2: y2
                                 }
  }
}


class Move {
  constructor(sprite){
    this.sprite = sprite
    this.canvas = document.createElement("canvas")
    this.canvas.width = this.sprite.width
    this.canvas.height = this.sprite.height
    this.context = this.canvas.getContext("2d")
    this.layerContext = null
    this.alpha = 255
    this.enabled = true
    this.startX = 0
    this.startY = 0
    this.toolOptions = "Click an drag to move on the canvas.  Try it with the select tool!"
    document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions
  }
  
  down(x,y, pri, sec, btn){

    this.startX = x
    this.startY = y
    this.canvas = document.createElement("canvas")
    this.canvas.width = this.sprite.width
    this.canvas.height = this.sprite.height
    this.context = this.canvas.getContext("2d")
    this.layerContext = null
    this.layerContext = this.sprite.getCurrentCanvasContext()
    this.context.drawImage(this.layerContext.canvas, 0, 0, this.sprite.width, this.sprite.height, 0, 0, this.sprite.width, this.sprite.height)
    
  }
  
  up(x,y, pri, sec){
    this.sprite.updateCurrentLayerPixelArray()
    pixelFlux.currentSelection.enabled = false
  }
  
  drag(x1,y1,x2,y2, pri, sec, btn){
    
    if(pixelFlux.currentSelection.enabled){
  
      this.sprite.updateCurrentLayerCanvas()
      
      var sX = pixelFlux.currentSelection.x1
      var sY = pixelFlux.currentSelection.y1
      var sW = pixelFlux.currentSelection.x2 - sX + 1
      var sH = pixelFlux.currentSelection.y2 - sY + 1
      
      this.layerContext.clearRect(sX, sY, sW, sH)
      var x = x2 - this.startX + sX
      var y = y2 - this.startY + sY

      this.layerContext.drawImage(this.canvas, sX, sY, sW, sH, x, y, sW, sH)

      this.sprite.updateCanvasChain()
      
    } else {

      this.sprite.updateCurrentLayerCanvas()
      
      this.layerContext.clearRect(0,0,this.sprite.width, this.sprite.height)
      var x = x2 - this.startX
      var y = y2 - this.startY

      this.layerContext.drawImage(this.canvas, x, y)
      this.sprite.updateCanvasChain()
      
    }
  }
}


class Pencil {
  constructor(sprite){
    this.sprite = sprite
    this.alpha = 255
    this.enabled = true
    
    this.toolOptions = "Left Click - Primary<br>Right Click - Secondary<br>Middle Click - Erase"
    document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions
  }
  
  down(x,y, pri, sec, btn){

    var col = pri
    if(btn == 2)
      col = sec
    if(btn == 4 || keyboard.isDown(VK_SHIFT)){
      col = "#000000"
      this.alpha = 0
    }
    
    
    
    if(pixelFlux.inSelection(x,y))
      this.sprite.setPixelHex(x,y,col,this.alpha)
  }
  
  up(x,y, pri, sec){
    
  }
  
  drag(x1,y1,x2,y2, pri, sec, btn){
    var col = pri
    if(btn == 2)
      col = sec
    if(btn == 4 || keyboard.isDown(VK_SHIFT)){
      col = "#000000"
      this.alpha = 0
    }
    //this.sprite.setPixelHex(x1,y1,col,this.alpha)
    if(pixelFlux.inSelection(x2,y2))
      this.sprite.setPixelHex(x2,y2,col,this.alpha)
  }
}


class Eraser {
  constructor(sprite){
    this.sprite = sprite
    this.alpha = document.getElementById("COLOUROPACITY").value
    this.enabled = true
    this.toolOptions = "No options for this tool!"
    document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions
  }
  down(x,y, pri, sec, btn){
    this.sprite.reducePixelAlpha(x,y,this.alpha)
  }
  
  up(x,y, pri, sec){
    
  }
  
  drag(x1,y1,x2,y2, pri, sec, btn){
    this.sprite.reducePixelAlpha(x1,y1,this.alpha)
    this.sprite.reducePixelAlpha(x2,y2,this.alpha)
  }
}



class Brush {
  constructor(sprite){
    this.lastX = 0
    this.lastY = 0
    this.sprite = sprite
    this.alpha = document.getElementById("COLOUROPACITY").value
    this.enabled = true
    this.toolOptions = "No options for this tool!"
    document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions
    
    this.brush = new PixelBrush(3, 3, FUNC_PAINT)
    this.brush.loadDefaultBrush()

  }
  
  down(x,y, pri, sec, btn){
    this.alpha = document.getElementById("COLOUROPACITY").value
    let col = pri
    if(btn == EVENT_MOUSEBUTTON_RIGHT)
      col = sec

    let color = hex2rgba(col)
    color.a = 255 // n255(this.alpha)
    this.brush.paint(sprite, sprite.currentFrame, sprite.getCurrentFrame().currentLayer, x, y, color,n255(this.alpha))
    this.lastX = x
    this.lastY = y
  }
  
  up(x,y, pri, sec){
    
  }
  
  drag(x1,y1,x2,y2, pri, sec, btn){
    
    // Check to ensure we do not paint twice on the same square
    if(this.lastX == x2 && this.lastY == y2){
      return
    }
    this.lastX = x2
    this.lastY = y2
    
    
    var col = pri
    if(btn == EVENT_MOUSEBUTTON_RIGHT)
        col = sec
    
        let color = hex2rgba(col)
        color.a = 255 // n255(this.alpha)
        this.brush.paint(sprite, sprite.currentFrame, sprite.getCurrentFrame().currentLayer, x2, y2, color, n255(this.alpha))
  }
}



class SprayCan {
  constructor(sprite){
    this.sprite = sprite
    this.alpha = 255
    this.enabled = true
    
    this.radius = 6
    
    this.toolOptions = "<div class='flux-slidercontainer'><input type='range' min='1' max='10' value='2' class='flux-slider' id='SPRAYCANRADIUS'></div><div class='flux-label sprayradiuslabel'>Spray Radius</div>"
    document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions
    
  }
  
  down(x,y, pri, sec, btn){
    var col = pri
      if(btn == EVENT_MOUSEBUTTON_RIGHT)
        col = sec
    this.radius = document.getElementById("SPRAYCANRADIUS").value
    this.sprite.setPixelHex(x+(rand(this.radius*2)-this.radius),y+(rand(this.radius*2)-this.radius),col,this.alpha)
    
  }
  
  up(x,y, pri, sec){
    
  }
  
  drag(x1,y1,x2,y2, pri, sec, btn){
    var col = pri
      if(btn == EVENT_MOUSEBUTTON_RIGHT)
        col = sec
    this.sprite.setPixelHex(x2+(rand(this.radius*2)-this.radius),y2+(rand(this.radius*2)-this.radius),col,this.alpha)
  }
}



class FloodFill {
  constructor(sprite){
    this.sprite = sprite
    this.alpha = 255
    this.enabled = true
    
    this.toolOptions = "No options for this tool!"
    document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions
  }
  
  down(x,y, pri, sec, btn){
    var col = pri
      if(btn == EVENT_MOUSEBUTTON_RIGHT)
        col = sec
    var p = this.sprite.getPixelRGBA(x,y)
    
    this.fillingColour = {r: p.r, g: p.g, b:p.b }
    this.newColour = hex2rgb(col)
    this.fillPixel(x,y)
  }
  
  up(x,y, pri, sec){
    
  }
  
  drag(x1,y1,x2,y2, pri, sec){
   
  }
  
  
  fillPixel(x,y){
    var w = pixelFlux.currentTool.sprite.width
    var h = pixelFlux.currentTool.sprite.height
    
    if(x<0 || y<0 || x>w-1 || y>h-1) 
      return
    
    var pcol = pixelFlux.currentTool.sprite.getPixelRGBA(x,y)
    if(pcol.r != pixelFlux.currentTool.fillingColour.r || 
       pcol.g != pixelFlux.currentTool.fillingColour.g ||
       pcol.b != pixelFlux.currentTool.fillingColour.b) 
      return
    
   if(pcol.r != pixelFlux.currentTool.newColour.r ||
       pcol.g != pixelFlux.currentTool.newColour.g ||
       pcol.b != pixelFlux.currentTool.newColour.b) {
     
       pixelFlux.currentTool.sprite.setPixelRGBA(x,y, pixelFlux.currentTool.newColour.r, pixelFlux.currentTool.newColour.g, pixelFlux.currentTool.newColour.b, pixelFlux.currentTool.alpha)

       pixelFlux.updateCanvasAndPreview()
       //console.log("setting: " + x + "," + y)   
     
       setTimeout(()=>{pixelFlux.currentTool.fillPixel(x-1,y)},0.1)
       setTimeout(()=>{pixelFlux.currentTool.fillPixel(x,y-1)},0.1)
       setTimeout(()=>{pixelFlux.currentTool.fillPixel(x+1,y)},0.1)
       setTimeout(()=>{pixelFlux.currentTool.fillPixel(x,y+1)},0.1)
       
      // pixelFlux.currentTool.fillPixel(x-1,y)
      // pixelFlux.currentTool.fillPixel(x,y-1)
      // pixelFlux.currentTool.fillPixel(x+1,y)
      // pixelFlux.currentTool.fillPixel(x,y+1)
   }
  
    
    
    
    
  }
}



class DarkenLighten {
  constructor(sprite){
    this.sprite = sprite
    this.alpha = 255
    this.enabled = true
    this.amount = 2
    this.toolOptions = "<div class='flux-slidercontainer'><input type='range' min='1' max='10' value='2' class='flux-slider' id='DARKENLIGHTENAMOUNT'></div><div class='flux-label sprayradiuslabel'>Darken/Lighten Amount</div>"
    document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions
    
  }
  
  down(x,y, pri, sec, btn){
    this.amount = document.getElementById("DARKENLIGHTENAMOUNT").value
    
    if(btn >1)
      this.amount = this.amount * -1
    
    var rgba = this.sprite.getPixelRGBA(x,y)
    
    rgba.r = bound(rgba.r - this.amount, 0, 255)
    rgba.g = bound(rgba.g - this.amount, 0, 255)
    rgba.b = bound(rgba.b - this.amount, 0, 255)
    
    
    
    this.sprite.setPixelRGBA(x,y,rgba.r,rgba.g,rgba.b,rgba.a)
  }
  
  up(x,y, pri, sec){
    
  }
  
  drag(x1,y1,x2,y2, pri, sec, btn){
    this.amount = document.getElementById("DARKENLIGHTENAMOUNT").value
    if(btn >1)
      this.amount = this.amount * -1
    
    var rgba = this.sprite.getPixelRGBA(x2,y2)
    
    rgba.r = bound(rgba.r - this.amount, 0, 255)
    rgba.g = bound(rgba.g - this.amount, 0, 255)
    rgba.b = bound(rgba.b - this.amount, 0, 255)
    
    
    
    this.sprite.setPixelRGBA(x2,y2,rgba.r,rgba.g,rgba.b,rgba.a)
  }
}



class Blend {
  constructor(sprite){
    this.sprite = sprite
    this.alpha = 255
    this.enabled = true
    this.amount = 2
    this.toolOptions = "No options Yet :P"
      document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions
    
  }
  
  down(x,y, pri, sec, btn){
    
    
    var c1 = this.sprite.getPixelRGBA(x,y)
    var c2 = this.sprite.getPixelRGBA(x-1,y)
    var c3 = this.sprite.getPixelRGBA(x,y-1)
    var c4 = this.sprite.getPixelRGBA(x+1,y)
    var c5 = this.sprite.getPixelRGBA(x,y+1)
    
    var rgba = {}
    
    rgba.r = (c1.r + c2.r + c3.r + c4.r + c5.r) / 5
    rgba.g = (c1.g + c2.g + c3.g + c4.g + c5.g) / 5
    rgba.b = (c1.b + c2.b + c3.b + c4.b + c5.b) / 5
    rgba.a = (c1.a + c2.a + c3.a + c4.a + c5.a) / 5
    
    
    this.sprite.setPixelRGBA(x,y,rgba.r,rgba.g,rgba.b,rgba.a)
  }
  
  up(x,y, pri, sec){
    
  }
  
  drag(x1,y1,x2,y2, pri, sec, btn){
    var x = x2
    var y = y2
    var c1 = this.sprite.getPixelRGBA(x,y)
    var c2 = this.sprite.getPixelRGBA(x-1,y)
    var c3 = this.sprite.getPixelRGBA(x,y-1)
    var c4 = this.sprite.getPixelRGBA(x+1,y)
    var c5 = this.sprite.getPixelRGBA(x,y+1)
    
    var rgba = {}
    
    rgba.r = (c1.r + c2.r + c3.r + c4.r + c5.r) / 5
    rgba.g = (c1.g + c2.g + c3.g + c4.g + c5.g) / 5
    rgba.b = (c1.b + c2.b + c3.b + c4.b + c5.b) / 5
    rgba.a = (c1.a + c2.a + c3.a + c4.a + c5.a) / 5
    
    
    this.sprite.setPixelRGBA(x2,y2,rgba.r,rgba.g,rgba.b,rgba.a)
  }
}



class StraightLine {
  constructor(sprite){
    this.sprite = sprite
    this.alpha = 255
    this.enabled = true
    
    //this.temporaryCanvas = document.createElement("canvas")
    //this.temporaryContext = this.temporaryCanvas.getContext("2d")
    
    this.colour = null
    this.startX = 0
    this.startY = 0
    
    this.toolOptions = "No options for this tool!"
    document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions
  }
  
  down(x,y, pri, sec, btn){
    this.colour = pri
    if(btn >1)
      this.colour = sec
    
    this.startX = x + 0.5
    this.startY = y + 0.5
    //this.temporaryContext.drawImage(this.sprite.getCurrentCanvas(), 0,0, this.sprite.width, this.sprite.height, 0,0, this.sprite.width, this.sprite.height)
  }
  
  up(x,y, pri, sec){
    this.sprite.updateCurrentLayerPixelArray()
  }
  
  drag(x1,y1,x2,y2, pri, sec, btn){
    //this.sprite.context.drawImage(this.temporaryCanvas, 0,0, this.sprite.width, this.sprite.height, 0,0, this.sprite.width, this.sprite.height)
    this.sprite.updateCurrentLayerCanvas()
    var ctx = this.sprite.getCurrentCanvasContext()
    ctx.save()
    
    ctx.strokeStyle = this.colour
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(this.startX, this.startY)
    ctx.lineTo(x2 + 0.5, y2 +0.5)
    ctx.stroke()
    
    ctx.restore()
    this.sprite.updateCanvasChain()
    
  }
}



class Square {
  constructor(sprite){
    this.sprite = sprite
    this.alpha = 255
    this.enabled = true
    
    this.temporaryCanvas = document.createElement("canvas")
    this.temporaryCanvas.width = this.sprite.width
    this.temporaryCanvas.height = this.sprite.height
    this.temporaryContext = this.temporaryCanvas.getContext("2d")
    
    this.colour = null
    this.startX = 0
    this.startY = 0
    
    this.toolOptions = "No options for this tool!"
    document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions
  }
  
  down(x,y, pri, sec, btn){
    this.colour = pri
    if(btn >1)
      this.colour = sec
    
    this.startX = x + 0.5
    this.startY = y + 0.5
  }
  
  up(x,y, pri, sec){
    this.sprite.updateCurrentLayerPixelArray()
  }
  
  drag(x1,y1,x2,y2, pri, sec, btn){
    
    this.sprite.updateCurrentLayerCanvas()
    
    var ctx = this.sprite.getCurrentCanvasContext()
    
    ctx.save()
    ctx.strokeStyle = this.colour
    ctx.lineWidth = 1.0
    ctx.strokeRect(this.startX, this.startY, x2 + 0.5 - this.startX, y2 + 0.5 - this.startY);
    ctx.restore()
    
    this.sprite.updateCanvasChain()
    
  }
}


class FilledSquare {
  constructor(sprite){
    this.sprite = sprite
    this.alpha = 255
    this.enabled = true
    this.colour = null
    this.startX = 0
    this.startY = 0 
    this.toolOptions = "No options for this tool!"
    document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions
  }
  
  down(x,y, pri, sec, btn){
    this.colour = pri
    if(btn >1)
      this.colour = sec
    
    this.startX = x 
    this.startY = y 
  }
  
  up(x,y, pri, sec){
    this.sprite.updateCurrentLayerPixelArray()
  }
  
  drag(x1,y1,x2,y2, pri, sec, btn){
    this.sprite.updateCurrentLayerCanvas()
    var ctx = this.sprite.getCurrentCanvasContext()
    ctx.save()
    ctx.fillStyle = this.colour
    ctx.lineWidth = 1.0
    ctx.fillRect(this.startX, this.startY, x2 - this.startX, y2 - this.startY);
    ctx.restore()
    this.sprite.updateCanvasChain()
  }
}


class Ellipse {
  constructor(sprite){
    this.sprite = sprite
    this.alpha = 255
    this.enabled = true
    this.colour = null
    this.startX = 0
    this.startY = 0
    this.toolOptions = "No options for this tool!"
    document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions
  }
  
  down(x,y, pri, sec, btn){
    this.colour = pri
    if(btn >1)
      this.colour = sec
    
    this.startX = x + 0.5
    this.startY = y + 0.5
  }
  
  up(x,y, pri, sec){
    this.sprite.updateCurrentLayerPixelArray()
  }
  
  drag(x1,y1,x2,y2, pri, sec, btn){
    
    var centreX = this.startX + ((x2-this.startX)/2)
    var centreY = this.startY + ((y2-this.startY)/2)
    var radiusX = (x2 + 0.5 - this.startX) / 2
    var radiusY = (y2 + 0.5 - this.startY) / 2
    
    if(radiusX<0)radiusX*=-1.0
    if(radiusY<0)radiusY*=-1.0
    
    
    this.sprite.updateCurrentLayerCanvas()
    var ctx = this.sprite.getCurrentCanvasContext()
    ctx.save()
    ctx.strokeStyle = this.colour
    ctx.lineWidth = 1.0
    ctx.beginPath()
    ctx.ellipse(centreX, centreY, radiusX, radiusY, 0.0, 0.0, 2 * Math.PI)
    ctx.stroke()
    ctx.restore()
    this.sprite.updateCanvasChain()
  }
}


class FilledEllipse {
  constructor(sprite){
    this.sprite = sprite
    this.alpha = 255
    this.enabled = true
    
    this.temporaryCanvas = document.createElement("canvas")
    this.temporaryCanvas.width = this.sprite.width
    this.temporaryCanvas.height = this.sprite.height
    this.temporaryContext = this.temporaryCanvas.getContext("2d")
    
    this.colour = null
    this.startX = 0
    this.startY = 0
    
    this.toolOptions = "No options for this tool!"
    document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions
  }
  
  down(x,y, pri, sec, btn){
    this.colour = pri
    if(btn >1)
      this.colour = sec
    
    this.startX = x + 0.5
    this.startY = y + 0.5
  }
  
  up(x,y, pri, sec){
    this.sprite.updateCurrentLayerPixelArray()
  }
  
  drag(x1,y1,x2,y2, pri, sec, btn){
    
    var centreX = this.startX + ((x2-this.startX)/2)
    var centreY = this.startY + ((y2-this.startY)/2)
    var radiusX = (x2 + 0.5 - this.startX) / 2
    var radiusY = (y2 + 0.5 - this.startY) / 2
    
    if(radiusX<0)radiusX*=-1.0
    if(radiusY<0)radiusY*=-1.0
    this.sprite.updateCurrentLayerCanvas()
    var ctx = this.sprite.getCurrentCanvasContext()
    ctx.save()
    ctx.fillStyle = this.colour
    ctx.lineWidth = 1.0
    ctx.beginPath()
    ctx.ellipse(centreX, centreY, radiusX, radiusY, 0.0, 0.0, 2 * Math.PI)
    ctx.fill()
    ctx.restore()
    this.sprite.updateCanvasChain()
  }
}