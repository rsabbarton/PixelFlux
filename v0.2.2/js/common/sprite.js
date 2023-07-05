

class Sprite {
  constructor(width, height){
    this.isSprite = true
    this.width = width
    this.height = height
    this.name = ""
    this.nameSet = false
    
    this.frames = new Array()
    this.frames[0] = new Frame(width, height)
    this.currentFrame = 0
    
    this.canvas = document.createElement("canvas")
    this.canvas.width = width
    this.canvas.height = height
    this.context = this.canvas.getContext("2d")
    
    this.history = new Array()
    this.redoArray = new Array()
    
    this.fps = 12
    
    this.spriteSheetCanvas = null
  }
  
  setFramerate(fps){
    if(fps > 0 && fps <= 60){
      this.fps = fps
    } else {
      console.log(`Selected Framerate (${fps}) not valid`)
    }
    return this.fps
  }
  
  addFrame(){
    var frame = new Frame(this.width, this.height)
    this.frames.push(frame)
    this.currentFrame = this.frames.length - 1
    this.updateCanvasChain()
  }
  
  setCurrentFrame(n){
    this.currentFrame = bound(n, 0, this.frames.length - 1)
  }
  
  selectNextFrame(){
    var f = this.currentFrame + 1
    if(f>this.frames.length -1)
      f = 0
    this.currentFrame = f
    this.updateCanvasChain()
  }
  selectPreviousFrame(){
    var f = this.currentFrame - 1
    if(f<0)
      f = this.frames.length -1
    this.currentFrame = f
    this.updateCanvasChain()
  }
  
  insertFrameAfterCurrent(){
    var p = this.currentFrame + 1
    var frame = new Frame(this.width, this.height)
    this.frames.splice(p, 0, frame)
    this.currentFrame = p
    this.updateCanvasChain()
  }
  
  insertFrameBeforeCurrent(){
    var p = this.currentFrame
    var frame = new Frame(this.width, this.height)
    this.frames.splice(p, 0, frame)
    this.currentFrame = p
    this.updateCanvasChain()
  }
  
  insertFrameAfter(n){
    var currentFrame = this.currentFrame
    this.currentFrame = n
    this.insertFrameAfterCurrent()
    this.currentFrame = currentFrame
  }
  
  
  copyFrame(n){
    var currentFrame = this.currentFrame
    this.currentFrame = n
    this.insertFrameAfterCurrent()
    this.frames[this.currentFrame].copyFromFrame(this.frames[n])
    this.currentFrame = currentFrame
    this.updateCanvasChain()
  }
  
  
  moveFrameForward(n){
    var frame = this.frames.splice(n,1)
    this.frames.splice(n+1, 0, frame[0])
    //this.frames[n+1].reInitCanvas()
    this.updateCanvasChain()
  }
  
  moveFrameBackward(n){
    var frame = this.frames.splice(n,1)
    this.frames.splice(n-1, 0, frame[0])
    //this.frames[n-1].reInitCanvas()
    this.updateCanvasChain()
  }
  
  
  deleteFrame(n){
    this.frames.splice(n,1)  
    this.currentFrame = bound(this.currentFrame, 0, this.frames.length -1)
    this.updateCanvasChain()
  }
  
  setCurrentLayer(n){
    this.frames[this.currentFrame].setCurrentLayer(n)
  }
  
  addLayer(){
    this.frames[this.currentFrame].addLayer()
  }
  
  nextLayerUp(){
    this.frames[this.currentFrame].nextLayer(1)
  }
  
  nextLayerDown(){
    this.frames[this.currentFrame].nextLayer(-1)
  }
  
  clearLayer(i){
    this.frames[this.currentFrame].clearLayer(i)
    this.pushToUndoHistory()
  }
  
  moveLayerUp(n){
    this.frames[this.currentFrame].moveLayerUp(n)
  }
  
  moveLayerDown(n){
    this.frames[this.currentFrame].moveLayerDown(n)
  }
  
  setPixelRGBA(x,y,r,g,b,a){
    this.frames[this.currentFrame].setPixelRGBA(x,y,r,g,b,a)
    this.updateCanvas()
  }
  
