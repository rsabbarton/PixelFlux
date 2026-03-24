export default class App {

    divApp: HTMLDivElement;
    
    constructor (){

        this.divApp = document.createElement('div') as HTMLDivElement;

        this.divApp.textContent = "Hello, World!";
        document.body.appendChild(this.divApp);
        this.divApp.style.width = '100%';
        this.divApp.style.height = '100%';
        this.divApp.style.backgroundColor = '#330033';
    }
}