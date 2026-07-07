import { appUrl } from "../app.js";
// import { DEVPREVIEW } from "../app.js";
import { debug, log, printlog } from "./logger.js";
import { get } from "./net.ts";

export class FluxUI {
  objectArray: any[];
  fluxElement: FluxWindow | null;
  element: HTMLElement | null;
  config: any | null;
  menu: Menu | null;

  constructor() {
    this.objectArray = new Array();
    this.fluxElement = null;
    this.element = null;
    this.config = null;
    this.menu = null;

    addUIEventListeners();
    log("FluxUI constructor finished!");
  }

  init(): void {}

  createFullScreenUI() {
    this.fluxElement = new FluxWindow(FLUXTYPE_WINDOW_MAIN);
    this.element = null;
    this.config = null;
  }

  loadMenu(configUrl: string, callback: (id: string) => void) {
    this.menu = new Menu(configUrl, callback);
  }

  createWindow(
    id: string,
    title: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    var newFluxWindow = new FluxWindow(
      FLUXTYPE_WINDOW_CHILD,
      id,
      title,
      x,
      y,
      width,
      height,
    );
    this.objectArray.push(newFluxWindow);
  }

  getObjectById(id: string) {
    console.log(id);
    for (let i = 0; i < this.objectArray.length; i++) {
      if (this.objectArray[i].id == id) {
        return this.objectArray[i];
      }
    }
    console.log("end");
    return null;
  }

  showWindow(id: string) {
    var w = document.getElementById(id)!;
    w.style.display = "block";
  }

  hideWindow(id: string) {
    var w = document.getElementById(id)!;
    w.style.display = "none";
  }

  showModalMessageBox(
    title: string | undefined,
    message: string,
    callback: (arg0: boolean) => void,
  ) {
    var dimmer = document.createElement("div");
    dimmer.classList.add("flux-dimmer");

    var w = new FluxWindow(
      FLUXTYPE_WINDOW_CHILD,
      "MESSAGEBOX",
      title,
      50,
      50,
      500,
      200,
    );
    w.hideCloseX();

    var container = document.getElementById("MESSAGEBOX")!;
    container.classList.add("flux-messagebox");
    var content = document.getElementById("MESSAGEBOXCONTENT")!;
    var msg = document.createElement("div");
    msg.classList.add("flux-messageboxmessage");
    msg.innerHTML = message;

    var noButton = document.createElement("button");
    noButton.innerText = "No";
    noButton.classList.add("flux-messagenobutton");
    noButton.onclick = () => {
      callback(false);
      container.style.display = "none";
      container.remove();
      dimmer.remove();
    };

    var yesButton = document.createElement("button");
    yesButton.innerText = "OK";
    yesButton.classList.add("flux-messageyesbutton");
    yesButton.onclick = () => {
      callback(true);
      container.style.display = "none";
      container.remove();
      dimmer.remove();
    };

    content.appendChild(msg);
    //content.appendChild(noButton)
    content.appendChild(yesButton);

    document.body.appendChild(dimmer);
    container.style.display = "block";
  }

