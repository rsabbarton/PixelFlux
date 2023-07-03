let DEVPREVIEW = false
if(window.location.href.includes('app-dev')) {
  DEVPREVIEW = true
}

  
showLoadingAnimation()

const flux = new FluxUI()
const pixelFlux = new PixelEditor()
const app = pixelFlux

pixelFlux.init(hideLoadingAnimation)

setTimeout(flux.menu.onClickCallback("SHOWALL"))

document.addEventListener("mousedown", (event)=>{
  //console.log(event)
  var srcElement = event.srcElement
  if(srcElement.matches(".drawingcanvas")){
    srcElement.classList.add("isdrawing")
    var scale = pixelFlux.drawingScale
    var oX = ((srcElement.clientWidth)/2) - (((pixelFlux.sprite.width/2) * pixelFlux.drawingScale))
    var oY = ((srcElement.clientHeight-20)/2) - (((pixelFlux.sprite.height/2) * pixelFlux.drawingScale))
    
    var dX = Math.floor((event.layerX - oX) / scale)                                 
    var dY = Math.floor((event.layerY - oY - 24) / scale)                                   
                               
    pixelFlux.toolDown(dX, dY, event.buttons)
  }
})

document.addEventListener("mouseup", (event)=>{
  var srcElement = document.getElementById("DRAWINGCANVAS")
  
  if(srcElement.matches(".isdrawing")){
    srcElement.classList.remove("isdrawing")
    var scale = pixelFlux.drawingScale
    var oX = ((srcElement.clientWidth)/2) - (((pixelFlux.sprite.width/2) * pixelFlux.drawingScale))
    var oY = ((srcElement.clientHeight-20)/2) - (((pixelFlux.sprite.height/2) * pixelFlux.drawingScale))
    
    var dX = Math.floor((event.layerX - oX) / scale)                                 
    var dY = Math.floor((event.layerY - oY - 24) / scale)                                   
                               
    pixelFlux.toolUp(dX, dY)
  }
})

document.addEventListener("mousemove", (event)=>{
  var srcElement = event.srcElement
  var scale = pixelFlux.drawingScale
  var oX = ((srcElement.clientWidth)/2) - (((pixelFlux.sprite.width/2) * pixelFlux.drawingScale))
  var oY = ((srcElement.clientHeight-20)/2) - (((pixelFlux.sprite.height/2) * pixelFlux.drawingScale))
  var sX = Math.floor((event.layerX - event.movementX - oX) / scale)                                 
  var sY = Math.floor((event.layerY - event.movementY - oY - 24) / scale)                                   
  var dX = Math.floor((event.layerX - oX) / scale)                              
  var dY = Math.floor((event.layerY - oY - 24) / scale)
  
  debug.layerX = dX
  debug.layerY = dY
  
  if(srcElement.matches(".drawingcanvas")){  
    pixelFlux.updateCanvasAndPreview()
    
    if(srcElement.matches(".isdrawing")){    
      pixelFlux.toolDrag(sX, sY, dX, dY, event.buttons)
    }
    
    if(pixelFlux.currentSelection.enabled){
      var selectX = oX + (pixelFlux.currentSelection.x1 * pixelFlux.drawingScale)
      var selectY = oY + (pixelFlux.currentSelection.y1 * pixelFlux.drawingScale)
      var selectW = (pixelFlux.currentSelection.x2 - pixelFlux.currentSelection.x1 + 1) * pixelFlux.drawingScale
      var selectH = (pixelFlux.currentSelection.y2 - pixelFlux.currentSelection.y1 + 1) * pixelFlux.drawingScale
      var ctx = srcElement.getContext("2d")
      ctx.save()
      ctx.beginPath()
      ctx.strokeStyle = "#444444"
      ctx.lineWidth = 3
      ctx.setLineDash([5,5])
      ctx.rect(selectX, selectY, selectW, selectH)
      ctx.stroke()
      ctx.restore()
    }
    
    if(dX>=0 && dY>=0 && dX<pixelFlux.sprite.width && dY<pixelFlux.sprite.height){
      var ctx = srcElement.getContext("2d")
      ctx.beginPath()
      ctx.rect(oX + (dX*scale), oY + (dY*scale), scale, scale)
      ctx.stroke()
    }
    
    
  }
})


document.addEventListener("wheel", (event)=>{
  if(event.srcElement.id == "DRAWINGCANVAS"){
    pixelFlux.drawingScale += event.deltaY * -0.01
    log("Drawing Window Scale set to: " + pixelFlux.drawingScale)
    pixelFlux.updateCanvasAndPreview()
  }
  if(event.srcElement.id == "PREVIEWCANVAS"){
    pixelFlux.previewScale += event.deltaY * -0.01
    log("Preview Window Scale set to: " + pixelFlux.previewScale)
    pixelFlux.updateCanvasAndPreview()
  }
  if(event.srcElement.id == "ANIMATIONPREVIEWCANVAS"){
    pixelFlux.animationPreviewScale += event.deltaY * -0.01
    log("Preview Window Scale set to: " + pixelFlux.animationPreviewScale)
    pixelFlux.updateCanvasAndPreview()
  }
})



document.addEventListener('paste', function (evt) {
  const clipboardItems = evt.clipboardData.items
  const items = [].slice.call(clipboardItems).filter(function (item) {
      return item.type.indexOf('image') !== -1
  });
  if (items.length === 0) {
      return
  }

  log("Processing image from Clipboard...")
  const item = items[0]
  // Get the blob of image
  const blob = item.getAsFile()
  //console.log(blob)
  const img = new Image()
  
  img.onload = (event)=>{
    var img = event.srcElement
    var canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    var ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0,0, img.width, img.height, 0,0, img.width, img.height)
    var imgUrl = canvas.toDataURL("image/png")
    pixelFlux.sprite.loadFromDataURL(imgUrl, ()=>{
      pixelFlux.updateCanvasAndPreview()
    })
  }
  
  img.src = window.URL.createObjectURL(blob)
  console.log(img.src)
  
});

// Prevent right-click default action when using app
window.addEventListener("contextmenu", e => e.preventDefault());

const keyboard = new KeyboardHandler()
var config = {}
var configUrl = '/config/main.json'
if(DEVPREVIEW) configUrl = '/dev' + configUrl
get(configUrl).then((json)=>{
  config = JSON.parse(json)
})    



