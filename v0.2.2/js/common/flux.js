


class FluxUI {
  constructor(){  
    this.objectArray = new Array()
    this.fluxElement = null
    this.element = null
    this.config = null  
    this.menu = null
    
    log("FluxUI constructor finished!")
  }
  
  init() {
    
  }
  
  createFullScreenUI(){
    this.fluxElement = new FluxWindow(FLUXTYPE_WINDOW_MAIN)
    this.element = null
    this.config = null
  }
  
  loadMenu(configUrl, callback){
    this.menu = new Menu(configUrl, callback)
  }
  
  createWindow(id, title, x, y, width, height){
    var newFluxWindow = new FluxWindow(FLUXTYPE_WINDOW_CHILD, id, title, x, y, width, height)
    this.objectArray.push(newFluxWindow)
  }
  
  getObjectById(id){
    this.objectArray.forEach((o)=>{
      if(o.id == id){
        return o
      }
    })
  }
  
  showWindow(id){
    var w = document.getElementById(id);
    w.style.display = "block"
  }
  
  hideWindow(id){
    var w = document.getElementById(id);
    w.style.display = "none"
  }
  
  
  showModalMessageBox(title, message, callback){
    var dimmer = document.createElement("div")
    dimmer.classList.add("flux-dimmer")
    
    var w = new FluxWindow(FLUXTYPE_WINDOW_CHILD,"MESSAGEBOX", title, 50, 50, 500,200)
    w.hideCloseX()

    var container = document.getElementById("MESSAGEBOX")
    container.classList.add("flux-messagebox")
    var content = document.getElementById("MESSAGEBOXCONTENT")
    var msg = document.createElement("div")
    msg.classList.add("flux-messageboxmessage")
    msg.innerHTML = message
    
    var noButton = document.createElement("button")
    noButton.innerText = "No"
    noButton.classList.add("flux-messagenobutton")
    noButton.onclick = ()=>{ 
      callback(false)
      container.style.display = "none"
      container.remove()
      dimmer.remove()
    }
    
    var yesButton = document.createElement("button")
    yesButton.innerText = "OK"
    yesButton.classList.add("flux-messageyesbutton")
    yesButton.onclick = ()=>{ 
      callback(true)
      container.style.display = "none"
      container.remove()
      dimmer.remove()
    }
    
    content.appendChild(msg)
    //content.appendChild(noButton)
    content.appendChild(yesButton)
    
    document.body.appendChild(dimmer)
    container.style.display = "block"
  }
  
  showModalQuestionWindow(question, defaultAnswer, buttonYes, buttonNo, callback){
    var dimmer = document.createElement("div")
    dimmer.classList.add("flux-dimmer")
    
    var w = new FluxWindow(FLUXTYPE_WINDOW_CHILD,"QUESTIONWINDOW", "", 50, 50, 500,200)
    w.hideCloseX()
    
    var container = document.getElementById("QUESTIONWINDOW")
    container.classList.add("flux-messagebox")
    var content = document.getElementById("QUESTIONWINDOWCONTENT")
    var msg = document.createElement("div")
    msg.classList.add("flux-messageboxmessage")
    msg.innerHTML = question
    
    var answerBox = document.createElement("input")
    answerBox.type = "text"
    answerBox.value = defaultAnswer
    answerBox.id = "QUESTIONWINDOWRESPONSE"
    answerBox.classList.add("flux-questioninput")
    
    
    var noButton = document.createElement("button")
    noButton.innerText = buttonNo
    noButton.classList.add("flux-messagenobutton")
    noButton.onclick = ()=>{ 
      callback(false)
      container.style.display = "none"
      container.remove()
      dimmer.remove()
    }
    
    var yesButton = document.createElement("button")
    yesButton.innerText = buttonYes
    yesButton.classList.add("flux-messageyesbutton")
    yesButton.onclick = ()=>{ 
      callback(document.getElementById("QUESTIONWINDOWRESPONSE").value)
      container.style.display = "none"
      container.remove()
      dimmer.remove()
    }
    
    content.appendChild(msg)
    content.appendChild(answerBox)
    content.appendChild(noButton)
    content.appendChild(yesButton)
    
    document.body.appendChild(dimmer)
    container.style.display = "block"
  }
  
  
  showModalSelectionWindow(question, answers, buttonYes, buttonNo, callback){
    var dimmer = document.createElement("div")
    dimmer.classList.add("flux-dimmer")
    
    var w = new FluxWindow(FLUXTYPE_WINDOW_CHILD,"QUESTIONWINDOW", "", 50, 50, 500,200)
    w.hideCloseX()
    

    var container = document.getElementById("QUESTIONWINDOW")
    container.classList.add("flux-messagebox")
    var content = document.getElementById("QUESTIONWINDOWCONTENT")
    var msg = document.createElement("div")
    msg.classList.add("flux-messageboxmessage")
    msg.innerHTML = question
    
    var answerBox = document.createElement("select")
    //answerBox.type = "text"
    //answerBox.value = defaultAnswer
    answerBox.id = "QUESTIONWINDOWRESPONSE"
    answerBox.classList.add("flux-select")
    
    console.log(answers)
    answers.forEach(a => {
      var option = document.createElement("option");
      option.value = a;
      option.text = a;
      answerBox.appendChild(option);
    })
    
    var noButton = document.createElement("button")
    noButton.innerText = buttonNo
    noButton.classList.add("flux-messagenobutton")
    noButton.onclick = ()=>{ 
      callback(false)
      container.style.display = "none"
      container.remove()
      dimmer.remove()
    }
    
    var yesButton = document.createElement("button")
    yesButton.innerText = buttonYes
    yesButton.classList.add("flux-messageyesbutton")
    yesButton.onclick = ()=>{ 
      callback(document.getElementById("QUESTIONWINDOWRESPONSE").value)
      container.style.display = "none"
      container.remove()
      dimmer.remove()
    }
    
    content.appendChild(msg)
    content.appendChild(answerBox)
    content.appendChild(noButton)
    content.appendChild(yesButton)
    
    document.body.appendChild(dimmer)
    container.style.display = "block"
  }
  
  
  
