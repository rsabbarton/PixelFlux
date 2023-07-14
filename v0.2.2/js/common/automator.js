// Automator is the plugin Engine for PixelFlux - It allows development of
// plugins in the browser console and then execution of these in the 
// application context



class Plugin {
    constructor(name){
        this.name = name
        this.description = ""
        this.sourceCode = ""
        console.log(`
You have created a new plugin.  Welcome to the wonderful world of pixelflux scripting! Here are a few pointers to help you along the way.
            
app = The pixelflux application run app.help() for more information
sprite = The sprite you currently have loaded.  sprite.help() will get you going

`)
    }

    run (){
        console.log(eval(this.sourceCode))
    }

    loadSourceFromURL(url){
        get(url)
        .then(r=>{
            this.sourceCode = r
            this.ready = true
        })
    }
}