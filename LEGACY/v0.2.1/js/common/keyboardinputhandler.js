class KeyboardHandler {
    constructor(){
        this.keys = new Array()
        this.initKeyboardHandler()
    }

    initKeyboardHandler(){
        document.addEventListener('keydown', (event)=>{
            this.keys[event.keyCode] = true
        })
        document.addEventListener('keyup', (event)=>{
            this.keys[event.keyCode] = false
            console.log(event.keyCode)
        }) 
    }

    isDown(keyCode){
        return this.keys[keyCode]
    }
}


// DEFINE KEY EVENT Constants
const VK_CANCEL = 3;
const VK_HELP = 6;
const VK_BACK_SPACE = 8;
const VK_TAB = 9;
const VK_CLEAR = 12;
const VK_RETURN = 13;
const VK_ENTER = 14;
const VK_SHIFT = 16;
const VK_CONTROL = 17;
const VK_ALT = 18;
const VK_PAUSE = 19;
const VK_CAPS_LOCK = 20;
const VK_ESCAPE = 27;
const VK_SPACE = 32;
const VK_PAGE_UP = 33;
const VK_PAGE_DOWN = 34;
const VK_END = 35;
const VK_HOME = 36;
const VK_LEFT = 37;
const VK_UP = 38;
const VK_RIGHT = 39;
const VK_DOWN = 40;
const VK_PRINTSCREEN = 44;
const VK_INSERT = 45;
const VK_DELETE = 46;
const VK_0 = 48;
const VK_1 = 49;
const VK_2 = 50;
const VK_3 = 51;
const VK_4 = 52;
const VK_5 = 53;
const VK_6 = 54;
const VK_7 = 55;
const VK_8 = 56;
const VK_9 = 57;
const VK_SEMICOLON = 59;
const VK_EQUALS = 61;
const VK_A = 65;
const VK_B = 66;
const VK_C = 67;
const VK_D = 68;
const VK_E = 69;
const VK_F = 70;
const VK_G = 71;
const VK_H = 72;
const VK_I = 73;
const VK_J = 74;
const VK_K = 75;
const VK_L = 76;
const VK_M = 77;
const VK_N = 78;
const VK_O = 79;
const VK_P = 80;
const VK_Q = 81;
const VK_R = 82;
const VK_S = 83;
const VK_T = 84;
const VK_U = 85;
const VK_V = 86;
const VK_W = 87;
const VK_X = 88;
const VK_Y = 89;
const VK_Z = 90;
const VK_CONTEXT_MENU = 93;
const VK_NUMPAD0 = 96;
const VK_NUMPAD1 = 97;
const VK_NUMPAD2 = 98;
const VK_NUMPAD3 = 99;
const VK_NUMPAD4 = 100;
const VK_NUMPAD5 = 101;
const VK_NUMPAD6 = 102;
const VK_NUMPAD7 = 103;
const VK_NUMPAD8 = 104;
const VK_NUMPAD9 = 105;
const VK_MULTIPLY = 106;
const VK_ADD = 107;
const VK_SEPARATOR = 108;
const VK_SUBTRACT = 109;
const VK_DECIMAL = 110;
const VK_DIVIDE = 111;
const VK_F1 = 112;
const VK_F2 = 113;
const VK_F3 = 114;
const VK_F4 = 115;
const VK_F5 = 116;
const VK_F6 = 117;
const VK_F7 = 118;
const VK_F8 = 119;
const VK_F9 = 120;
const VK_F10 = 121;
const VK_F11 = 122;
const VK_F12 = 123;
const VK_F13 = 124;
const VK_F14 = 125;
const VK_F15 = 126;
const VK_F16 = 127;
const VK_F17 = 128;
const VK_F18 = 129;
const VK_F19 = 130;
const VK_F20 = 131;
const VK_F21 = 132;
const VK_F22 = 133;
const VK_F23 = 134;
const VK_F24 = 135;
const VK_NUM_LOCK = 144;
const VK_SCROLL_LOCK = 145;
const VK_COMMA = 188;
const VK_PERIOD = 190;
const VK_SLASH = 191;
const VK_BACK_QUOTE = 192;
const VK_OPEN_BRACKET = 219;
const VK_BACK_SLASH = 220;
const VK_CLOSE_BRACKET = 221;
const VK_QUOTE = 222;
const VK_META = 224;
