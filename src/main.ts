
let divApp: HTMLDivElement | null = document.getElementById("app") as HTMLDivElement;
if (!divApp) {
    console.error("App div not found!");
} else {
    divApp = document.createElement("div") as HTMLDivElement;
    divApp.textContent = "Hello, World!";
    document.body.appendChild(divApp);
}





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