  showModalQuestionWindow(
    question: string,
    defaultAnswer: string,
    buttonYes: string,
    buttonNo: string,
    callback: (arg0: string) => void,
  ) {
    var dimmer = document.createElement("div");
    dimmer.classList.add("flux-dimmer");

    var w = new FluxWindow(
      FLUXTYPE_WINDOW_CHILD,
      "QUESTIONWINDOW",
      "",
      50,
      50,
      500,
      200,
    );
    w.hideCloseX();

    var container = document.getElementById("QUESTIONWINDOW")!;
    container.classList.add("flux-messagebox");
    var content = document.getElementById("QUESTIONWINDOWCONTENT")!;
    var msg = document.createElement("div");
    msg.classList.add("flux-messageboxmessage");
    msg.innerHTML = question;

    var answerBox = document.createElement("input");
    answerBox.type = "text";
    answerBox.value = defaultAnswer;
    answerBox.id = "QUESTIONWINDOWRESPONSE";
    answerBox.classList.add("flux-questioninput");

    var noButton = document.createElement("button");
    noButton.innerText = buttonNo;
    noButton.classList.add("flux-messagenobutton");
    noButton.onclick = () => {
      callback("");
      container.style.display = "none";
      container.remove();
      dimmer.remove();
    };

    var yesButton = document.createElement("button");
    yesButton.innerText = buttonYes;
    yesButton.classList.add("flux-messageyesbutton");
    yesButton.onclick = () => {
      callback(
        (document.getElementById("QUESTIONWINDOWRESPONSE") as HTMLInputElement)!
          .value,
      );
      container.style.display = "none";
      container.remove();
      dimmer.remove();
    };

    content.appendChild(msg);
    content.appendChild(answerBox);
    content.appendChild(noButton);
    content.appendChild(yesButton);

    document.body.appendChild(dimmer);
    container.style.display = "block";
  }

  showModalSelectionWindow(
    question: string,
    answers: string[],
    buttonYes: string,
    buttonNo: string,
    callback: (arg0: string | boolean) => void,
  ) {
    var dimmer = document.createElement("div");
    dimmer.classList.add("flux-dimmer");

    var w = new FluxWindow(
      FLUXTYPE_WINDOW_CHILD,
      "QUESTIONWINDOW",
      "",
      50,
      50,
      500,
      200,
    );
    w.hideCloseX();

    var container = document.getElementById("QUESTIONWINDOW")!;
    container.classList.add("flux-messagebox");
    var content = document.getElementById("QUESTIONWINDOWCONTENT")!;
    var msg = document.createElement("div");
    msg.classList.add("flux-messageboxmessage");
    msg.innerHTML = question;

    var answerBox = document.createElement("select");
    //answerBox.type = "text"
    //answerBox.value = defaultAnswer
    answerBox.id = "QUESTIONWINDOWRESPONSE";
    answerBox.classList.add("flux-select");

    console.log(answers);
    answers.forEach((a: string) => {
      var option = document.createElement("option");
      option.value = a;
      option.text = a;
      answerBox.appendChild(option);
    });

    var noButton = document.createElement("button");
    noButton.innerText = buttonNo;
    noButton.classList.add("flux-messagenobutton");
    noButton.onclick = () => {
      callback(false);
      container.style.display = "none";
      container.remove();
      dimmer.remove();
    };

    var yesButton = document.createElement("button");
    yesButton.innerText = buttonYes;
    yesButton.classList.add("flux-messageyesbutton");
    yesButton.onclick = () => {
      callback(
        (document.getElementById(
          "QUESTIONWINDOWRESPONSE",
        ) as HTMLSelectElement)!.value,
      );
      container.style.display = "none";
      container.remove();
      dimmer.remove();
    };

    content.appendChild(msg);
    content.appendChild(answerBox);
    content.appendChild(noButton);
    content.appendChild(yesButton);

    document.body.appendChild(dimmer);
    container.style.display = "block";
  }

  setWindowContent(id: string, html: string) {
    this.getObjectById(id)!.setWindowContent(html);
  }
  addWindowContent(id: string, html: string) {
    this.getObjectById(id)!.addWindowContent(html);
  }
  appendWindowContent(id: string, element: HTMLElement) {
    console.log(id, element);
    this.getObjectById(id)!.appendWindowContent(element);
  }

  appendToolButton(windowId: string, toolId: string, imgUrl: string) {
    var toolButton = document.createElement("div");
    toolButton.classList.add("flux-toolbarbutton");
    toolButton.id = toolId;
    toolButton.style.backgroundImage = "url(" + imgUrl + ")";
    this.objectArray.forEach((window) => {
      if (window.id == windowId) {
        window.appendWindowContent(toolButton);
      }
    });
  }

