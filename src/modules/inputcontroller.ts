export const MOUSE_BUTTONS = {
    LEFT: 1,
    MIDDLE: 4,
    RIGHT: 2
};


export class InputController {

    keyMap: Map <string, boolean>;
    keyFunctions: Map <string, (event: KeyboardEvent) => void>;
    mousePosition: { x: number, y: number, leftButton: boolean, rightButton: boolean, middleButton: boolean };
    mouseFunctions: Map <number, (event: MouseEvent) => void>;
    mouseDownElement: HTMLElement | null;


    constructor(){
        this.keyMap = new Map();
        this.keyFunctions = new Map();
        this.mouseFunctions = new Map();
        this.mousePosition = { x: 0, y: 0, leftButton: false, rightButton: false, middleButton: false };
        this.mouseDownElement = null;

        this.initListeners();
    }

    initListeners(){
        window.onkeydown = ((event: KeyboardEvent) => {
            this.keyMap.set(event.code, true);
            console.log(`Key down: ${event.code}`);
        });
        window.onkeyup = ((event: KeyboardEvent) => {
            this.keyMap.set(event.code, false);
            const callback = this.keyFunctions.get(event.code);
            if (callback) {
                callback(event);
            }

        });
        window.onmousemove = ((event: MouseEvent) => {
            this.mousePosition.x = event.clientX;
            this.mousePosition.y = event.clientY;
            this.mousePosition.leftButton = (event.buttons & 1) === 1;
            this.mousePosition.rightButton = (event.buttons & 2) === 2;
            this.mousePosition.middleButton = (event.buttons & 4) === 4;
        });
        window.onmousedown = ((event: MouseEvent) => {
            this.mousePosition.leftButton = (event.buttons & 1) === 1;
            this.mousePosition.rightButton = (event.buttons & 2) === 2;
            this.mousePosition.middleButton = (event.buttons & 4) === 4;
            this.mouseDownElement = event.target as HTMLElement;
            console.log(event);
        });
        window.onmouseup = ((event: MouseEvent) => {
            console.log(this.mousePosition);
            this.mousePosition.leftButton = (event.buttons & 1) === 1;
            this.mousePosition.rightButton = (event.buttons & 2) === 2;
            this.mousePosition.middleButton = (event.buttons & 4) === 4;
            const callback = this.mouseFunctions.get(event.buttons);
            
            if (callback && event.target === this.mouseDownElement) {
                callback(event);
            }
        }); 

    }

    getKeyState(key: string): boolean {
        return this.keyMap.get(key) as boolean;
    } 
    getMouseButtonState(button: number): boolean {
        switch (button) {
            case MOUSE_BUTTONS.LEFT:
                return this.mousePosition.leftButton;
            case MOUSE_BUTTONS.RIGHT:
                return this.mousePosition.rightButton;
            case MOUSE_BUTTONS.MIDDLE:
                return this.mousePosition.middleButton;
            default:
                return false;
        }
    }

    onMouseButton(button: number, callback: (event: MouseEvent) => void): void {
        this.mouseFunctions.set(button, callback);
    }

    onKeyPress(key: string, callback: (event: KeyboardEvent) => void): void {
        this.keyFunctions.set(key, callback);
    }


    getMousePosition(): { x: number, y: number } {
        return this.mousePosition;
    }

}