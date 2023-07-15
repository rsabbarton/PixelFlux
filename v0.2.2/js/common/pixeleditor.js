
class PixelEditor {
  constructor(){
    this.sprite = new Sprite(32,32)
    
    this.drawingScale = 16
    this.previewScale = 2
    this.animationPreviewScale = 2
    this.animating = false
    this.currentTool = false
    this.tilePreview = false
    // TODO - Remove this when drrawing is implemented
    //log("randomising new sprite on inception... ")
    //this.sprite.randomise()
    this.lastUpdate = Date.now()
    this.currentSelection = {
      enabled: false,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0
    }
    
    this.preferences = {
      "preserveLayerContinuity": true,
      "undoHistorySize": 20
    }
  }
  
  init(callback){
    // DO INIT STUFF AND THEN CALLBACK THEN START EDITOR
    this.setupUI()
    this.addEventListeners()
    this.loadUserPreferences()
    .then((prefs)=>{
      callback()
      this.start()
    })
    .catch((error)=>{
      console.log(error)
      callback()
      this.start()
    })
    
    return    
  }
  
  start(){
    this.sprite.updateCanvasChain()
    this.updateCanvasAndPreview()
  }
  
  setupUI(){
    flux.createFullScreenUI()
    let menuUrl = "/config/menu.json"
    if(DEVPREVIEW) menuUrl = "/dev" + menuUrl
    console.log(DEVPREVIEW)
    console.log("LOADING MENU: ", menuUrl)
    flux.loadMenu(menuUrl, (id)=>{
      const postEvent = new CustomEvent('menuButtonClicked', { detail: {srcElementId: id}})
      document.dispatchEvent(postEvent)
      log("MENU ID: " +id + " CLICKED")
    })
    
    
    log("Calling Create Workspace Window")
    this.createWorkspaceWindow()
    this.createColourPalletWindow()
    this.createToolbarWindow()
    this.createPreviewWindow()
    this.createAnimationPreviewWindow()
    this.createAnimationToolsWindow()
    this.createToolOptionsWindow()
    this.createLayersWindow()
    this.createFramesWindow()
    this.createDebugWindow()
    this.createOpenGallery()
    this.createPixelBrushWindow()

    flux.restoreWindowArrangement(builtInWindowArrangements.CLASSIC)
    
  }
  
  
  addEventListeners(){
    document.addEventListener("fluxWindowResize", (event)=>{
      this.resizeContentCanvases()
      this.updateCanvasAndPreview()
    })
    
    document.addEventListener("click", (event)=>{
      var srcElement = event.srcElement
      if(srcElement.matches(".flux-toolbarbutton")){      
        const postEvent = new CustomEvent('toolButtonClicked', { detail: {srcElementId: srcElement.id, srcElement: srcElement }})
        document.dispatchEvent(postEvent)
      }
    })
    
    document.addEventListener("keyup", (event)=>{
      switch (event.keyCode) {
        case VK_Z:
          if(event.ctrlKey){
            this.sprite.undo()
            this.updateCanvasAndPreview()
          }
          break;
        case VK_R:
          if(event.altKey){
            event.preventDefault()
            this.sprite.redo()
            this.updateCanvasAndPreview()
          }
          break;
        case VK_LEFT:
          pixelFlux.sprite.selectPreviousFrame()
          pixelFlux.sprite.updateCanvasChain()
          pixelFlux.updateCanvasAndPreview()
          break
        case VK_RIGHT:
          pixelFlux.sprite.selectNextFrame()
          pixelFlux.sprite.updateCanvasChain()
          pixelFlux.updateCanvasAndPreview()
          break
      }
    })
  }
  
  setFramerate(fps){
    return this.sprite.setFramerate(fps)
  }
  
  resizeContentCanvases(){
    var canvas = document.getElementById("DRAWINGCANVAS")
    canvas.parentElement.style.width = "100%"
    canvas.parentElement.style.height = "100%"
    canvas = document.getElementById("PREVIEWCANVAS")
    canvas.parentElement.style.width = "100%"
    canvas.parentElement.style.height = "100%"      
    canvas = document.getElementById("PREVIEWCANVAS")
    canvas.parentElement.style.width = "100%"
    canvas.parentElement.style.height = "100%"
    this.updateCanvasAndPreview()
  }
  
  toggleTilePreview(){
    this.tilePreview = !this.tilePreview
  }

  createWorkspaceWindow(){
    //console.log(this.ui)
    flux.createWindow("WORKSPACE", "Workspace", 200, 60, 600, 620)
    var container = document.getElementById("WORKSPACECONTENT")
    var canvas = document.createElement("canvas")
    container.classList.add("flux-windowchequered")
    canvas.id = "DRAWINGCANVAS"
    canvas.classList.add("drawingcanvas")
    container.appendChild(canvas)
    //this.drawingCanvas.useExistingCanvasObject("DRAWINGCANVAS")
    
  } 
  
  createColourPalletWindow(){
    flux.createWindow("COLOURPALLET", "Colour Pallet", 900, 550, 190, 280)
    var container = document.getElementById("COLOURPALLETCONTENT")
    container.innerHTML = colourPalletContent
    this.loadColourPallet("defaultColourPallet")
  }
  
