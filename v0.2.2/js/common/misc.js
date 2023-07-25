const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`
const rgb2intArray = (rgb) => rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => n)
const n255 = (n) => {return n * (1/255)}
const rand = (max) => {return Math.floor(Math.random() * max)}
const max = (a,b) => {if(a>b){return a}else{return b}}
const min = (a,b) => {if(a<b){return a}else{return b}}

const normaliseColor = (color) => {return {r: color.r/255, g: color.g/255, b: color.b/255, a: color.a/255}}
const denormaliseColor = (color) => {return {r: color.r/255, g: color.g/255, b: color.b/255, a: color.a/255}}

function hex2rgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function hex2rgba(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 255
  } : null;
}

function bound(num, min, max){
  if(num < min) return min
  if(num > max) return max
  return num
}



function download(dataurl, filename) {
  const link = document.createElement("a");
  link.href = dataurl;
  link.download = filename;
  link.click();
}



function index(div){
  var h = document.querySelectorAll("h4")
  for (var i = 0; i<h.length; i++){
    var a = document.createElement("a")
    a.innerText = h[i].innerText
    a.onclick = (event)=>{
      h[i].scrollInteView()
    }
    h.id = "issuenumber" + i
  }
}



function get(url){
  return new Promise((resolve, reject)=>{
    console.log("Entering promise!")
    const xhr = new XMLHttpRequest()
    xhr.open("GET", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = (e) => {
      if(e.currentTarget.readyState == 4){
        resolve(xhr.responseText)
      }
    }
    xhr.onerror = (e) => {
      reject(e)
    }
    xhr.send()
  })
}


function post(url, json){
  return new Promise((resolve, reject)=>{
    var postData = JSON.stringify(json);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(postData);
    xhr.onreadystatechange = (e) => {
      if(e.currentTarget.readyState == 4){
        resolve(xhr.responseText);
      }
    }
    xhr.onerror = (e) => {
      reject(e);
    }
    
  })
}








// function doSignup(){
  
//   var m = document.getElementById("message")
  
//   var u = {};
//   u.first = document.getElementById("first").value;
//   u.last = document.getElementById("last").value;
//   u.displayname = document.getElementById("displayname").value;
//   u.email = document.getElementById("email").value;
//   u.password = document.getElementById("password").value;
//   var confirmpassword = document.getElementById("confirmpassword").value;
  
//   if(u.password !== confirmpassword){
//     m.innerHTML = "ERROR: Passwords do not match!  Please try again";
//     return
//   }
  
//   var postData = JSON.stringify(u);
  
  
//   const xhr = new XMLHttpRequest();
//   const url='/signup';
//   xhr.open("POST", url);
//   xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//   xhr.send(postData);
//   xhr.onreadystatechange = (e) => {
//     m.innerHTML = xhr.responseText;
//   }

  
  
// }




// function doSignin(){
  
//   var m = document.getElementById("message");  
//   var u = {};
  
//   u.email = document.getElementById("email").value;
//   u.password = document.getElementById("password").value;
  
//   post('/signin', u)
//     .then((r)=>{
//     window.location = "/"
//     console.log(r)
//   },
//           (e)=>{
//     m.innerHTML = "Login Failed";
//   });
  
// }