  setWindowContent(id, html){
    this.getObjectById(id).setWindowContent(html)
  }
  addWindowContent(id, html){
    this.getObjectById(id).addWindowContent(html)
  }
  appendWindowContent(id, element){
    this.getObjectById(id).appendWindowContent(element)
  }
  
  
  appendToolButton(windowId, toolId, imgUrl){
    var toolButton = document.createElement("div")
    toolButton.classList.add("flux-toolbarbutton")
    toolButton.id = toolId
    toolButton.style.backgroundImage = "url(" + imgUrl + ")"
    this.objectArray.forEach((window)=>{
      if(window.id == windowId){
        window.appendWindowContent(toolButton)
      }
    })
  }
  
  setToolButtonSize(size){
    size += "px"
    var buttons = document.querySelectorAll(".flux-toolbarbutton")
    for(var i = 0; i<buttons.length; i++){
      buttons[i].style.width = size
      buttons[i].style.height = size
    }
  }
  
  getWindowArrangement(){
    var arrangement = []
    this.objectArray.forEach((o)=>{
      var container = document.getElementById(o.id)
      var win = {
        id: o.id,
        top: container.style.top,
        left: container.style.left,
        width: container.style.width,
        height: container.style.height
        }
      arrangement.push(win)
      
    })
    return arrangement
  }
  
  restoreWindowArrangement(arrangement){
    arrangement.forEach((win)=>{
      var container = document.getElementById(win.id)
      container.style.top = win.top
      container.style.left = win.left
      container.style.width = win.width
      container.style.height = win.height
    })
  }
  
}


class FluxWindow {
  constructor(type, id, title, x, y, width, height){
    this.objectArray = []
    this.id = id
    this.title = title
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.windowContentElement = null
    this.cornerDraggerUrl = "https://cdn.glitch.global/befa0810-9d20-49a3-87ed-eec4eb07f0fb/corner-dragger.png?v=1645545876932"
    switch (type) {
      case FLUXTYPE_WINDOW_MAIN:
        break
      case FLUXTYPE_WINDOW_CHILD:
        this.createChildWindow(id, title, x, y, width, height)
        break
    }
    
  }
  
