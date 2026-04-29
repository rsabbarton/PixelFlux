import { applyNamedTheme, applyTheme } from '../style/styles.ts';

export default class UI {
    divApp: HTMLDivElement;

    constructor() {
        this.divApp = document.createElement('div') as HTMLDivElement;
        this.divApp.className = 'app-container'; // Use CSS class instead of inline styles
        document.body.appendChild(this.divApp);

        // Apply default theme
        applyTheme('dark');
    }

    render() {
        // Example: Render a simple button
        const button = document.createElement('button');
        button.textContent = 'Click Me';
        this.divApp.appendChild(button);
    }
}