  setToolButtonSize(size: number) {
    const px = size + "px";
    var buttons = document.querySelectorAll(".flux-toolbarbutton");
    for (var i = 0; i < buttons.length; i++) {
      (buttons[i] as HTMLElement).style.width = px;
      (buttons[i] as HTMLElement).style.height = px;
    }
  }

  getWindowArrangement() {
    var arrangement: any[] = [];
    this.objectArray.forEach((o) => {
      var container = document.getElementById(o.id)!;
      var win = {
        id: o.id,
        top: container.style.top,
        left: container.style.left,
        width: container.style.width,
        height: container.style.height,
      };
      arrangement.push(win);
    });
    return arrangement;
  }

  restoreWindowArrangement(arrangement: any[]) {
    arrangement.forEach((win) => {
      var container = document.getElementById(win.id)!;
      container.style.top = win.top;
      container.style.left = win.left;
      container.style.width = win.width;
      container.style.height = win.height;
    });
  }
}

export class FluxWindow {
  objectArray: any[];
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  windowContentElement: HTMLElement | null;
  cornerDraggerUrl: string;
  closeButton!: HTMLElement;

  constructor(
    type: number,
    id: string = "",
    title: string = "",
    x: number = 0,
    y: number = 0,
    width: number = 0,
    height: number = 0,
  ) {
    this.objectArray = [];
    this.id = id;
    this.title = title;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.windowContentElement = null;
    this.cornerDraggerUrl = appUrl + "resources/icons/corner-dragger.png";
    switch (type) {
      case FLUXTYPE_WINDOW_MAIN:
        break;
      case FLUXTYPE_WINDOW_CHILD:
        this.createChildWindow(id, title, x, y, width, height);
        break;
    }
  }

  createChildWindow(
    id: string,
    title: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    var windowContainer = document.createElement("div");
    windowContainer.classList.add("flux-windowcontainer");
    windowContainer.style.display = "none";
    windowContainer.style.top = y + "px";
    windowContainer.style.left = x + "px";
    windowContainer.style.width = width + "px";
    windowContainer.style.height = height + "px";
    windowContainer.id = id;

    var titleBar = document.createElement("div");
    titleBar.classList.add("flux-windowtitlebar");
    titleBar.innerHTML = title;

    this.closeButton = document.createElement("div");
    this.closeButton.innerHTML = "x";
    this.closeButton.onclick = () => {
      windowContainer.style.display = "none";
    };
    this.closeButton.classList.add("flux-windowclosebutton");
    this.closeButton.classList.add("flux-clickable");

    var windowContent = document.createElement("div");
    windowContent.classList.add("flux-windowcontent");
    windowContent.id = id + "CONTENT";
    windowContent.style.width = "100%";
    windowContent.style.height = -26 + "px"; // Height -25 (for title bar height) and -1 for border
    this.windowContentElement = windowContent;

    var cornerDragger = new Image();
    cornerDragger.src = this.cornerDraggerUrl;
    cornerDragger.classList.add("flux-windowresizeicon");
    cornerDragger.style.right = "0px";
    cornerDragger.style.bottom = "0px";
    cornerDragger.style.position = "absolute";

    windowContainer.appendChild(titleBar);
    windowContainer.appendChild(windowContent);
    windowContainer.appendChild(cornerDragger);
    windowContainer.appendChild(this.closeButton);
    document.body.appendChild(windowContainer);
  }

  getContentElement() {
    log("Getting Content Element");
    var contentElement = this.windowContentElement;
    return contentElement;
  }

  setWindowContent(htmlString: string) {
    if (this.windowContentElement)
      this.windowContentElement.innerHTML = htmlString;
  }

  addWindowContent(htmlString: string) {
    if (this.windowContentElement)
      this.windowContentElement.innerHTML += htmlString;
  }

  appendWindowContent(htmlElement: HTMLElement) {
    if (this.windowContentElement)
      this.windowContentElement.appendChild(htmlElement);
  }

  hideCloseX() {
    this.closeButton.style.display = "none";
  }

