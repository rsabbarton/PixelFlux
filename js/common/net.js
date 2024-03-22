function get(url){
   return new Promise((resolve, reject)=>{
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(null);
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