  createChildWindow(id, title, x, y, width, height){
    var windowContainer = document.createElement('div')
    windowContainer.classList.add("flux-windowcontainer")
    windowContainer.style.display = "none"
    windowContainer.style.top = y + "px"
    windowContainer.style.left = x + "px"
    windowContainer.style.width = width + "px"
    windowContainer.style.height = height + "px"
    windowContainer.id = id
    
    var titleBar = document.createElement('div')
    titleBar.classList.add("flux-windowtitlebar")
    titleBar.innerHTML = title
    
    this.closeButton = document.createElement("div")
    this.closeButton.innerHTML = 'x'
    this.closeButton.onclick = (event)=>{ windowContainer.style.display = "none"}
    this.closeButton.classList.add("flux-windowclosebutton")
    this.closeButton.classList.add("flux-clickable")
    
    var windowContent = document.createElement('div')
    windowContent.classList.add("flux-windowcontent")
    windowContent.id = id + "CONTENT"
    windowContent.style.width = "100%"
    windowContent.style.height = (height - 26) + "px" // Height -25 (for title bar height) and -1 for border
    this.windowContentElement = windowContent
    
    var cornerDragger = new Image()
    cornerDragger.src = this.cornerDraggerUrl
    cornerDragger.classList.add("flux-windowresizeicon")
    cornerDragger.style.right = "0px"
    cornerDragger.style.bottom = "0px"
    cornerDragger.style.position = "absolute"
    
    windowContainer.appendChild(titleBar)
    windowContainer.appendChild(windowContent)
    windowContainer.appendChild(cornerDragger)
    windowContainer.appendChild(this.closeButton)
    document.body.appendChild(windowContainer)
    
  }
  
  getContentElement(){
    log("Getting Content Element")
    var contentElement = this.windowContentElement
    return contentElement
  }
  
  setWindowContent(htmlString){
    this.windowContentElement.innerHTML = htmlString
  }
  
  addWindowContent(htmlString){
    this.windowContentElement.innerHTML += htmlString
  }
  
  appendWindowContent(htmlElement){
    this.windowContentElement.appendChild(htmlElement)
  }

  hideCloseX(){
    this.closeButton.style.display = "none"
  }
  
  onResize(){
    // TODO - Add Code for onResize so that content can adjust
  }
}



class Menu {
  constructor(menuConfigUrl, onClickCallback){
    this.menuContainer = document.createElement('div')
    this.menuContainer.classList.add("flux-menucontainer")
    //this.menuContainer.style.display = "none"
    this.menuContainer.class = "flux-menu"
    this.loadMenu(menuConfigUrl)
    this.onClickCallback = onClickCallback
    
  }

  loadMenu(jsonUrl){
    get(jsonUrl).then((json)=>{
      json = JSON.parse(json)
      this.create(json, this.menuContainer)
      document.body.appendChild(this.menuContainer)
    })    
  }
  
  create(config, element){
    switch (config.type) {
      case "MAIN":
        var main = document.createElement("div")
        main.classList.add("flux-menu")
        main.classList.add("flux-menuitem")
        element.appendChild(main)
        if(config.menuItems){
          config.menuItems.forEach((item)=>{
            this.create(item,main)
          })
        }
        break
      case "MENU":
        var menu = document.createElement("div")
        menu.classList.add("flux-menu")
        menu.classList.add("flux-menuitem")
        menu.classList.add("flux-clickable")
        
        menu.innerHTML = config.display
        var submenu = document.createElement("div")
        submenu.classList.add("flux-submenu")
        submenu.style.display = "none"
        menu.appendChild(submenu)
        menu.onclick = (event)=>{
          if(event.srcElement == menu){
            var submenus = document.getElementsByClassName('flux-submenu')
            for(var i = 0; i < submenus.length; i++){
              submenus[i].style.display = "none"
            }
            submenu.style.display = "block"
          }
        }
        submenu.onmouseleave = ()=>{submenu.style.display = "none"}
        element.appendChild(menu)
        if(config.menuItems){
          config.menuItems.forEach((item)=>{
            this.create(item,submenu)
          })
        }
        break
      case "SUBMENU":
        var menu = document.createElement("div")
        menu.classList.add("flux-menuitem")
        menu.classList.add("flux-clickable")
        
        menu.innerHTML = config.display
        var submenu = document.createElement("div")
        submenu.classList.add("flux-sidemenu")
        submenu.style.display = "none"
        menu.appendChild(submenu)
        menu.onclick = (event)=>{
          if(event.srcElement == menu){
            
            submenu.style.display = "block"
          }
        }
        submenu.onmouseleave = ()=>{submenu.style.display = "none"}
        element.appendChild(menu)
        if(config.menuItems){
          config.menuItems.forEach((item)=>{
            this.create(item,submenu)
          })
        }
        break
        case "CLICKABLE":
          var menu = document.createElement("div")
          menu.classList.add("flux-menuitem")
          menu.classList.add("flux-clickable")
          menu.innerHTML = config.display
          menu.onclick = ()=>{
            if(config.onclick){
              eval(config.onclick)
            }
            this.menuClicked(config.id)
            menu.parentElement.style.display = "none"
          }
          element.appendChild(menu)
          if(config.menuItems){
            config.menuItems.forEach((item)=>{
              this.create(item,menu)
            })
          }
          break
        case "FILESELECT":
          var menu = document.createElement("div")
          menu.classList.add("flux-menuitem")
          menu.classList.add("flux-clickable")
          menu.innerHTML = config.display
          menu.onclick = ()=>{
            this.menuClicked(config.id)
            menu.parentElement.style.display = "none"
          }

          var fileselect = document.createElement("input")
          fileselect.type = "file"
          fileselect.id = config.id+"FILESELECT"
          fileselect.classList.add("flux-fileselect")
          menu.appendChild(fileselect)
          element.appendChild(menu)
          
          if(config.menuItems){
            config.menuItems.forEach((item)=>{
              this.create(item,menu)
            })
          }
          break
        case "SEPARATOR":
        var menu = document.createElement("div")
        menu.classList.add("flux-menuitem")
        menu.classList.add("flux-menuseparator")
        menu.innerHTML = config.display
        
        element.appendChild(menu)
        break
      
    }
  }