  onResize() {
    // TODO - Add Code for onResize so that content can adjust
  }
}

class Menu {
  menuContainer: HTMLDivElement;
  onClickCallback: (id: string) => void;
  constructor(menuConfigUrl: string, onClickCallback: (id: string) => void) {
    this.menuContainer = document.createElement("div");
    this.menuContainer.classList.add("flux-menucontainer");
    //this.menuContainer.style.display = "none"
    this.menuContainer.classList.add("flux-menu");
    this.loadMenu(menuConfigUrl);
    this.onClickCallback = onClickCallback;
  }

  loadMenu(jsonUrl: string) {
    get(jsonUrl).then((json) => {
      json = JSON.parse(json);
      this.create(json as any, this.menuContainer);
      document.body.appendChild(this.menuContainer);
    });
  }

  create(
    config: {
      type: any;
      menuItems: any[];
      display: string;
      onclick: string;
      id: string;
    },
    element: HTMLDivElement,
  ) {
    switch (config.type) {
      case "MAIN":
        var main = document.createElement("div");
        main.classList.add("flux-menu");
        main.classList.add("flux-menuitem");
        element.appendChild(main);
        if (config.menuItems) {
          config.menuItems.forEach((item: any) => {
            this.create(item, main);
          });
        }
        break;
      case "MENU":
        var menu = document.createElement("div");
        menu.classList.add("flux-menu");
        menu.classList.add("flux-menuitem");
        menu.classList.add("flux-clickable");

        menu.innerHTML = config.display;
        var submenu = document.createElement("div");
        submenu.classList.add("flux-submenu");
        submenu.style.display = "none";
        menu.appendChild(submenu);
        menu.onclick = (event) => {
          if (event.target == menu) {
            var submenus: HTMLCollectionOf<HTMLDivElement> =
              document.getElementsByClassName(
                "flux-submenu",
              ) as HTMLCollectionOf<HTMLDivElement>;
            for (var i = 0; i < submenus.length; i++) {
              submenus[i].style.display = "none";
            }
            submenu.style.display = "block";
          }
        };
        submenu.onmouseleave = () => {
          submenu.style.display = "none";
        };
        element.appendChild(menu);
        if (config.menuItems) {
          config.menuItems.forEach((item: any) => {
            this.create(item, submenu);
          });
        }
        break;
      case "SUBMENU":
        var menu = document.createElement("div");
        menu.classList.add("flux-menuitem");
        menu.classList.add("flux-clickable");

        menu.innerHTML = config.display;
        var submenu = document.createElement("div");
        submenu.classList.add("flux-sidemenu");
        submenu.style.display = "none";
        menu.appendChild(submenu);
        menu.onclick = (event) => {
          if (event.target == menu) {
            submenu.style.display = "block";
          }
        };
        submenu.onmouseleave = () => {
          submenu.style.display = "none";
        };
        element.appendChild(menu);
        if (config.menuItems) {
          config.menuItems.forEach((item: any) => {
            this.create(item, submenu);
          });
        }
        break;
      case "CLICKABLE":
        var menu = document.createElement("div");
        menu.classList.add("flux-menuitem");
        menu.classList.add("flux-clickable");
        menu.innerHTML = config.display;
        menu.onclick = () => {
          this.menuClicked(config.id);
          if (menu.parentElement) {
            menu.parentElement.style.display = "none";
          }
        };
        element.appendChild(menu);
        if (config.menuItems) {
          config.menuItems.forEach((item: any) => {
            this.create(item, menu);
          });
        }
        break;
      case "FILESELECT":
        var menu = document.createElement("div");
        menu.classList.add("flux-menuitem");
        menu.classList.add("flux-clickable");
        menu.innerHTML = config.display;
        menu.onclick = () => {
          this.menuClicked(config.id);
          if (menu.parentElement) {
            menu.parentElement.style.display = "none";
          }
        };

        var fileselect = document.createElement("input");
        fileselect.type = "file";
        fileselect.id = config.id + "FILESELECT";
        fileselect.classList.add("flux-fileselect");
        menu.appendChild(fileselect);
        element.appendChild(menu);

        if (config.menuItems) {
          config.menuItems.forEach((item: any) => {
            this.create(item, menu);
          });
        }
        break;
      case "SEPARATOR":
        var menu = document.createElement("div");
        menu.classList.add("flux-menuitem");
        menu.classList.add("flux-menuseparator");
        menu.innerHTML = config.display;

        element.appendChild(menu);
        break;
    }
  }

