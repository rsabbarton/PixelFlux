document.addEventListener("menuButtonClicked", (event)=>{
  var srcElementId = event.detail.srcElementId
  switch (srcElementId) {
    case "HOMEPAGE":
      window.open("https://pixelflux.me")
      break
    case "FORUM":
      window.open("https://github.com/rsabbarton/PixelFlux/discussions")
      break
    case "NEW6X6": 
      pixelFlux.createNewSprite(6,6)
      pixelFlux.drawingScale = 64
      pixelFlux.previewScale = 8
      break
    case "NEW9X9": 
      pixelFlux.createNewSprite(9,9)
      pixelFlux.drawingScale = 48
      pixelFlux.previewScale = 8
      break
    case "NEW16X16": 
      pixelFlux.createNewSprite(16,16)
      pixelFlux.drawingScale = 32
      pixelFlux.previewScale = 8
      break
    case "NEW32X32": 
      pixelFlux.createNewSprite(32,32)
      pixelFlux.drawingScale = 16
      pixelFlux.previewScale = 4
      break
    case "NEW48X48": 
      pixelFlux.createNewSprite(48,48)
      pixelFlux.drawingScale = 12
      pixelFlux.previewScale = 3
      break
    case "NEW64X64": 
      pixelFlux.createNewSprite(64,64)
      pixelFlux.drawingScale = 8
      pixelFlux.previewScale = 2
      break
    case "NEW100X100": 
      pixelFlux.createNewSprite(100,100)
      break
    case "IMPORT": 
      flux.showModalQuestionWindow("Enter the URL of the image you would like to import: <br> <i>Note: Your current image will be replaced!</i>", "http://", "Import", "Cancel", (response)=>{
        if(response){
          pixelFlux.sprite.loadFromURL(response, ()=>{
            pixelFlux.updateCanvasAndPreview()
          })
        }
      })
      break
    case "OPEN": 
      pixelFlux.showLoadGallery()
      break
    case "OPENPIXELFILE":
      var selector = document.getElementById("OPENPIXELFILEFILESELECT")
      selector.onchange = (e)=>{
        log("Opening: " + selector.value)
        var filename = selector.value
        var file = selector.files[0]
        if (file) {
            var reader = new FileReader()
            reader.readAsText(file, "UTF-8")
            reader.onload = function (evt) {
                var contents = evt.target.result
                var spriteObject = JSON.parse(contents)
                pixelFlux.sprite.loadFromSprite(spriteObject)
                pixelFlux.updateCanvasAndPreview()
            }
            reader.onerror = function (evt) {
                window.alert("Error Reading File!")
                console.log(evt)
            }
        }
      }
      selector.value = ""
        
      return
      break
    case "EXPORT": break
    case "SAVE": 
      pixelFlux.saveSprite()
      break
    case "SAVEONLINE": 
      pixelFlux.saveSpriteOnline()
      break
      case "DOWNLOAD":
        pixelFlux.setSpriteName().then(()=>{      
          var url = pixelFlux.sprite.canvas.toDataURL("image/png")
          if(pixelFlux.sprite.name.length == 0)
            download(url, "pixelFlux-download.png")
          else
            download(url, pixelFlux.sprite.name + ".png")
        })
        break
      case "DOWNLOADPIXELFILE": 
      pixelFlux.setSpriteName().then(()=>{
        var url = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pixelFlux.sprite));
        
        if(pixelFlux.sprite.name.length == 0)
          download(url, "pixelFlux-download.pixel")
        else
          download(url, pixelFlux.sprite.name + ".pixel")
      })
      
      break
    case "DOWNLOADSPRITESHEET": 
      pixelFlux.setSpriteName().then(()=>{     
        pixelFlux.sprite.updateSpriteSheetCanvas()
        var dataUrl = pixelFlux.sprite.spriteSheetCanvas.toDataURL("image/png")
        download(dataUrl, pixelFlux.sprite.name + "_spritesheet.png")
      })
      break
    case "": break
    case "UNDO": 
      pixelFlux.sprite.undo()
      pixelFlux.updateCanvasAndPreview()
      break
    case "REDO": 
      pixelFlux.sprite.redo()
      pixelFlux.updateCanvasAndPreview()
      break
    case "": break
    case "": break
    case "SELECTALL": 
      pixelFlux.currentSelection.enabled = true
      pixelFlux.currentSelection.x1 = 0
      pixelFlux.currentSelection.y1 = 0
      pixelFlux.currentSelection.x2 = pixelFlux.sprite.width - 1
      pixelFlux.currentSelection.y2 = pixelFlux.sprite.height - 1
      pixelFlux.updateCanvasAndPreview()
      break
    case "SELECTNONE": 
      pixelFlux.currentSelection.enabled = false
      pixelFlux.updateCanvasAndPreview()
      break
    case "": break
    case "": break
    case "ADDLAYERCURRENTFRAME": 
      if(pixelFlux.preferences.preserveLayerConinuity){
        pixelFlux.sprite.addLayerAllFrames()
      } else {
        pixelFlux.sprite.addLayer()
      }
      pixelFlux.renderLayersWindow()
      break
    case "UPLAYERSTACK": 
      pixelFlux.sprite.nextLayerUp()
      pixelFlux.renderLayersWindow()
      break
    case "DOWNLAYERSTACK": 
      pixelFlux.sprite.nextLayerDown()
      pixelFlux.renderLayersWindow()
      break
    case "LAYERTOGGLEVISIBLE": 
      pixelFlux.sprite.getCurrentFrame().getCurrentLayer().toggleVisible()
      pixelFlux.sprite.updateCanvasChain()
      pixelFlux.updateCanvasAndPreview()
      break
    case "LAYERTOGGLELOCKED": 
      pixelFlux.sprite.getCurrentFrame().getCurrentLayer().toggleLocked()
      pixelFlux.sprite.updateCanvasChain()
      pixelFlux.updateCanvasAndPreview()
      break
    case "LAYERCLEAR": 
      pixelFlux.sprite.getCurrentFrame().getCurrentLayer().clear()
      pixelFlux.sprite.updateCanvasChain()
      pixelFlux.updateCanvasAndPreview()
      break
    case "": break
    case "": break
    case "": break
    case "": break
    case "ADDFRAME": 
      pixelFlux.sprite.addFrame()
      pixelFlux.sprite.updateCanvasChain()
      pixelFlux.updateCanvasAndPreview()
      break
    case "NEXTFRAME": 
      pixelFlux.sprite.selectNextFrame()
      pixelFlux.sprite.updateCanvasChain()
      pixelFlux.updateCanvasAndPreview()
      break
    case "PREVIOUSFRAME": 
      pixelFlux.sprite.selectPreviousFrame()
      pixelFlux.sprite.updateCanvasChain()
      pixelFlux.updateCanvasAndPreview()
      break
    case "": break
    case "": break
    case "": break
    case "INSERTFRAMEBEFORE": 
      pixelFlux.sprite.insertFrameBeforeCurrent()
      pixelFlux.sprite.updateCanvasChain()
      pixelFlux.updateCanvasAndPreview()
      break
    case "INSERTFRAMEAFTER": 
      pixelFlux.sprite.insertFrameAfterCurrent()
      pixelFlux.sprite.updateCanvasChain()
      pixelFlux.updateCanvasAndPreview()
      break
    case "": break
    case "": break
    case "DUPLICATECURRENTFRAME": 
      pixelFlux.sprite.copyFrame(pixelFlux.sprite.currentFrame)
      pixelFlux.updateCanvasAndPreview()
      break
    case "DELETECURRENTFRAME": 
      pixelFlux.sprite.deleteFrame(pixelFlux.sprite.currentFrame)
      pixelFlux.updateCanvasAndPreview()
      break
    case "": break
    case "": break
    case "": break
    case "": break
    case "STARTANIMATION": 
      pixelFlux.animating = true
      pixelFlux.renderAnimationPreview()
      break
    case "STOPANIMATION": 
      pixelFlux.animating = false
      break
    case "": break
    case "": break
    case "ICONSIZEMICRO": flux.setToolButtonSize(24); break
    case "ICONSIZESMALL": flux.setToolButtonSize(32); break
    case "ICONSIZEMEDIUM": flux.setToolButtonSize(42); break
    case "ICONSIZELARGE": flux.setToolButtonSize(64); break
    case "": break
    case "": break
    case "SHOWTOOLOPTIONS": 
      flux.showWindow("TOOLOPTIONS")
      break
    case "SHOWPREVIEW": 
      flux.showWindow("PREVIEW")
      break
    case "SHOWANIMATIONPREVIEW": 
      flux.showWindow("ANIMATIONPREVIEW")
      break
    case "SHOWANIMATIONTOOLS": 
      flux.showWindow("ANIMATIONTOOLS")
      break
    case "SHOWANIMATIONFRAMES": 
      flux.showWindow("FRAMES")
      break
    case "SHOWWORKSPACE": 
      flux.showWindow("WORKSPACE") 
      break
    case "SHOWCOLOURPALLET": 
      flux.showWindow("COLOURPALLET") 
      break
    case "SHOWTOOLBAR": 
      flux.showWindow("TOOLBAR")
      break
    case "SHOWLAYERS": 
      flux.showWindow("LAYERS")
      break
    case "SHOWDEBUG": 
      flux.showWindow("DEBUG")
      break
    case "SHOWALL": 
      flux.showWindow("WORKSPACE") 
      flux.showWindow("PREVIEW")
      flux.showWindow("COLOURPALLET") 
      flux.showWindow("TOOLBAR")
      flux.showWindow("TOOLOPTIONS")
      flux.showWindow("DEBUG")
      flux.showWindow("LAYERS")
      flux.showWindow("ANIMATIONPREVIEW")
      flux.showWindow("ANIMATIONTOOLS")
      flux.showWindow("FRAMES")
      break
    case "SETBACKGROUNDCOLOR":
      pixelFlux.setBackgroundColour()
      break
    case "TOGGLETILEPREVIEW":
      pixelFlux.toggleTilePreview()
      break
    case "ARRANGECLASSIC": 
      flux.restoreWindowArrangement(builtInWindowArrangements.CLASSIC)
      pixelFlux.resizeContentCanvases()
      break
    case "ARRANGEWIDE": 
      flux.restoreWindowArrangement(builtInWindowArrangements.WIDE)
      pixelFlux.resizeContentCanvases()
      break
    case "ARRANGETILECREATOR": 
      flux.restoreWindowArrangement(builtInWindowArrangements.TILECREATOR)
      pixelFlux.tilePreview = true
      pixelFlux.resizeContentCanvases()
      break
    case "SAVEWINDOWARRANGEMENT": 
      var arrangement = flux.getWindowArrangement()
      localStorage.setItem("arrangement", JSON.stringify(arrangement))
      break
    case "RESTOREWINDOWARRANGEMENT": 
      var arrangement = JSON.parse(localStorage.getItem("arrangement"))
      flux.restoreWindowArrangement(arrangement)
      break
    case "": break
    case "": break
    case "LOADPALLETDEFAULT": 
      pixelFlux.clearColourPallet()
      pixelFlux.loadColours(builtInColourPallets.DEFAULT)
      break
    case "LOADPALLETWOODLAND": 
      pixelFlux.clearColourPallet()
      pixelFlux.loadColours(builtInColourPallets.WOODLANDJOURNEY)
      break
    case "LOADPALLETPASTELDREAMS": 
      pixelFlux.clearColourPallet()
      pixelFlux.loadColours(builtInColourPallets.PASTELDREAMS)
      break
    case "LOADPALLETHIGHCONTRAST": 
      pixelFlux.clearColourPallet()
      pixelFlux.loadColours(builtInColourPallets.HIGHCONTRAST)
      break
      case "LOADPALLETCYBERPUNKNEON": 
      pixelFlux.clearColourPallet()
      pixelFlux.loadColours(builtInColourPallets.CYBERPUNKNEON)
      break
      case "LOADPALLETDRAGONFIRE": 
      pixelFlux.clearColourPallet()
      pixelFlux.loadColours(builtInColourPallets.DRAGONFIRE)
      break
    
    case "LOADPALETTE": 
      pixelFlux.selectSavedPalette()
      break
    case "SAVEPALETTE": 
      pixelFlux.saveColourPaletteAs()
      break
    case "EXPORTPALETTE": 
      pixelFlux.exportCurrentPalette()
      break
    case "IMPORTPALETTEFILE": 
      var selector = document.getElementById("IMPORTPALETTEFILEFILESELECT")
      selector.onchange = (e)=>{
        log("Importing: " + selector.value)
        var filename = selector.value
        var file = selector.files[0]
        if (file) {
            var reader = new FileReader()
            reader.readAsText(file, "UTF-8")
            reader.onload = function (evt) {
                var contents = evt.target.result
                var palette = JSON.parse(contents)
                pixelFlux.clearColourPallet()
                pixelFlux.loadColours(palette.colours)
                pixelFlux.updateCanvasAndPreview()
            }
            reader.onerror = function (evt) {
                window.alert("Error Reading File!")
                console.log(evt)
            }
        }
      }
      selector.value = ""
      break
    
    
    case "CLEARPALLET": 
      pixelFlux.clearColourPallet()
      break
      case "REDUCEPALLET": 
      pixelFlux.reduceColourPalette(30)
      break
    case "GETPALLETFROMLAYER":
      pixelFlux.clearColourPallet()
      pixelFlux.createPaletteFromCurrentLayer()
      break
    case "": break
    case "ABOUTPIXELFLUX":
      let aboutInfo = `
          Version: ${config.version}<br>
          Release Date: ${config.releaseDate}<br>
          Developer Preview: ${DEVPREVIEW}<br>
          .pixel Filespec: v2.0.0<br>
          <br>
          &copy; Richard Sabbarton

          `
      flux.showModalMessageBox('About PixelFlux', aboutInfo, ()=>{})
      break
    case "TODOLIST": window.open("/content?type=task"); break;
    case "KNOWNISSUES": window.open("/content?type=task"); break;
    case "LOADHELPPAGES": window.open("/content?type=tutorial"); break;
  }
})