  menuClicked(itemId){
    this.onClickCallback(itemId)
  }
}


const FLUXTYPE_WINDOW_MAIN = 0
const FLUXTYPE_WINDOW_CHILD = 1
const FLUXTYPE_BUTTON = 2
const FLUXTYPE_TEXT = 3
const FLUXTYPE_CANVAS = 4


const EVENT_MOUSEBUTTON_LEFT = 0
const EVENT_MOUSEBUTTON_RIGHT = 2
const EVENT_MOUSEBUTTON_MIDDLE = 1


document.addEventListener("mousedown", (event)=>{
  var srcElement = event.srcElement
  if(srcElement.matches(".flux-windowtitlebar")){
    srcElement.parentElement.classList.add("flux-windowmoving")
  }
  if(srcElement.matches(".flux-windowresizeicon")){
    srcElement.parentElement.classList.add("flux-windowsizing")
  }
  if(srcElement.matches(".drawingcanvas")){
    srcElement.classList.add("isdrawing")
    
  }
})

document.addEventListener("mouseup", (event)=>{
  var movingWindow = document.querySelector(".flux-windowmoving")
  if(movingWindow){
    movingWindow.classList.remove("flux-windowmoving")
  }
  var sizingWindow = document.querySelector(".flux-windowsizing")
  if(sizingWindow){
    sizingWindow.classList.remove("flux-windowsizing")
  }

})

document.addEventListener("mousemove", (event)=>{
  if(!debug)
    return
  debug.mouseX = event.x
  debug.mouseY = event.y
  debug.elementX = event.layerX
  debug.elementY = event.layerY
  debug.srcElementId = event.srcElement.id
  //console.log(event)
  if(event.buttons > 0){ // mouse button is down
    var movingWindow = document.querySelector(".flux-windowmoving")
    if(movingWindow){
      var rect = movingWindow.getBoundingClientRect()
      var newX = rect.left + event.movementX
      var newY = rect.top + event.movementY
      movingWindow.style.left = newX + "px"
      movingWindow.style.top = newY + "px"
    }
    var sizingWindow = document.querySelector(".flux-windowsizing")
    if(sizingWindow){
      var rect = sizingWindow.getBoundingClientRect()
      var newX = rect.width + event.movementX
      var newY = rect.height + event.movementY
      sizingWindow.style.width = newX + "px"
      sizingWindow.style.height = newY + "px"
      const postEvent = new CustomEvent('fluxWindowResize', { detail: {srcElementId: sizingWindow.id, srcElement: sizingWindow }})
      document.dispatchEvent(postEvent)
    }
  }
  
  printlog()
  
})


document.addEventListener("click", (event)=>{
  var srcElement = event.srcElement
  if(srcElement.matches(".flux-toolbarbutton")){
    var tools = document.querySelectorAll(".flux-toolbarbutton")
    for(var i=0; i<tools.length; i++){
      tools[i].classList.remove("flux-toolselected")
    }
    srcElement.classList.add("flux-toolselected")
    
  }
})



