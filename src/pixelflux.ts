import { applyNamedTheme, applyTheme, createTheme, type ColorVariables } from './style.ts';
import { InputController, MOUSE_BUTTONS } from './modules/inputcontroller.ts';

export default class PixelFlux {

    divApp: HTMLDivElement;
    inputController: InputController;

    constructor (){

        this.divApp = document.createElement('div') as HTMLDivElement;
        this.inputController = new InputController() as InputController;

        this.divApp.textContent = "Hello, World!";
        this.divApp.className = 'app-container'; // Use CSS class instead of inline styles
        document.body.appendChild(this.divApp);

        this.inputController.onKeyPress('KeyT', () => {
            console.log("T key was released!");
        });

        this.inputController.onMouseButton(MOUSE_BUTTONS.LEFT, () => {
            console.log("Left mouse button was clicked!");
        });

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

