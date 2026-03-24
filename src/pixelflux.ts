import { applyNamedTheme, applyTheme, createTheme, type ColorVariables } from './style.ts';

export default class PixelFlux {

    divApp: HTMLDivElement;

    constructor (){

        this.divApp = document.createElement('div') as HTMLDivElement;

        this.divApp.textContent = "Hello, World!";
        this.divApp.className = 'app-container'; // Use CSS class instead of inline styles
        document.body.appendChild(this.divApp);

        // Apply default theme
        this.applyTheme('dark');
    }

    init() {
        console.log("PixelFlux initialized");

        // Example: Switch themes dynamically
        // this.applyTheme('light');
        // this.applyTheme('neon');
        // this.applyTheme('purple');
        // this.applyTheme('ocean');
    }

    /**
     * Applies a predefined theme to the application
     * @param themeName - Name of the theme ('dark', 'light', 'neon', 'purple', 'ocean')
     */
    applyTheme(themeName: string): void {
        applyNamedTheme(themeName);
    }

    /**
     * Applies a custom theme using color variables
     * @param colors - Color variables for the custom theme
     */
    applyCustomTheme(colors: ColorVariables): void {
        const customTheme = createTheme(colors);
        applyTheme(customTheme);
    }

}