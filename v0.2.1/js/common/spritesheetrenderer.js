

function renderSpriteSheet(id, url, w, h, fps){
    var element = document.getElementById(id)
    if(!element.classList.contains("animating")){
        element.classList.add("animating")
        element.classList.add("continueanimating")
        var canvas = document.createElement("canvas")
        canvas.width = w
        canvas.height = h
        var img = new Image()
        img.src = url
        img.style.display = "none"
        element.appendChild(canvas)
        element.appendChild(img)
    }

    var img = element.querySelector("img")
    var canvas = element.querySelector("canvas")
    var width = img.width
    var height = img.height
    var n = width/height
    var epochm = Date.now()
    var interval = 1000/fps
    var runtime = interval * n
    var frameNumber = Math.floor((epochm % runtime) / interval)
    


    var ctx = canvas.getContext("2d")
    ctx.clearRect(0,0,w,h)
    ctx.drawImage(img, height * frameNumber, 0, height, height, 0, 0, w, h)

    if(element.classList.contains("continueanimating")){
        setTimeout(function (){renderSpriteSheet(id, url, w, h, fps)}, 1000/fps)
    }
}