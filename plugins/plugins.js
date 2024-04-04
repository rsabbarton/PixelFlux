const pluginIndex = [
    {name: "Pencil", iconUrl:"./resources/icons/penciltoolicon.png", sourceUrl: "./plugins/pencil.js"},
    {name: "Eraser", iconUrl:"./resources/icons/erasertoolicon.png", sourceUrl: "./plugins/eraser.js"}
]

window.pluginIndex = pluginIndex
window.currentPlugin = false

class pluginManager {
    constructor() {
        this.pluginIndex = pluginIndex
        this.currentPlugin = false
        this.pluginActive = false
    }

    getPluginIndex(){
        return this.pluginIndex
    }

    
}
export {pluginIndex}