  menuClicked(itemId: any) {
    this.onClickCallback(itemId);
  }
}

export const FLUXTYPE_WINDOW_MAIN = 0;
export const FLUXTYPE_WINDOW_CHILD = 1;
export const FLUXTYPE_BUTTON = 2;
export const FLUXTYPE_TEXT = 3;
export const FLUXTYPE_CANVAS = 4;

export const EVENT_MOUSEBUTTON_LEFT = 0;
export const EVENT_MOUSEBUTTON_RIGHT = 2;
export const EVENT_MOUSEBUTTON_MIDDLE = 1;

export function addUIEventListeners() {
  document.addEventListener("mousedown", (event) => {
    var srcElement = event.target as HTMLElement;
    if (srcElement.matches(".flux-windowtitlebar")) {
      if (srcElement.parentElement) {
        srcElement.parentElement.classList.add("flux-windowmoving");
      }
    }
    if (srcElement.matches(".flux-windowresizeicon")) {
      if (srcElement.parentElement) {
        srcElement.parentElement.classList.add("flux-windowsizing");
      }
    }
    if (srcElement.matches(".drawingcanvas")) {
      srcElement.classList.add("isdrawing");
    }
  });

  document.addEventListener("mouseup", (event) => {
    var movingWindow = document.querySelector(".flux-windowmoving");
    if (movingWindow) {
      movingWindow.classList.remove("flux-windowmoving");
    }
    var sizingWindow = document.querySelector(".flux-windowsizing");
    if (sizingWindow) {
      sizingWindow.classList.remove("flux-windowsizing");
    }
  });

  document.addEventListener("mousemove", (event) => {
    if (!debug) return;
    debug.mouseX = event.x;
    debug.mouseY = event.y;
    debug.elementX = event.layerX;
    debug.elementY = event.layerY;
    debug.srcElementId = (event.target as HTMLElement).id;
    //console.log(event)
    if (event.buttons > 0) {
      // mouse button is down
      var movingWindow = document.querySelector(
        ".flux-windowmoving",
      ) as HTMLElement;
      if (movingWindow) {
        var rect = movingWindow.getBoundingClientRect();
        var newX = rect.left + event.movementX;
        var newY = rect.top + event.movementY;
        movingWindow.style.left = newX + "px";
        movingWindow.style.top = newY + "px";
      }
      var sizingWindow = document.querySelector(
        ".flux-windowsizing",
      ) as HTMLElement;
      if (sizingWindow) {
        var rect = sizingWindow.getBoundingClientRect();
        var newX = rect.width + event.movementX;
        var newY = rect.height + event.movementY;
        sizingWindow.style.width = newX + "px";
        sizingWindow.style.height = newY + "px";
        const postEvent = new CustomEvent("fluxWindowResize", {
          detail: { srcElementId: sizingWindow.id, srcElement: sizingWindow },
        });
        document.dispatchEvent(postEvent);
      }
    }

    printlog();
  });

  document.addEventListener("click", (event) => {
    var srcElement = event.target as HTMLElement;
    if (srcElement.matches(".flux-toolbarbutton")) {
      var tools = document.querySelectorAll(".flux-toolbarbutton");
      for (var i = 0; i < tools.length; i++) {
        tools[i].classList.remove("flux-toolselected");
      }
      srcElement.classList.add("flux-toolselected");
    }
  });
}