  getPixelRGBA(x,y){
    return this.frames[this.currentFrame].getPixelRGBA(x,y)
  }
  
  setPixelHex(x,y, col, a){
    this.frames[this.currentFrame].setPixelHex(x,y,col,a)
    this.updateCanvas()
  }
  
  setPixelHexInterim(x,y, col, a){
    this.frames[this.currentFrame].setPixelHexInterim(x,y,col,a)
    this.updateCanvas()
  }
  
  reducePixelAlpha(x,y,amt){
    this.frames[this.currentFrame].reducePixelAlpha(x,y,amt)
    this.updateCanvas()
  }
  
  randomise(){
    this.frames[this.currentFrame].randomise()
    this.updateCanvas()
  }
  
  clearCanvas(){
    this.context.clearRect(0,0,this.width,this.height)
  }
  
  updateCanvas(){
    this.clearCanvas()
    this.frames[this.currentFrame].drawToCanvas(this.context, 0, 0)
  }
  
  
  drawToCanvasId(id, x, y, scale){
    this.updateCanvas()
    var canvas = document.getElementById(id)
    var ctx = canvas.getContext("2d")
    ctx.drawImage(this.canvas, 0, 0, this.width, this.height, 0, 0, this.width * scale, this.height * scale)
  }
  
  
  drawAnimationToCanvasId(id, x, y, scale){
    var canvas = document.getElementById(id)
    var ctx = canvas.getContext("2d")
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0,0,canvas.width,canvas.height)
    var fps = this.fps
    var epochm = Date.now()
    var n = this.frames.length
    var interval = 1000/fps
    var runtime = interval * n
    var frameNumber = Math.floor((epochm % runtime) / interval)
    ctx.drawImage(this.frames[frameNumber].canvas, 0, 0, this.width, this.height, x, y, this.width * scale, this.height * scale)
  }
  
  
  
  getCurrentCanvasContext(){
    return this.frames[this.currentFrame].getCurrentCanvasContext()
  }
  
  getCurrentFrame(){
    return this.frames[this.currentFrame]
  }
  
  updateCanvasChain(){
    this.frames[this.currentFrame].updateCanvasChain()
    this.updateCanvas()
  }
  
  updateCurrentLayerCanvas(){
    this.frames[this.currentFrame].updateCurrentLayerCanvas()
  }
  
  updateCurrentLayerPixelArray(){
    this.frames[this.currentFrame].updateCurrentLayerPixelArray()
  }
  
  
  updateSpriteSheetCanvas(){
    var w = this.width
    var h = this.height
    var f = this.frames.length
    
    this.spriteSheetCanvas = document.createElement("canvas")
    this.spriteSheetCanvas.width = w * f
    this.spriteSheetCanvas.height = h
    var ctx = this.spriteSheetCanvas.getContext("2d")
    
    this.updateCanvasChain()
    
    var i = 0
    this.frames.forEach((frame)=>{
      var x = w * i
      var y = 0
      ctx.drawImage(frame.canvas, 0, 0, w, h, x, y, w, h)
      i++
    })
    
  }
  
  
  ///////////// Good to here.....
  loadFromSprite(source){
    
    this.width = source.width
    this.height = source.height
    this.canvas = document.createElement("canvas")
    this.canvas.width = source.width
    this.canvas.height = source.height
    this.context = this.canvas.getContext("2d")
    
    this.name = source.name
    
    
    this.frames = new Array()
    this.currentFrame = 0
    
    for(var f = 0; f<source.frames.length; f++){
      var frame = new Frame(this.width, this.height)
      this.frames.push(frame)
      this.frames[f].layers = new Array()
      for(var l = 0; l < source.frames[f].layers.length; l++){
          
        var layer = new Layer(this.width, this.height)
        this.frames[f].layers.push(layer)
        
        this.frames[f].layers[l].name = source.frames[f].layers[l].name
        this.frames[f].layers[l].visible = source.frames[f].layers[l].visible
        for(var p = 0; p < source.frames[f].layers[l].pixels.length; p++){
          this.frames[f].layers[l].pixels[p].red = source.frames[f].layers[l].pixels[p].red
          this.frames[f].layers[l].pixels[p].green = source.frames[f].layers[l].pixels[p].green
          this.frames[f].layers[l].pixels[p].blue = source.frames[f].layers[l].pixels[p].blue
          this.frames[f].layers[l].pixels[p].alpha = source.frames[f].layers[l].pixels[p].alpha
        }
        this.frames[f].layers[l].updateCanvas()
      }
      this.frames[f].updateCanvas()
    }
    
    this.updateCanvas()
    
  }    
  
  loadFromDataURL(dataURL, callback){
    const sprite = this
    var image = new Image()
    image.src = dataURL
    image.onload = ()=>{
      sprite.frames[sprite.currentFrame].addLayer()
      var ctx = sprite.getCurrentCanvasContext()
      ctx.drawImage(image, 0,0, image.width, image.height, 0,0, sprite.width, sprite.height)
      sprite.updateCurrentLayerPixelArray()
      sprite.updateCanvasChain()
      callback()
    }
  }    
  exportPixelArray(){
    var pa = new Array()
    for(var i = 0; i< this.pixelArray.length; i++){
      pa.push(this.pixelArray[i].getRGBAArray())
    }
    return pa
  }  
  importPixelArray(pa, width, height){
    //pa = JSON.parse(pa)
    this.width = width
    this.height = height
    this.initCanvas()
    this.initPixelArray()
    for(var i = 0; i< width * height; i++){
      this.pixelArray[i].setColour(pa[i][0], pa[i][1], pa[i][2], pa[i][3])
    }
    this.updateInternalCanvas()
  }    
  pushToUndoHistory(){
    var s = new Sprite(this.width, this.height)
    s.loadFromSprite(this)
    this.history.push(s)
    this.redoArray = new Array()
  }  
  undo(){
    if(this.history.length > 0){
      var r = new Sprite(this.width,this.height)
      r.loadFromSprite(this)
      this.redoArray.push(r)
      var h = this.history.pop()
      this.loadFromSprite(h)
      this.updateCanvasChain()
    }
  }  
  
  redo(){
    if(this.redoArray.length > 0){
      var r = this.redoArray.pop()
      var s = new Sprite(this.width, this.height)
      s.loadFromSprite(this)
      this.history.push(s)
      this.loadFromSprite(r)
      this.updateCanvasChain()
    }
  }
  ////////////// ^^^ To be recoded
}



