
import App from './modules/app.ts';


const PixelFlux = new App();




let outputString: string = "Hello, World!";
console.log(outputString);
const concatString: string = outputString + " Welcome to TypeScript!";
console.log(concatString);  

const outputDiv: HTMLDivElement | null = document.getElementById("output") as HTMLDivElement;
if (outputDiv) {
    outputDiv.textContent = concatString;
} else {
    console.error("Output div not found!");
}       



