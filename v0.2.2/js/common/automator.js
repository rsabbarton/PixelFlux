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







// BENCH functions
function brushTest1(){
    let b = new PixelBrush()
    b.load(BRUSH_BASIC)
    b.paint(sprite,0,0, 10, 10, {r: 255, g:0, b: 0, a: 255}, 0.2)
    b.paint(sprite,0,0, 11, 11, {r: 255, g:0, b: 0, a: 255}, 0.2)
    b.paint(sprite,0,0, 12, 12, {r: 255, g:0, b: 0, a: 255}, 0.2)
    b.paint(sprite,0,0, 13, 14, {r: 255, g:0, b: 0, a: 255}, 0.2)
    b.paint(sprite,0,0, 15, 16, {r: 255, g:0, b: 0, a: 255}, 0.2)
    setTimeout(brushTest2, 2000)
}

function brushTest2(){
    console.log("Testing darken")
    let b = new PixelBrush()
    b.load(BRUSH_BASIC_LIGHTEN)
    b.paint(sprite,0,0, 12, 12, {r: 255, g:0, b: 0, a: 255}, 0.2)
    
}