class Frame {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.layers = new Array()
    this.layers[0] = new Layer(width, height)
    this.layers[0].name = "LAYER 0"
    this.currentLayer = 0
    
    this.canvas = document.createElement("canvas")
    this.context = this.canvas.getContext("2d")
  }
  
  setCurrentLayer(n){
    if(n>this.layers.length - 1)
      n = this.layers.length - 1
    if(n < 0)
      n = 0
    this.currentLayer = n
  }
  
  getCurrentLayer(){
    return this.layers[this.currentLayer]
  }

  reInitCanvas(){
    this.canvas = document.createElement("canvas")
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.context = this.canvas.getContext("2d")
    this.updateCanvas()
  }
  
  
  addLayer(){
    var layer = new Layer(this.width, this.height)
    layer.name = "LAYER " + this.layers.length.toString()
    this.layers.push(layer)
    this.currentLayer = this.layers.length - 1
    log("New Layer Added... " + this.layers.length + " layers in this frame")
  }
  
  nextLayer(n){
    this.currentLayer += n
    if(this.currentLayer > this.layers.length -1)
      this.currentLayer = 0
    if(this.currentLayer < 0)
      this.currentLayer = this.layers.length - 1
    log("Current Layer is: " + this.currentLayer)
  }
  
  clearCurrentLayer(){
    this.layers[this.currentLayer].clear()
    this.updateCanvas()
  }
  
  clearLayer(i){
    this.layers[i].clear()
  }
  
  deleteLayer(i){
    this.layers.splice(i, 1)
  }
  
  
  moveLayerUp(n){
    var layer = this.layers.splice(n,1)
    this.layers.splice(n+1,0,layer[0])
    this.updateCanvas()
  }
  
  moveLayerDown(n){
    var layer = this.layers.splice(n,1)
    this.layers.splice(n-1,0,layer[0])
    this.updateCanvas()
  }
  
  setPixelRGBA(x,y,r,g,b,a){
    this.layers[this.currentLayer].setPixelRGBA(x,y,r,g,b,a)
    this.updateCanvas()
  }
  
  getPixelRGBA(x,y){
    return this.layers[this.currentLayer].getPixelRGBA(x,y)
  }
  
  setPixelHex(x,y, col, a){
    this.layers[this.currentLayer].setPixelHex(x,y,col,a)
    this.updateCanvas()
  }
  
  setPixelHexInterim(x,y, col, a){
    this.layers[this.currentLayer].setPixelHexInterim(x,y,col,a)
    this.updateCanvas()
  }
  
  reducePixelAlpha(x,y,amt){
    this.layers[this.currentLayer].reducePixelAlpha(x,y,amt)
    this.updateCanvas()
  }
  
  randomise(){
    this.layers[this.currentLayer].randomise()
    this.updateCanvas()
  }
  
  clearCanvas(){
    this.context.clearRect(0,0,this.width,this.height)
  }
  
  copyFromFrame(src){
    this.layers = new Array()
    for(var l = 0;l<src.layers.length; l++){
      var layer = new Layer(src.width, src.height)
      this.layers.push(layer)
      this.layers[l].copyFromLayer(src.layers[l])
      //this.layers[l].name = src.layers[l].name
    }
    this.updateCanvas()
  }
  
  
  updateCanvas(){
    this.clearCanvas()
    this.layers.forEach((layer)=>{
      if(layer.visible)
        this.context.drawImage(layer.canvas, 0, 0, this.width, this.height, 0 ,0 , this.width, this.height)
    })
  }
  
  updateCanvasChain(){
    this.updateCanvas()
  }
  
  updateCurrentLayerCanvas(){
    this.layers[this.currentLayer].updateCanvas()
  }
  
  updateCurrentLayerPixelArray(){
    this.layers[this.currentLayer].updatePixelArray()
  }
  
  drawToCanvas(context, x, y){
    context.drawImage(this.canvas, 0, 0, this.width, this.height, x, y, this.width, this.height)
  }
  
  getCurrentCanvasContext(){
    return this.layers[this.currentLayer].context
  }


  mergeLayerDown(n){
    this.layers[n].mergeInto(this.layers[n-1])
    this.deleteLayer(n)
  }

}