  createToolbarWindow(){
    flux.createWindow("TOOLBAR", "Toolbar", 30, 60, 142, 600)
    flux.appendToolButton("TOOLBAR", "SELECTION", "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/selecttoolicon.png?v=1646391778516")
    flux.appendToolButton("TOOLBAR", "MOVE", "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/movetoolicon.png?v=1646496270969")
    flux.appendToolButton("TOOLBAR", "PENCIL", "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/penciltoolicon.png?v=1646392340306")
    flux.appendToolButton("TOOLBAR", "ERASER", "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/erasertoolicon.png?v=1645743677058")
    flux.appendToolButton("TOOLBAR", "BRUSH", "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/paintbrushicon.png?v=1646392897161")
    flux.appendToolButton("TOOLBAR", "FLOODFILL", "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/bucketfillicon.png?v=1645814640874")
    flux.appendToolButton("TOOLBAR", "SPRAYCAN", "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/spraycanicon.png?v=1646398846481")
    flux.appendToolButton("TOOLBAR", "STRAIGHTLINE", "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/straightlinetoolicon.png?v=1645818533383")
    flux.appendToolButton("TOOLBAR", "DARKENLIGHTEN", "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/lightendarkentoolicon.png?v=1645821671328")
    flux.appendToolButton("TOOLBAR", "BLEND", "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/blendtoolicon.png?v=1646516715472")
    flux.appendToolButton("TOOLBAR", "SQUARE", "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/squaretoolicon.png?v=1646253553688")
    flux.appendToolButton("TOOLBAR", "FILLEDSQUARE", "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/filledsquaretoolicon.png?v=1646324220032")
    flux.appendToolButton("TOOLBAR", "ELLIPSE", "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/ellipsetoolicon.png?v=1646322566795")
    flux.appendToolButton("TOOLBAR", "FILLEDELLIPSE", "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/filledellipsetoolicon.png?v=1646324257923")
  }
  
  createPreviewWindow(){
    flux.createWindow("PREVIEW", "Preview", 900, 60, 180, 200)
    var container = document.getElementById("PREVIEWCONTENT")
    var canvas = document.createElement("canvas")
    container.classList.add("flux-windowchequered")
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.id = "PREVIEWCANVAS"
    container.appendChild(canvas)
  }
  
  createAnimationPreviewWindow(){
    flux.createWindow("ANIMATIONPREVIEW", "Animation Preview", 1082, 60, 180, 200)
    var container = document.getElementById("ANIMATIONPREVIEWCONTENT")
    var canvas = document.createElement("canvas")
    container.classList.add("flux-windowchequered")
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.id = "ANIMATIONPREVIEWCANVAS"
    container.appendChild(canvas)
  }
  
  createAnimationToolsWindow(){
    flux.createWindow("ANIMATIONTOOLS", "Frame Navigation", 1082, 262, 180, 200)
    var container = document.getElementById("ANIMATIONTOOLSCONTENT")
    
    
    // First Frame BUTTON
    var first = document.createElement("div")
    first.classList.add("layercontrolbutton")      
    first.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/firstframeicon.png?v=1647179461456)"
    first.onclick = (event)=>{
      pixelFlux.sprite.setCurrentFrame(0)
      pixelFlux.sprite.updateCanvasChain()
      pixelFlux.updateCanvasAndPreview()
    }
    container.appendChild(first)
    //--------------------------------------------------------------------
   
