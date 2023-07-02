//https://www.dropbox.com/s/zrivr51bl39vzog/arrow-anticlockwise.png?raw=1
//https://www.dropbox.com/s/o8xf24nta7w7qj6/arrow-clockwise.png?raw=1


var logo1 = document.createElement('img')
logo1.src = "https://www.dropbox.com/s/o8xf24nta7w7qj6/arrow-clockwise.png?raw=1"
var logo2 = document.createElement('img')
logo2.src = "https://www.dropbox.com/s/zrivr51bl39vzog/arrow-anticlockwise.png?raw=1"
var logocontainer = document.createElement('div')
var showingLoadingAnimation = false;

function showLoadingAnimation(){
  logocontainer.style.width = window.innerWidth + "px"
  logocontainer.style.height = window.innerHeight + "px"
  logocontainer.style.position = "absolute"
  logocontainer.style.top = "0px"
  logocontainer.style.left = "0px"
  logocontainer.style.backgroundColor = "darkslategrey"
  logocontainer.style.zIndex = "50"
  
  logocontainer.innerHTML = "<div align=center><br><br><br><br><b><code>Loading...</code></b></div>"
  
  updateLogoRotation()
  
  showingLoadingAnimation = true
  document.body.appendChild(logocontainer)
  document.body.appendChild(logo1)
  document.body.appendChild(logo2)
  
  updateLogoRotation()
}

function updateLogoRotation(){
  logo1.style.position = "absolute"
  logo1.style.left = (window.innerWidth/2) - (logo1.width/2) + "px"
  logo1.style.top = (window.innerHeight/2) - (logo1.height/2) + "px"
  logo1.style.transform = "rotate(" + Date.now()/2/1000 + "turn)"
  logo1.style.zIndex = "90"
  
  logo2.style.position = "absolute"
  logo2.style.left = (window.innerWidth/2) - (logo2.width/2) + "px"
  logo2.style.top = (window.innerHeight/2) - (logo2.height/2) + "px"
  logo2.style.transform = "rotate(" + Date.now()/-2/1000 + "turn)"
  logo2.style.zIndex = "100"
  
  if(showingLoadingAnimation) setTimeout(updateLogoRotation, 1000/60)
}


function hideLoadingAnimation(){
  logocontainer.remove()
  logo1.remove()
  logo2.remove()
}