class Layer {
  constructor(width, height){
    this.width = width
    this.height = height
    this.name = ""
    this.visible = true
    this.locked = false
    this.canvas = document.createElement("canvas")
    this.context = this.canvas.getContext("2d")
    this.pixels = new Array()
    this.initPixelArray()
  }
  
  initPixelArray(){
    this.pixels = new Array()
    for(var i = 0; i < this.width * this.height; i++){
      var p = new Pixel()
      this.pixels.push(p)
    }
  }
  
  show(){
    this.visible = true
    this.updateCanvas()
  }
  
  hide(){
    this.visible = false
    this.updateCanvas()
  }
  
  toggleVisible(){
    this.visible = !this.visible
    this.updateCanvas()
  }
  
  lock(){
    this.locked = true
  }
  
  unlock(){
    this.locked = false
  }
  
  toggleLocked(){
    this.locked = !this.locked
  }

  clear(){
    if(this.locked) return
    for(var i = 0; i<this.pixels.length; i++){
      this.pixels[i].setRGBA(0,0,0,0)
    }
    this.updateCanvas()
  }
  
  copyFromLayer(src){
    if(this.locked) return
    for(var i = 0;i<src.width * src.height; i++){
      this.pixels[i].copyFromPixel(src.pixels[i])
    }
    
    this.name = src.name
    this.updateCanvas()
  }
  
  mergeInto(destination){
    this.updateCanvas()
    destination.updateCanvas()
    destination.context.drawImage(this.canvas, 0, 0)
    destination.updatePixelArray()
  }