    // prev Frame BUTTON
    var prev = document.createElement("div")
    prev.classList.add("layercontrolbutton")      
    prev.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/previousframeicon.png?v=1647179490247)"
    prev.onclick = (event)=>{
      pixelFlux.sprite.selectPreviousFrame()
      pixelFlux.sprite.updateCanvasChain()
      pixelFlux.updateCanvasAndPreview()
    }
    container.appendChild(prev)
    //--------------------------------------------------------------------
   
    // START ANIMATION BUTTON
    var play = document.createElement("div")
    play.classList.add("layercontrolbutton")      
    play.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/startanimationicon.png?v=1647180125381)"
    play.onclick = (event)=>{
      pixelFlux.animating = true
      pixelFlux.sprite.updateCanvasChain()
      pixelFlux.renderAnimationPreview()
    }
    container.appendChild(play)
    //--------------------------------------------------------------------
   
    // STOP ANIMATION BUTTON
    var stop = document.createElement("div")
    stop.classList.add("layercontrolbutton")      
    stop.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/stopanimationicon.png?v=1647180069037)"
    stop.onclick = (event)=>{
      pixelFlux.animating = true
      pixelFlux.sprite.updateCanvasChain()
      pixelFlux.renderAnimationPreview()
    }
    container.appendChild(stop)
    //--------------------------------------------------------------------
   
    var currentframe = document.createElement("div")
    currentframe.classList.add("currentframenumber")
    currentframe.id = "CURRENTFRAMENUMBER"
    container.appendChild(currentframe)
    
    
    // next Frame BUTTON
    var next = document.createElement("div")
    next.classList.add("layercontrolbutton")      
    next.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/nextframeicon.png?v=1647179625045)"
    next.onclick = (event)=>{
      pixelFlux.sprite.selectNextFrame()
      pixelFlux.sprite.updateCanvasChain()
      pixelFlux.updateCanvasAndPreview()
    }
    container.appendChild(next)
    //--------------------------------------------------------------------
   
    // last Frame BUTTON
    var last = document.createElement("div")
    last.classList.add("layercontrolbutton")      
    last.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/lastframeicon.png?v=1647179603117)"
    last.onclick = (event)=>{
      pixelFlux.sprite.setCurrentFrame(pixelFlux.sprite.frames.length-1)
      pixelFlux.sprite.updateCanvasChain()
      pixelFlux.updateCanvasAndPreview()
    }
    container.appendChild(last)
    //--------------------------------------------------------------------
   
    
  }
  
  createToolOptionsWindow(){
    flux.createWindow("TOOLOPTIONS", "Tool Options", 900, 270, 180, 260)
  }
  
  
  createDebugWindow(){
    flux.createWindow("DEBUG","Debug Info", 200, 700, 500, 120)
    var container = document.getElementById("DEBUGCONTENT")
    var div = document.createElement("div")  
    div.classList.add("flux-debuginfo")
    div.id = "FLUXDEBUGINFO"
    div.style.width = "100%"
    div.style.height = "100%"
    container.appendChild(div)
    
  }
  
  
  createOpenGallery(){
    flux.createWindow("OPENGALLERY", "Your Saved Images", 200, 200, 800, 600)
  }
  
  createLayersWindow(){
    flux.createWindow("LAYERS", "Layers", 800, 400, 200, 400)
  }
  
  createFramesWindow(){
    flux.createWindow("FRAMES", "Frames", 800, 400, 200, 400)
  }
  
  createPixelBrushWindow(){
    flux.createWindow("PIXELBRUSH", "Pixel Brush",510,700,400,120)
  }

  objectClicked(id){
    switch (id) {
      case "ADDPRIMARYCOLOUR":
        this.addColourToPallet(document.getElementById("PRIMARYCOLOURPICKER").value)
        break
      case "ADDSECONDARYCOLOUR":
        this.addColourToPallet(document.getElementById("SECONDARYCOLOURPICKER").value)
        break
      
    }
  }
  
  addColourToPallet(colour){
    var container = document.getElementById("COLOURPALLETSTORE")
    var colourPreview = document.createElement("div")
    colourPreview.classList.add("flux-palletcolour")
    colourPreview.style.backgroundColor = colour
    colourPreview.onclick = (event)=>{
      var newColourRGB = event.srcElement.style.backgroundColor
      console.log(newColourRGB)
      
      if(event.shiftKey){
        colourPreview.remove()
      } else {
        if(event.button == 0){
          document.getElementById("PRIMARYCOLOURPICKER").value = rgb2hex(event.srcElement.style.backgroundColor)
        } 
      }
    }
    colourPreview.oncontextmenu = (event)=>{
      var newColourRGB = event.srcElement.style.backgroundColor
      console.log(newColourRGB)

      document.getElementById("SECONDARYCOLOURPICKER").value = rgb2hex(event.srcElement.style.backgroundColor)
    }
    container.appendChild(colourPreview)
    this.saveColourPallet()
  }
  

  saveColourPaletteAs(){
    console.log("Saving Colour Palette")
    flux.showModalQuestionWindow("Please enter a name for your Palette...", "", "Save", "cancel", (response)=>{
      if(response){
        this.saveColourPallet(response)
      }
    })
  }
  
  saveColourPallet(name){
    if(!name) name = "defaultColourPallet"
    var palette = {
      type: "palette"
    }
    palette.colours = []
    
    var elements = document.querySelectorAll(".flux-palletcolour")
    for(var i = 0; i<elements.length; i++){
      var col = elements[i].style.backgroundColor
      palette.colours.push(col)
    }
    localStorage.setItem(name, JSON.stringify(palette))
  }
  
  loadColourPallet(palletName){
    if(localStorage.getItem(palletName)){
      var colours = JSON.parse(localStorage.getItem(palletName)).colours
      this.loadColours(colours)
    }
  }
  
  loadColours(colours){
    if(colours === undefined) return false
    for(var i=0; i<colours.length; i++){
      this.addColourToPallet(colours[i])
    }
    
  }
  
  reduceColourPalette(threshold){
    var colours = []
    var elements = document.querySelectorAll(".flux-palletcolour")
    for(var i = 0; i<elements.length; i++){
      let colour = elements[i].style.backgroundColor
      let rgb = rgb2intArray(colour)
      let include = true

      colours.forEach(c => {
        let r1=c[0], g1=c[1], b1=c[2]
        let r2=rgb[0], g2=rgb[1], b2=rgb[2]

        if(
          r1-r2 < threshold && r1-r2 > -threshold &&
          g1-g2 < threshold && g1-g2 > -threshold &&
          b1-b2 < threshold && b1-b2 > -threshold 
          ){
            include = false
          }

      })
      
      if (include) colours.push(rgb)
    }

    colours.sort()

    this.clearColourPallet()

    colours.forEach(c => {
      let r = parseInt(c[0], 10).toString(16).padStart(2, "0")
      let g = parseInt(c[1], 10).toString(16).padStart(2, "0")
      let b = parseInt(c[2], 10).toString(16).padStart(2, "0")
      let hex = `#${r}${g}${b}`
      console.log(hex)
      this.addColourToPallet(hex)
    })
  }

  createPaletteFromCurrentLayer(){
    var colours = new Set()
    this.sprite.getCurrentFrame().getCurrentLayer().pixels.forEach(pixel => {
      colours.add(pixel.getHTMLHex())
    })
    //console.log(colours)
    colours.forEach(colour => {
      this.addColourToPallet(colour)
    })
  }

  clearColourPallet(){
    document.getElementById("COLOURPALLETSTORE").innerHTML = ""
  }
  
  selectSavedPalette(){
    flux.showModalSelectionWindow("Please select your Palette to load...", this.getSavedPaletteList(), "Load", "cancel", (response)=>{
      if(response){
        this.clearColourPallet()
        this.loadColourPallet(response)
      }
    })
  }

  getSavedPaletteList(){
    let palettes = new Array()
    console.log(localStorage.length)
    for(let i = 0; i < localStorage.length; i++){
      
      let key = localStorage.key(i)             // Get key as localStorage index key
      let o = JSON.parse(localStorage.getItem(key))  // Get o as the object in storage
      if(o.type == "palette" && 
        key != "defaultColourPallet"){         // defaultColourPallet is used for colour persistence between sessions
        palettes.push(key)                      // add palette name to the return array
      }
    }
    return palettes                             // return an array of palette names
  }


  exportCurrentPalette(){

    console.log("Exporting Current Palette")
    flux.showModalQuestionWindow("Please enter a name for your Palette...", "", "Export", "cancel", (response)=>{
      if(response){
        var palette = {
          type: "palette"
        }
        palette.colours = []
        
        var elements = document.querySelectorAll(".flux-palletcolour")
        for(var i = 0; i<elements.length; i++){
          var col = elements[i].style.backgroundColor
          palette.colours.push(col)
        }

        var url = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(palette));
        
        if(response.length == 0)
          download(url, "pixelFlux-download.palette")
        else
          download(url, response + ".palette")
      }
      
    })

  }


  loadUserPreferences(){
    return new Promise ((resolve, reject)=>{
      get("/user-preferences")
      .then(result=>{
        let prefs = JSON.parse(result)
        this.preferences = prefs
        resolve(prefs)
      })
      .catch(error=>{
        reject(error)
      })
    })
  }


  importPaletteFile(){



  }

  refresh(){
    this.updateCanvasAndPreview(true)
  }

  updateCanvasAndPreview(fullUpdate){
    
    var now = Date.now()
    if(now - this.lastUpdate > 100)
      fullUpdate = true
    
    debug.counter++
    
    var scale = this.drawingScale
    var drawingCanvas = document.getElementById("DRAWINGCANVAS")
    var previewCanvas = document.getElementById("PREVIEWCANVAS")
    
    drawingCanvas.width = drawingCanvas.clientWidth
    drawingCanvas.height = drawingCanvas.clientHeight
    previewCanvas.width = previewCanvas.clientWidth
    previewCanvas.height = previewCanvas.clientHeight
    
    
    var ctx = drawingCanvas.getContext("2d")
    ctx.imageSmoothingEnabled = false;
    var pctx = previewCanvas.getContext("2d")
    pctx.imageSmoothingEnabled = false;
    
    var canvasWidth = drawingCanvas.clientWidth
    var canvasHeight = drawingCanvas.clientHeight - 20  
    var imageOriginX = (canvasWidth/2) - ((this.sprite.width/2) * scale)
    var imageOriginY = (canvasHeight/2) - ((this.sprite.height/2) * scale)
    ctx.clearRect(0, 0, this.width, this.height)
    ctx.drawImage(this.sprite.canvas, 0, 0, this.sprite.width, this.sprite.height, imageOriginX, imageOriginY, this.sprite.width * scale, this.sprite.height * scale)
    ctx.beginPath()
    ctx.rect(imageOriginX-1, imageOriginY-1, (this.sprite.width * scale)+2, (this.sprite.height * scale)+2)
    ctx.stroke()
    
    if(this.tilePreview){

      scale = this.previewScale
      canvasWidth = previewCanvas.clientWidth
      canvasHeight = previewCanvas.clientHeight - 20  
      imageOriginX = (canvasWidth/2) - ((this.sprite.width/2) * scale)
      imageOriginY = (canvasHeight/2) - ((this.sprite.height/2) * scale)

      var pattern = pctx.createPattern(this.sprite.canvas, "repeat")

      pctx.clearRect(0, 0, this.width, this.height)
      pctx.scale(scale,scale)
      pctx.fillStyle = pattern
      pctx.fillRect(0,0,canvasWidth / scale, canvasHeight / scale)
      pctx.scale(1,1) // restore the scale to original value for when tile preview is turned off

    } else {
      scale = this.previewScale
      canvasWidth = previewCanvas.clientWidth
      canvasHeight = previewCanvas.clientHeight - 20  
      imageOriginX = (canvasWidth/2) - ((this.sprite.width/2) * scale)
      imageOriginY = (canvasHeight/2) - ((this.sprite.height/2) * scale)
      pctx.clearRect(0, 0, this.width, this.height)
      pctx.drawImage(this.sprite.canvas, 0, 0, this.sprite.width, this.sprite.height, imageOriginX, imageOriginY, this.sprite.width * scale, this.sprite.height * scale)
      pctx.beginPath()
      pctx.rect(imageOriginX-1, imageOriginY-1, (this.sprite.width * scale)+2, (this.sprite.height * scale)+2)
      pctx.stroke()
    }

    if(fullUpdate){
      this.renderLayersWindow()
      this.updateFrameNumberDisplay()
      this.renderFramesWindow() 
    }
    
    
    this.lastUpdate = Date.now()
  }
  
  renderAnimationPreview(){
    
    var scale = pixelFlux.animationPreviewScale
    var previewCanvas = document.getElementById("ANIMATIONPREVIEWCANVAS")
    
    previewCanvas.width = previewCanvas.clientWidth
    previewCanvas.height = previewCanvas.clientHeight
    
    var pctx = previewCanvas.getContext("2d")
    pctx.imageSmoothingEnabled = false;
    
    var canvasWidth = previewCanvas.clientWidth
    var canvasHeight = previewCanvas.clientHeight - 20  
    var imageOriginX = (canvasWidth/2) - ((pixelFlux.sprite.width/2) * scale)
    var imageOriginY = (canvasHeight/2) - ((pixelFlux.sprite.height/2) * scale)
    pctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height)
    pixelFlux.sprite.drawAnimationToCanvasId("ANIMATIONPREVIEWCANVAS", imageOriginX, imageOriginY, scale)
    //pctx.drawImage(this.sprite.canvas, 0, 0, this.sprite.width, this.sprite.height, imageOriginX, imageOriginY, this.sprite.width * scale, this.sprite.height * scale)
    pctx.beginPath()
    pctx.rect(imageOriginX-1, imageOriginY-1, (pixelFlux.sprite.width * scale)+2, (pixelFlux.sprite.height * scale)+2)
    pctx.stroke()
    
    if(pixelFlux.animating)
      setTimeout(pixelFlux.renderAnimationPreview, 1000/pixelFlux.fps)
  }
  
  
  updateFrameNumberDisplay(){
    document.getElementById("CURRENTFRAMENUMBER").innerHTML = (this.sprite.currentFrame+1)  + " / " + this.sprite.frames.length
  }
  
  
  renderLayersWindow(){
    var container = document.getElementById("LAYERSCONTENT")
    container.innerHTML = ""
    var frame = this.sprite.getCurrentFrame()
    var layerCount = frame.layers.length
    var current = frame.currentLayer
    
    for(var i = layerCount - 1; i>-1; i--){
      
      var layercontainer = document.createElement("div")
      layercontainer.classList.add("layercontainer")
      if(i == current)
        layercontainer.classList.add("currentlayercontainer")
      var canvas = document.createElement("canvas")
      canvas.classList.add("layerwindowcanvas")
      canvas.width = 32
      canvas.height = 32
      canvas.style.zIndex = i
      canvas.onclick = (event)=>{
        this.sprite.setCurrentLayer(event.srcElement.style.zIndex)
        pixelFlux.renderLayersWindow()
      }
      var context = canvas.getContext("2d")
      context.drawImage(frame.layers[i].canvas, 0, 0, frame.width, frame.height, 0, 0, canvas.width, canvas.height)
      
      var layerinfo = document.createElement("div")
      layerinfo.classList.add("layerinfo")
      var layername = document.createElement("div")
      layername.innerText = frame.layers[i].name
      layername.classList.add("layername")
      var editlayername = document.createElement("div")
      editlayername.classList.add("editlayername")
      editlayername.zIndex = i
      editlayername.onclick = (event)=>{
        var id = event.srcElement.zIndex
        var frame = pixelFlux.sprite.getCurrentFrame()
        flux.showModalQuestionWindow("Edit Layer Name:", frame.layers[id].name, "Save", "Cancel",(response)=>{
          if(response){
            if(this.preferences.preserveLayerContinuity){
              this.sprite.setLayerNameAllFrames(id,response)
            } else {
              frame.layers[id].name = response
            
            }
            pixelFlux.renderLayersWindow()
            pixelFlux.sprite.pushToUndoHistory()
          }
        })
      }
      
      var layercontrols = document.createElement("div")
      layercontrols.classList.add("layercontrols")
      
      // LAYER VISIBLE TOGGLE BUTTON
      var layervisible = document.createElement("div")
      layervisible.classList.add("layercontrolbutton")
      if(frame.layers[i].visible)
        layervisible.classList.add("buttonfeatureenabled")
      else
        layervisible.classList.add("buttonfeaturedisabled")
      layervisible.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/showhideicon.png?v=1646784195468)"
      layervisible.zIndex = i
      layervisible.onclick = (event)=>{
        var id = event.srcElement.zIndex
        var frame = pixelFlux.sprite.getCurrentFrame()
        var visible = frame.layers[id].visible
        if(visible){
          if(this.preferences.preserveLayerContinuity){
            this.sprite.setLayerVisible(id,false)
          } else {
            frame.layers[id].hide()
          }
          event.srcElement.classList.add("buttonfeatureenabled")
          pixelFlux.updateCanvasAndPreview()
          pixelFlux.sprite.pushToUndoHistory()

        } else {
          if(this.preferences.preserveLayerContinuity){
            this.sprite.setLayerVisible(id,true)
          } else {
            frame.layers[id].show()
          }
          event.srcElement.classList.add("buttonfeaturedisabled")
          pixelFlux.sprite.pushToUndoHistory()
        }
        pixelFlux.sprite.updateCanvasChain()
        pixelFlux.updateCanvasAndPreview()
      }
      layercontrols.appendChild(layervisible)
      //--------------------------------------------------------------------
      
      
      
      // LAYER LOCK TOGGLE BUTTON
      var layerlock = document.createElement("div")
      layerlock.classList.add("layercontrolbutton")
      if(frame.layers[i].locked)
        layerlock.classList.add("buttonfeatureenabled")
      else
        layerlock.classList.add("buttonfeaturedisabled")
      layerlock.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/padlockicon.png?v=1646784233109)"
      layerlock.zIndex = i
      layerlock.onclick = (event)=>{
        var id = event.srcElement.zIndex
        var frame = pixelFlux.sprite.getCurrentFrame()
        var locked = frame.layers[id].locked
        if(locked){
          this.sprite.unlockLayer(id)
          event.srcElement.classList.add("buttonfeaturedisabled")
          pixelFlux.updateCanvasAndPreview()
          pixelFlux.sprite.pushToUndoHistory()
        } else {
          this.sprite.lockLayer(id)
          event.srcElement.classList.add("buttonfeatureenabled")
          pixelFlux.sprite.pushToUndoHistory()
        }
        pixelFlux.sprite.updateCanvasChain()
        pixelFlux.updateCanvasAndPreview()
      }
      layercontrols.appendChild(layerlock)
      //--------------------------------------------------------------------
      
      
      
      // LAYER CLEAR BUTTON
      var layerclear = document.createElement("div")
      layerclear.classList.add("layercontrolbutton")
      
      layerclear.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/deletelayericon.png?v=1646947314267)"
      layerclear.zIndex = i
      layerclear.onclick = (event)=>{
        var id = event.srcElement.zIndex
        var frame = pixelFlux.sprite.getCurrentFrame()
        frame.layers[id].clear() 
        pixelFlux.sprite.updateCanvasChain()
        pixelFlux.updateCanvasAndPreview()
        pixelFlux.sprite.pushToUndoHistory()
      }
      layercontrols.appendChild(layerclear)
      //--------------------------------------------------------------------
      
      
      
      // LAYER MERGEDOWN BUTTON
      var mergedown = document.createElement("div")
      mergedown.classList.add("layercontrolbutton")
      
      mergedown.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/mergedownicon.png?v=1647007923119)"
      mergedown.zIndex = i
      if(i>0){
        mergedown.onclick = (event)=>{
          var id = event.srcElement.zIndex
          pixelFlux.sprite.mergeLayerDown(id)
          pixelFlux.sprite.updateCanvasChain()
          pixelFlux.updateCanvasAndPreview()
          pixelFlux.sprite.pushToUndoHistory()
        }
      } else {
        mergedown.style.opacity = "30%"
      }
      layercontrols.appendChild(mergedown)
      //--------------------------------------------------------------------
      
      
      
      // LAYER MOVE DOWN BUTTON
      var movedown = document.createElement("div")
      movedown.classList.add("layercontrolbutton")
      
      movedown.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/downarrow16.png?v=1647007664201)"
      movedown.style.zIndex = i
      if(i>0){
        movedown.onclick = (event)=>{
          var id = event.srcElement.style.zIndex
          var frame = pixelFlux.sprite.getCurrentFrame()
          sprite.moveLayerDown(~~id)
          pixelFlux.sprite.updateCanvasChain()
          pixelFlux.updateCanvasAndPreview()
          pixelFlux.sprite.pushToUndoHistory()
        }
      } else {
        movedown.style.opacity = "30%"
      }
      layercontrols.appendChild(movedown)
      //--------------------------------------------------------------------
      
      
      
      // LAYER MOVE UP BUTTON
      var moveup = document.createElement("div")
      moveup.classList.add("layercontrolbutton")
      
      moveup.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/uparrow16.png?v=1647007752734)"
      moveup.style.zIndex = i
      if(i<frame.layers.length - 1){
        moveup.onclick = (event)=>{
          var id = event.srcElement.style.zIndex
          var frame = pixelFlux.sprite.getCurrentFrame()
          sprite.moveLayerUp(~~id)
          pixelFlux.sprite.updateCanvasChain()
          pixelFlux.updateCanvasAndPreview()
          pixelFlux.sprite.pushToUndoHistory()
          pixelFlux.renderLayersWindow()
        }
      } else {
        moveup.style.opacity = "30%"
      }
      layercontrols.appendChild(moveup)
      //--------------------------------------------------------------------
      
      
      
      // LAYER DELETE BUTTON
      var layerdelete = document.createElement("div")
      layerdelete.classList.add("layercontrolbutton")
      
      layerdelete.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/deleteicon.png?v=1646784217658)"
      layerdelete.style.zIndex = i
      layerdelete.onclick = (event)=>{
        console.log(event)
        var id = event.srcElement.style.zIndex
        var frame = pixelFlux.sprite.getCurrentFrame()
        sprite.deleteLayer(~~id)
        pixelFlux.sprite.updateCanvasChain()
        pixelFlux.updateCanvasAndPreview()
        pixelFlux.renderFramesWindow()
        pixelFlux.sprite.pushToUndoHistory()
      }
      layercontrols.appendChild(layerdelete)
      //--------------------------------------------------------------------
      
      
      
      // LAYER SETTINGS BUTTON
      var layersettings = document.createElement("div")
      layersettings.classList.add("layercontrolbutton")
      
      layersettings.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/settingsicon.png?v=1647010901037)"
      layersettings.zIndex = i
      layersettings.onclick = (event)=>{
        var id = event.srcElement.zIndex
        var frame = pixelFlux.sprite.getCurrentFrame()
        pixelFlux.showLayerSettings(id)
      }
      // Commenting out the addition of the layer settings icon so that it can be re-added in a future version when implemented.
      //layercontrols.appendChild(layersettings)
      //--------------------------------------------------------------------
      
      
      
      layerinfo.appendChild(layername)
      layerinfo.appendChild(editlayername)
      layerinfo.appendChild(layercontrols)
      layercontainer.appendChild(canvas)
      layercontainer.appendChild(layerinfo)
      container.appendChild(layercontainer)
    
    }
  }
  
  
  
  renderFramesWindow(){
    
    var container = document.getElementById("FRAMESCONTENT")
    container.style.height = "100%"
    container.innerHTML = ""
    container.style.overflowY = "scroll"
    var frameNumber = 0
    var count = this.sprite.frames.length
    
    this.sprite.frames.forEach((frame)=>{
      
      var i = frameNumber
      
      var framesideleft = new Image()
      var framesideright = new Image()
      framesideleft.src = "https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/moviesides.png?v=1647184665621"
      framesideright.src = "https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/moviesides.png?v=1647184665621"
      framesideleft.classList.add("frameside")
      framesideright.classList.add("frameside")

      
      var framecontainer = document.createElement("div")
      framecontainer.classList.add("framecontainer")
      if(i == this.sprite.currentFrame)
        framecontainer.classList.add("framecontainercurrent")
      var canvas = document.createElement("canvas")
      canvas.classList.add("framepreview")
      canvas.width = 32
      canvas.height = 32
      canvas.style.zIndex = frameNumber
      var ctx = canvas.getContext("2d")
      ctx.drawImage(frame.canvas, 0, 0, frame.width, frame.height, 0, 0, canvas.width, canvas.height)
      canvas.onclick = (event)=>{
        var id = ~~event.srcElement.style.zIndex
        pixelFlux.sprite.setCurrentFrame(id)
        pixelFlux.sprite.updateCanvasChain()
        pixelFlux.updateCanvasAndPreview()
      }
      
      
      
      var frametools = document.createElement("div")
      frametools.classList.add("frametools")
      
      // FRAME MOVE DOWN BUTTON ---------------------------------------------
      var movedown = document.createElement("div")
      movedown.classList.add("layercontrolbutton")      
      movedown.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/downarrow16.png?v=1647007664201)"
      movedown.zIndex = i
      if(i<count-1){
        movedown.onclick = (event)=>{
          var id = event.srcElement.zIndex
          pixelFlux.sprite.moveFrameForward(id)
          pixelFlux.sprite.updateCanvasChain()
          pixelFlux.updateCanvasAndPreview()
          pixelFlux.sprite.pushToUndoHistory()
        }
      } else {
        movedown.style.opacity = "30%"
      }
      frametools.appendChild(movedown)
      //--------------------------------------------------------------------
      
      // FRAME MOVE UP BUTTON
      var moveup = document.createElement("div")
      moveup.classList.add("layercontrolbutton")
      
      moveup.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/uparrow16.png?v=1647007752734)"
      moveup.zIndex = i
      if(i>0){
        moveup.onclick = (event)=>{
          var id = event.srcElement.zIndex
          pixelFlux.sprite.moveFrameBackward(id)
          pixelFlux.sprite.updateCanvasChain()
          pixelFlux.updateCanvasAndPreview()
          pixelFlux.sprite.pushToUndoHistory()
        }
      } else {
        moveup.style.opacity = "30%"
      }
      frametools.appendChild(moveup)
      //--------------------------------------------------------------------
      
      
      // FRAME COPY BUTTON
      var copy = document.createElement("div")
      copy.classList.add("layercontrolbutton")
      
      copy.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/copyframeicon.png?v=1647521632318)"
      copy.zIndex = i
      
      copy.onclick = (event)=>{
        var id = event.srcElement.zIndex
        pixelFlux.sprite.copyFrame(id)
        pixelFlux.sprite.updateCanvasChain()
        pixelFlux.updateCanvasAndPreview()
        pixelFlux.sprite.pushToUndoHistory()
      }
      frametools.appendChild(copy)
      //--------------------------------------------------------------------
      
      
      // FRAME INSERT BUTTON
      var insert = document.createElement("div")
      insert.classList.add("layercontrolbutton")
      
      insert.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/insertframeicon.png?v=1647179887195)"
      insert.zIndex = i
      
      insert.onclick = (event)=>{
        var id = event.srcElement.zIndex
        pixelFlux.sprite.insertFrameAfter(id)
        pixelFlux.sprite.updateCanvasChain()
        pixelFlux.updateCanvasAndPreview()
        pixelFlux.sprite.pushToUndoHistory()
      }
      frametools.appendChild(insert)
      //--------------------------------------------------------------------
      
      
      // FRAME DELETE BUTTON
      var deleteframe = document.createElement("div")
      deleteframe.classList.add("layercontrolbutton")
      
      deleteframe.style.backgroundImage = "url(https://cdn.glitch.global/0ea8c714-b2da-476b-bcef-3909d11dea2b/deleteicon.png?v=1646784217658)"
      deleteframe.zIndex = i
      if(this.sprite.frames.length > 1){
        deleteframe.onclick = (event)=>{
          var id = event.srcElement.zIndex
          pixelFlux.sprite.deleteFrame(id)
          pixelFlux.sprite.updateCanvasChain()
          pixelFlux.updateCanvasAndPreview()
          pixelFlux.sprite.pushToUndoHistory()
        }
      } else {
        deleteframe.style.opacity = "30%"                  
      }
      frametools.appendChild(deleteframe)
      //--------------------------------------------------------------------
      
      
      framecontainer.appendChild(framesideleft)
      framecontainer.appendChild(canvas)
      framecontainer.appendChild(framesideright)
      framecontainer.appendChild(frametools)
      
      container.appendChild(framecontainer)
      frameNumber++
    })

  }
  
  
  
  toolDown(x,y, button){
    if(this.currentTool.enabled){
      if(x<0 || y<0 ||
         x>this.sprite.width-1||
         y>this.sprite.height-1) return
      this.sprite.pushToUndoHistory()
      this.currentTool.alpha = document.getElementById("COLOUROPACITY").value
      var priColour = document.getElementById("PRIMARYCOLOURPICKER").value
      var secColour = document.getElementById("SECONDARYCOLOURPICKER").value
      this.currentTool.down(x,y, priColour, secColour, button)
      this.updateCanvasAndPreview()
    }
  }
  toolUp(x,y, button){
    if(this.currentTool.enabled){
      var priColour = document.getElementById("PRIMARYCOLOURPICKER").value
      var secColour = document.getElementById("SECONDARYCOLOURPICKER").value
      this.currentTool.up(x,y, priColour, secColour, button)
      this.updateCanvasAndPreview()
      
    }
  }
  toolDrag(x1, y1, x2, y2, button){
    if(this.currentTool.enabled){
      if(x1<0 || y1<0 || x2<0 || y2<0 || 
         x1>this.sprite.width-1 ||
         x2>this.sprite.width-1 ||
         y1>this.sprite.height-1||
         y2>this.sprite.height-1) return
      var priColour = document.getElementById("PRIMARYCOLOURPICKER").value
      var secColour = document.getElementById("SECONDARYCOLOURPICKER").value
      this.currentTool.drag(x1, y1, x2, y2, priColour, secColour, button) 
      this.updateCanvasAndPreview()
    }
  }
  
  
  inSelection(x,y){
    if(this.currentSelection.enabled){
      if(x < this.currentSelection.x1 || x > this.currentSelection.x2) return false
      if(y < this.currentSelection.y1 || y > this.currentSelection.y2) return false     
    }
    return true
  }
  
  createNewSprite(x,y){
    flux.showModalMessageBox("Create a New Sprite?",
                             "Your current image will be lost.  Are you sure you want to proceed?",
                            (result)=>{
      if(result) this.sprite = new Sprite(x,y)
    })
    
  }
  
  setSpriteName(){
    return new Promise((resolve, reject)=>{
      flux.showModalQuestionWindow("Please enter a name for your Sprite...", this.sprite.name, "Save", "cancel", (response)=>{
        if(response){
          this.sprite.name = response
          resolve(true)
        }
      })
    })
    
  }
  
  saveSprite(){
    flux.showModalQuestionWindow("Please enter a name for your Sprite...", this.sprite.name, "Save", "cancel", (response)=>{
      if(response){
        var spriteData = new Sprite()
        spriteData.loadFromSprite(this.sprite)
        spriteData.name = response
        this.sprite.name = response
        var save = {
          isSprite: true,
          name: response,
          spriteData: spriteData
        }
        localStorage.setItem(response, JSON.stringify(save))
      }
    })
  }
  
  
  saveSpriteOnline(){
    flux.showModalQuestionWindow("Please enter a name for your Sprite...", this.sprite.name, "Save", "cancel", (response)=>{
      if(response){
        var spriteData = new Sprite()
        spriteData.loadFromSprite(this.sprite)
        spriteData.name = response
        var save = {
          isSprite: true,
          name: response,
          spriteData: spriteData
        }
        //var postData = JSON.stringify(save)
        post("/save", save)
      }
    })
  }
  
  
  
  
  loadFromServer(name){
    get("/data/"+ name).then((r)=>{
      var res = JSON.parse(r)
      pixelFlux.sprite.loadFromSprite(res.spriteData)
      pixelFlux.updateCanvasAndPreview()
    }).catch((e)=>{
      console.log(e)
    })
  }
  
  
  
  showLoadGallery(){
    
    var container = document.getElementById("OPENGALLERYCONTENT")
    container.innerHTML = ""
    let spanBrowserStore = document.createElement("h3")
    spanBrowserStore.classList.add("load-screen-title")
    spanBrowserStore.innerHTML += "Local Browser Storage"
    container.appendChild(spanBrowserStore)
    var count = localStorage.length
    for (var i = 0; i < count; i++){
      var key = localStorage.key(i)
      var item = JSON.parse(localStorage.getItem(key))
      if(item.isSprite){
        var s = new Sprite(64,64)
        s.loadFromSprite(item.spriteData)
        var div = document.createElement("div")
        div.classList.add("gallerydiv")
        var canvas = document.createElement("canvas")
        canvas.width = 64
        canvas.height = 64
        canvas.classList.add("gallerycanvas")
        canvas.id = key
        //var ctx = canvas.getContext2d()

        var del = document.createElement("div")
        del.classList.add("gallerydelete")
        del.innerHTML = "x"
        
        del.onclick = (event)=>{
          var key = event.srcElement.parentElement.firstChild.id
          localStorage.removeItem(key)
          event.srcElement.parentElement.remove()
          
        }
        
        var pallet = document.createElement("img")
        //TODO: Remove CDN.GLITCH.GLOBAL reference 
        pallet.src = "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/palleticonx16.png?v=1646409849356"
        pallet.classList.add("gallerypalleticon")
        pallet.onclick = (event)=>{
          //var key = event.srcElement.parentElement.firstChild.id
          //var load = JSON.parse(localStorage.getItem(key))
          pixelFlux.importPalletFromSprite(s)
          flux.hideWindow("OPENGALLERY")
        }
        
        var bg = document.createElement("img")
        //TODO: Remove CDN.GLITCH.GLOBAL reference 
        bg.src = "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/bgicon.png?v=1646438995826"
        bg.classList.add("gallerybgicon")
        bg.onclick = (event)=>{
          var bgurl = s.canvas.toDataURL()
          var ls = document.querySelectorAll(".flux-windowchequered")
          for(var i=0; i<ls.length; i++){
            ls[i].style.backgroundImage = "url(" + bgurl + ")"
          }
          flux.hideWindow("OPENGALLERY")
        }
        
        
        
        
        
        div.appendChild(canvas)
        div.appendChild(del)
        div.appendChild(pallet)
        div.appendChild(bg)
        container.appendChild(div)
        
        canvas.onclick = (event)=>{
          var load = JSON.parse(localStorage.getItem(event.srcElement.id))
          load.spriteData.name = load.name
          pixelFlux.sprite.loadFromSprite(load.spriteData)
          pixelFlux.updateCanvasAndPreview()
          flux.hideWindow("OPENGALLERY")
        }
        s.drawToCanvasId(key, 0,0,64/s.height)
      } 
    
    }

    
    flux.showWindow("OPENGALLERY")
    this.appendServerSpritesToOpenGallery()
  }
  
  
  appendServerSpritesToOpenGallery(){
    get('/mysprites')
    .then((response)=>{
      if(JSON.parse(response).errorCode > 0){
        console.log("Failed to load server side sprite list")
        console.log(response)
        google.accounts.id.prompt()

        return
      }
      //console.log(response)
      var container = document.getElementById("OPENGALLERYCONTENT")
      let spanServerStore = document.createElement("h3")
      spanServerStore.classList.add("load-screen-title")
      spanServerStore.innerHTML += "PixelFlux Server Storage"
      container.appendChild(spanServerStore)
      var spriteList = JSON.parse(response)
      if(spriteList.length > 0){
        spriteList.forEach((entry)=>{
          //console.log(entry)
          let spriteId = entry.id

          get("/load?id=" + spriteId)
          .then(res=>{
            let loadResponse = JSON.parse(res)
            // console.log(loadResponse)
            let item = loadResponse.spriteData
          
            if(item.isSprite){
              var s = new Sprite(64,64)
              s.loadFromSprite(item.spriteData)
              var div = document.createElement("div")
              div.classList.add("gallerydiv")
              var canvas = document.createElement("canvas")
              canvas.width = 64
              canvas.height = 64
              canvas.classList.add("gallerycanvas")
              canvas.id = spriteId
              //var ctx = canvas.getContext2d()
      
              /* var del = document.createElement("div")
              del.classList.add("gallerydelete")
              del.innerHTML = "x"
              
              del.onclick = (event)=>{
                var key = event.srcElement.parentElement.firstChild.id
                localStorage.removeItem(key)
                event.srcElement.parentElement.remove()
                
              } */
              
              var pallet = document.createElement("img")
              //TODO: Remove Glitch CDN reference
              pallet.src = "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/palleticonx16.png?v=1646409849356"
              pallet.classList.add("gallerypalleticon")
              pallet.onclick = (event)=>{
                //var key = event.srcElement.parentElement.firstChild.id
                //var load = item.spriteData
                pixelFlux.importPalletFromSprite(s)
                flux.hideWindow("OPENGALLERY")
              }
              
              var bg = document.createElement("img")
              //TODO: Remove Glitch CDN reference
              bg.src = "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/bgicon.png?v=1646438995826"
              bg.classList.add("gallerybgicon")
              bg.onclick = (event)=>{
                //var key = event.srcElement.parentElement.firstChild.id
                //var load = item.spriteData
                
                var bgurl = s.canvas.toDataURL()
                var ls = document.querySelectorAll(".flux-windowchequered")
                for(var i=0; i<ls.length; i++){
                  ls[i].style.backgroundImage = "url(" + bgurl + ")"
                }
                flux.hideWindow("OPENGALLERY")
              }
              
              
              
              
              
              div.appendChild(canvas)
              div.appendChild(pallet)
              div.appendChild(bg)
              container.appendChild(div)
              
              canvas.onclick = (event)=>{
                var load = item
                load.spriteData.name = load.name
                pixelFlux.sprite.loadFromSprite(load.spriteData)
                pixelFlux.updateCanvasAndPreview()
                flux.hideWindow("OPENGALLERY")
              }
              s.drawToCanvasId(spriteId, 0,0,64/s.height)
            }
            

          })
        


        })
      }
    })

  }


  
  // importPalletFromPixelArray(pa){
  //   //pa = JSON.parse(pa)
  //   var added = new Array()
  //   document.getElementById("COLOURPALLETSTORE").innerHTML = ""
  //   for(var i = 0; i< pa.length; i++){
  //     var colour = "rgb(" + pa[i][0] + "," + pa[i][1] + "," + pa[i][2] + ")"
  //     if(!added.includes(colour)){
  //       this.addColourToPallet(colour)
  //       added.push(colour)
  //     }
  //   }
  // }
  
  
  importPalletFromSprite(s){
    var added = new Array()
    document.getElementById("COLOURPALLETSTORE").innerHTML = ""
    s.frames.forEach(f=>{
      f.layers.forEach(l=>{
        l.pixels.forEach(p=>{
          var colour = "rgb(" + p.red + "," + p.green + "," + p.blue + ")"
          if(!added.includes(colour)){
            this.addColourToPallet(colour)
            added.push(colour)
          }
        })
      })
    })
  }


  setBackgroundColour(){
    var priColour = document.getElementById("PRIMARYCOLOURPICKER").value
    var elements = document.getElementsByClassName('flux-windowchequered');

    for(var i = 0; i < elements.length; i++) {
      elements[i].style.backgroundColor = priColour;
    }
  }
  
}




