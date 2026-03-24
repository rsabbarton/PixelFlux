// Type definition for a theme preset
export interface ThemePreset {
    [selector: string]: {
        [property: string]: string;
    };
}

// Type definition for color variables
export interface ColorVariables {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    border: string;
}

// Global style element for dynamic CSS injection
let styleElement: HTMLStyleElement | null = null;

/**
 * Applies a theme preset by replacing all existing dynamic styles
 * @param preset - The theme preset object containing CSS rules
 */
export function applyTheme(preset: ThemePreset): void {
    // Create or get the style element
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dynamic-theme-styles';
        document.head.appendChild(styleElement);
    }

    // Convert preset object to CSS string
    const cssRules = Object.entries(preset)
        .map(([selector, rules]) => {
            const ruleString = Object.entries(rules)
                .map(([property, value]) => `    ${property}: ${value};`)
                .join('\n');
            return `${selector} {\n${ruleString}\n}`;
        })
        .join('\n\n');

    // Replace the stylesheet content
    styleElement.textContent = cssRules;
}

/**
 * Removes the current theme styles
 */
export function removeTheme(): void {
    if (styleElement) {
        styleElement.remove();
        styleElement = null;
    }
}

/**
 * Gets the current theme style element
 */
export function getThemeElement(): HTMLStyleElement | null {
    return styleElement;
}

// Base theme template that can be reused with different color variables
const baseTheme = (colors: ColorVariables): ThemePreset => ({
    'body': {
        'background-color': colors.background,
        'color': colors.text,
        'font-family': 'Arial, sans-serif'
    },
    '.app-container': {
        'background-color': colors.surface,
        'border': `1px solid ${colors.border}`,
        'padding': '20px'
    },
    'button': {
        'background-color': colors.primary,
        'color': colors.text,
        'border': 'none',
        'padding': '10px 20px',
        'cursor': 'pointer'
    },
    'button:hover': {
        'background-color': colors.secondary
    },
    'input, textarea, select': {
        'background-color': colors.surface,
        'color': colors.text,
        'border': `1px solid ${colors.border}`,
        'padding': '8px 12px'
    },
    'input:focus, textarea:focus, select:focus': {
        'outline': `2px solid ${colors.accent}`,
        'outline-offset': '2px'
    }
});

// Color variable definitions for different themes
export const colorSchemes: Record<string, ColorVariables> = {
    dark: {
        primary: '#4a4a4a',
        secondary: '#5a5a5a',
        accent: '#007bff',
        background: '#1a1a1a',
        surface: '#2d2d2d',
        text: '#ffffff',
        border: '#444444'
    },
    light: {
        primary: '#007bff',
        secondary: '#0056b3',
        accent: '#007bff',
        background: '#ffffff',
        surface: '#f5f5f5',
        text: '#000000',
        border: '#dddddd'
    },
    neon: {
        primary: '#000000',
        secondary: '#001100',
        accent: '#00ff00',
        background: '#000000',
        surface: '#001100',
        text: '#00ff00',
        border: '#00ff00'
    },
    purple: {
        primary: '#6b46c1',
        secondary: '#553c9a',
        accent: '#9f7aea',
        background: '#1a202c',
        surface: '#2d3748',
        text: '#ffffff',
        border: '#4a5568'
    },
    ocean: {
        primary: '#2b6cb0',
        secondary: '#1e4a67',
        accent: '#3182ce',
        background: '#0f1419',
        surface: '#1a202c',
        text: '#ffffff',
        border: '#2d3748'
    }
};

// Generated themes using the base template and color schemes
export const themes: Record<string, ThemePreset> = Object.fromEntries(
    Object.entries(colorSchemes).map(([name, colors]) => [name, baseTheme(colors)])
);

// Helper function to create a custom theme with color variables
export function createTheme(colors: ColorVariables): ThemePreset {
    return baseTheme(colors);
}

// Helper function to apply a theme by name
export function applyNamedTheme(themeName: string): void {
    const theme = themes[themeName];
    if (theme) {
        applyTheme(theme);
    } else {
        console.warn(`Theme "${themeName}" not found. Available themes:`, Object.keys(themes));
    }
}


