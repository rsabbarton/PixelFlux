


class FluxStore {
  constructor(){
    
  }
  
  saveStringInBrowser(name, str){
    localStorage.setItem(name, str)
  }
  
  getStringFromBrowser(name){
    return localStorage.getItem(name)
  }
  
  saveJsonInBrowser(name, obj){
    var str = JSON.stringify(obj)
    
    localStorage.setItem(name, str)
  }
  
  getJsonFromBrowser(name){
    return JSON.parse(localStorage.getItem(name))
  }
  
}


const store = new FluxStore()