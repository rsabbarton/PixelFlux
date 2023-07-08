var debug = {
  "mouseX": 0,
  "mouseY": 0,
  "layerX": 0,
  "layerY": 0,
  "elementX": 0,
  "elementY": 0,
  "srcElementId": "",
  "counter": 0,
  mSize: 0,
  mUsed: 0,
  mMax: 0,
  "events": [
    "DEBUG STARTED",
    "Use LOG(string) to log information here..."
  ]
}


function log(str){
  var entry = Date.now() + " - " + str
  debug.events.push(entry)
  printlog()
}


function printlog(){
  var out = "Mouse position: " + debug.mouseX + "," + debug.mouseY + " - src: " + debug.srcElementId + " - Elem Coords: " + debug.elementX + "," + debug.elementY + "<br>" +
  "Layer position: " + debug.layerX + "," + debug.layerY + " - Debug Counter: " + debug.counter + "<br>" +
  "Memory Total: " + debug.mSize + " - Memory Used: " + debug.mUsed + "<br>"
            ""
  var evtlog = ""
  debug.events.forEach((evt)=>{
    evtlog = evt + "<br>" + evtlog
  })
  var dst = document.getElementById("FLUXDEBUGINFO")
  if(dst){
    dst.innerHTML = out + evtlog
  }
}