  setPixelRGBA(x,y,r,g,b,a){
    if(this.locked) return
    var i = (y * this.width) + x
    this.pixels[i].setColour(r,g,b,a)
    this.updateCanvas()
  }
  
  getPixelRGBA(x,y){
    x = bound(x, 0, this.width-1)
    y = bound(y, 0, this.height-1)
    var i = (y * this.width) + x
    var rgba = this.pixels[i].getRGBA()
    return rgba
  }
  
  setPixelHex(x,y, col, a){
    if(this.locked) return
    if(x<0||x>this.width-1||y<0||y>this.height-1)
      return
    var i = (y * this.width) + x
    if(!col){
      this.pixels[i].setAlpha(a)
    } else {
      var rgb = hex2rgb(col)
      this.pixels[i].setColour(rgb.r,rgb.g,rgb.b,a)
    }
    this.updateCanvas()
  }
  
  // setPixelHexInterim does not call updateInternalCanvas
  // Needs to be called manually
  setPixelHexInterim(x,y, col, a){
    if(this.locked) return
    if(x<0||x>this.width-1||y<0||y>this.height-1)
      return
    var i = (y * this.width) + x
    if(!col){
      this.pixels[i].setAlpha(a)
    } else {
      var rgb = hex2rgb(col)
      this.pixels[i].setColour(rgb.r,rgb.g,rgb.b,a)
    }
  }
  
  clearLayer(){
    if(this.locked) return
    this.context.clearRect(0,0,this.width, this.height)
  }
  
  reducePixelAlpha(x,y,amt){
    if(this.locked) return
    var i = (y * this.width) + x
    this.pixels[i].alpha = this.pixels[i].alpha - (amt)
    if(this.pixels[i].alpha < 0)
      this.pixels[i].alpha = 0
    this.updateCanvas()
  }
  
  randomise(){
    if(this.locked) return
    for(var i = 0; i < this.width * this.height; i++){
      this.pixels[i].setRandomColour()
    }
    this.updateCanvas()
  }
  
  updateCanvas(){
    this.clearLayer()
    for(var i = 0; i < this.width * this.height; i++){
      var x = i%this.width
      var y = Math.floor(i/this.width)
      this.pixels[i].drawToCanvas(this.context, x, y)
    }
  }
  
  updatePixelArray(){
    var pixel = this.context.getImageData(0, 0, this.width, this.height);
    var data = pixel.data;
    
    for(var i = 0; i < this.width * this.height; i++){   
      var di = i * 4 // Data Index in 8bit clamped array for RED
      this.pixels[i].setRGBA(data[di], data[di+1], data[di+2], data[di+3])
    }
  }
}






class Pixel {
  constructor(){
    this.red = 0
    this.green = 0
    this.blue = 0
    this.alpha = 0
  }
  
  setRGBA(r,g,b,a){
    this.setColour(r,g,b,a)
  }
  
  setColour(r,g,b,a){
    this.red = r
    this.green = g
    this.blue = b
    this.alpha = a
  }
  
  setAlpha(a){
    this.alpha = a
  }
  
  setRandomColour(){
    this.red = rand(255)
    this.green = rand(255)
    this.blue = rand(255)
    this.alpha = 255
  }
  
  getRGBA(){
    return {r: ~~this.red,
            g: ~~this.green,
            b: ~~this.blue,
            a: ~~this.alpha}
  }

  getHTMLHex(){
    let r = parseInt(this.red, 10).toString(16).padStart(2, '0')
    let g = parseInt(this.green, 10).toString(16).padStart(2, '0')
    let b = parseInt(this.blue, 10).toString(16).padStart(2, '0')
    return `#${r}${g}${b}`
  }
  
  getRGBAArray(){
    return [this.red,
            this.green,
            this.blue,
            this.alpha]
  }
  
  copyFromPixel(src){
    this.red = src.red
    this.green = src.green
    this.blue = src.blue
    this.alpha = src.alpha
  }
  
  drawToCanvas(ctx, x, y){
    ctx.fillStyle = "rgba("+ this.red +","+ this.green +","+ this.blue +","+( this.alpha/255)+")";
    ctx.fillRect( x, y, 1, 1 );
  }
}