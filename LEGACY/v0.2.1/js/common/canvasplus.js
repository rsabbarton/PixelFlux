// CanvasPlus Class for drawing in a canvas element

// CanvasPlus Constants
const DEFAULT_CANVASPLUS_ID = "canvasplusid"


class CanvasPlus {
  constructor(){
    this.canvasObject = document.createElement("canvas")
    this.canvasObject.id = DEFAULT_CANVASPLUS_ID
    
    this.ctx = this.canvasObject.getContext("2d")
    this.width = 0
    this.height = 0
    
  }
  
  getCanvasObject(){
    return this.canvasObject
  }
  
  disableSmoothing(){
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
  }
  
  insertAsFullWindowCanvas(){
    this.width = window.innerWidth
    this.height = window.innerHeight
    document.body.style.margin = "0px"
    this.canvasObject.style.width = window.innerWidth + "px"
    this.canvasObject.style.height = window.innerHeight + "px"
    this.canvasObject.width = window.innerWidth
    this.canvasObject.height = window.innerHeight
    this.canvasObject.style.zIndex = 0
    this.canvasObject.style.position = "absolute"
    this.canvasObject.style.left = "0px"
    this.canvasObject.style.top = "0px"
    
    document.body.appendChild(this.canvasObject)
    
  }
  
  resizeToFitWindow(){
    this.canvasObject.style.width = window.innerWidth + "px"
    this.canvasObject.style.height = window.innerHeight + "px"
  }
  
  useExistingCanvasObject(id){
    // TODO - Add code to use existing canvas object instead of inserting
    this.canvasObject = document.getElementById(id)
    this.width = this.canvasObject.width
    this.height = this.canvasObject.height
    
  }
  
  clear(){
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
  
  
}