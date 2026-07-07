//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/js/common/loadinganimation.js
var logo1 = document.createElement("img");
var logo2 = document.createElement("img");
var logocontainer = document.createElement("div");
var showingLoadingAnimation = false;
var loadingMessage = "Loading...";
var loadingMessageElement = document.createElement("div");
loadingMessageElement.innerHTML = loadingMessage;
logocontainer.appendChild(loadingMessageElement);
function showLoadingAnimation() {
	logo1.src = appUrl + "resources/icons/loading-clockwise.png";
	logo2.src = appUrl + "resources/icons/loading-anticlockwise.png";
	console.log(appUrl);
	console.log(logo1.src);
	console.log(logo2.src);
	logocontainer.style.width = window.innerWidth + "px";
	logocontainer.style.height = window.innerHeight + "px";
	logocontainer.style.position = "absolute";
	logocontainer.style.top = "0px";
	logocontainer.style.left = "0px";
	logocontainer.style.backgroundColor = "darkslategray";
	logocontainer.style.color = "orange";
	logocontainer.style.fontSize = "20px";
	logocontainer.style.fontFamily = "monospace";
	logocontainer.style.textAlign = "center";
	logocontainer.style.paddingTop = window.innerHeight / 2 + 64 + "px";
	logocontainer.style.pointerEvents = "none";
	logocontainer.style.userSelect = "none";
	logocontainer.style.cursor = "wait";
	logocontainer.style.zIndex = "50";
	logocontainer.style.opacity = "0.9";
	updateLogoRotation();
	showingLoadingAnimation = true;
	document.body.appendChild(logocontainer);
	document.body.appendChild(logo1);
	document.body.appendChild(logo2);
	updateLogoRotation();
}
function updateLogoRotation() {
	logo1.style.position = "absolute";
	logo1.style.left = window.innerWidth / 2 - logo1.width / 2 + "px";
	logo1.style.top = window.innerHeight / 2 - logo1.height / 2 + "px";
	logo1.style.transform = "rotate(" + Date.now() / 2 / 1e3 + "turn)";
	logo1.style.zIndex = "90";
	logo2.style.position = "absolute";
	logo2.style.left = window.innerWidth / 2 - logo2.width / 2 + "px";
	logo2.style.top = window.innerHeight / 2 - logo2.height / 2 + "px";
	logo2.style.transform = "rotate(" + Date.now() / -2 / 1e3 + "turn)";
	logo2.style.zIndex = "100";
	loadingMessageElement.style.opacity = .5 + .5 * Math.sin(Date.now() / 1e3);
	if (showingLoadingAnimation) setTimeout(updateLogoRotation, 1e3 / 60);
}
function hideLoadingAnimation() {
	logocontainer.remove();
	logo1.remove();
	logo2.remove();
}
//#endregion
//#region src/js/common/logger.js
var debug = {
	mouseX: 0,
	mouseY: 0,
	layerX: 0,
	layerY: 0,
	elementX: 0,
	elementY: 0,
	srcElementId: "",
	counter: 0,
	mSize: 0,
	mUsed: 0,
	mMax: 0,
	events: ["DEBUG STARTED", "Use LOG(string) to log information here..."]
};
function log(str) {
	var entry = Date.now() + " - " + str;
	debug.events.push(entry);
	printlog();
	if (DEVPREVIEW) console.log(entry);
}
function printlog() {
	var out = "Mouse position: " + debug.mouseX + "," + debug.mouseY + " - src: " + debug.srcElementId + " - Elem Coords: " + debug.elementX + "," + debug.elementY + "<br>Layer position: " + debug.layerX + "," + debug.layerY + " - Debug Counter: " + debug.counter + "<br>Memory Total: " + debug.mSize + " - Memory Used: " + debug.mUsed + "<br>";
	var evtlog = "";
	debug.events.forEach((evt) => {
		evtlog = evt + "<br>" + evtlog;
	});
	var dst = document.getElementById("FLUXDEBUGINFO");
	if (dst) dst.innerHTML = out + evtlog;
}
//#endregion
//#region src/js/common/net.ts
function get$1(url) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.send(null);
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) resolve(xhr.responseText);
		};
		xhr.onerror = () => {
			reject(/* @__PURE__ */ new Error("Network request failed"));
		};
	});
}
//#endregion
//#region src/js/common/fluxui.ts
var FluxUI = class {
	objectArray;
	fluxElement;
	element;
	config;
	menu;
	constructor() {
		this.objectArray = new Array();
		this.fluxElement = null;
		this.element = null;
		this.config = null;
		this.menu = null;
		addUIEventListeners();
		log("FluxUI constructor finished!");
	}
	init() {}
	createFullScreenUI() {
		this.fluxElement = new FluxWindow(0);
		this.element = null;
		this.config = null;
	}
	loadMenu(configUrl, callback) {
		this.menu = new Menu(configUrl, callback);
	}
	createWindow(id, title, x, y, width, height) {
		var newFluxWindow = new FluxWindow(1, id, title, x, y, width, height);
		this.objectArray.push(newFluxWindow);
	}
	getObjectById(id) {
		console.log(id);
		for (let i = 0; i < this.objectArray.length; i++) if (this.objectArray[i].id == id) return this.objectArray[i];
		console.log("end");
		return null;
	}
	showWindow(id) {
		var w = document.getElementById(id);
		w.style.display = "block";
	}
	hideWindow(id) {
		var w = document.getElementById(id);
		w.style.display = "none";
	}
	showModalMessageBox(title, message, callback) {
		var dimmer = document.createElement("div");
		dimmer.classList.add("flux-dimmer");
		new FluxWindow(1, "MESSAGEBOX", title, 50, 50, 500, 200).hideCloseX();
		var container = document.getElementById("MESSAGEBOX");
		container.classList.add("flux-messagebox");
		var content = document.getElementById("MESSAGEBOXCONTENT");
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
		content.appendChild(yesButton);
		document.body.appendChild(dimmer);
		container.style.display = "block";
	}
	showModalQuestionWindow(question, defaultAnswer, buttonYes, buttonNo, callback) {
		var dimmer = document.createElement("div");
		dimmer.classList.add("flux-dimmer");
		new FluxWindow(1, "QUESTIONWINDOW", "", 50, 50, 500, 200).hideCloseX();
		var container = document.getElementById("QUESTIONWINDOW");
		container.classList.add("flux-messagebox");
		var content = document.getElementById("QUESTIONWINDOWCONTENT");
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
			callback(document.getElementById("QUESTIONWINDOWRESPONSE").value);
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
	showModalSelectionWindow(question, answers, buttonYes, buttonNo, callback) {
		var dimmer = document.createElement("div");
		dimmer.classList.add("flux-dimmer");
		new FluxWindow(1, "QUESTIONWINDOW", "", 50, 50, 500, 200).hideCloseX();
		var container = document.getElementById("QUESTIONWINDOW");
		container.classList.add("flux-messagebox");
		var content = document.getElementById("QUESTIONWINDOWCONTENT");
		var msg = document.createElement("div");
		msg.classList.add("flux-messageboxmessage");
		msg.innerHTML = question;
		var answerBox = document.createElement("select");
		answerBox.id = "QUESTIONWINDOWRESPONSE";
		answerBox.classList.add("flux-select");
		console.log(answers);
		answers.forEach((a) => {
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
			callback(document.getElementById("QUESTIONWINDOWRESPONSE").value);
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
	setWindowContent(id, html) {
		this.getObjectById(id).setWindowContent(html);
	}
	addWindowContent(id, html) {
		this.getObjectById(id).addWindowContent(html);
	}
	appendWindowContent(id, element) {
		console.log(id, element);
		this.getObjectById(id).appendWindowContent(element);
	}
	appendToolButton(windowId, toolId, imgUrl) {
		var toolButton = document.createElement("div");
		toolButton.classList.add("flux-toolbarbutton");
		toolButton.id = toolId;
		toolButton.style.backgroundImage = "url(" + imgUrl + ")";
		this.objectArray.forEach((window) => {
			if (window.id == windowId) window.appendWindowContent(toolButton);
		});
	}
	setToolButtonSize(size) {
		const px = size + "px";
		var buttons = document.querySelectorAll(".flux-toolbarbutton");
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].style.width = px;
			buttons[i].style.height = px;
		}
	}
	getWindowArrangement() {
		var arrangement = [];
		this.objectArray.forEach((o) => {
			var container = document.getElementById(o.id);
			var win = {
				id: o.id,
				top: container.style.top,
				left: container.style.left,
				width: container.style.width,
				height: container.style.height
			};
			arrangement.push(win);
		});
		return arrangement;
	}
	restoreWindowArrangement(arrangement) {
		arrangement.forEach((win) => {
			var container = document.getElementById(win.id);
			container.style.top = win.top;
			container.style.left = win.left;
			container.style.width = win.width;
			container.style.height = win.height;
		});
	}
};
var FluxWindow = class {
	objectArray;
	id;
	title;
	x;
	y;
	width;
	height;
	windowContentElement;
	cornerDraggerUrl;
	closeButton;
	constructor(type, id = "", title = "", x = 0, y = 0, width = 0, height = 0) {
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
			case 0: break;
			case 1:
				this.createChildWindow(id, title, x, y, width, height);
				break;
		}
	}
	createChildWindow(id, title, x, y, width, height) {
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
		windowContent.style.height = "-26px";
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
		return this.windowContentElement;
	}
	setWindowContent(htmlString) {
		if (this.windowContentElement) this.windowContentElement.innerHTML = htmlString;
	}
	addWindowContent(htmlString) {
		if (this.windowContentElement) this.windowContentElement.innerHTML += htmlString;
	}
	appendWindowContent(htmlElement) {
		if (this.windowContentElement) this.windowContentElement.appendChild(htmlElement);
	}
	hideCloseX() {
		this.closeButton.style.display = "none";
	}
	onResize() {}
};
var Menu = class {
	menuContainer;
	onClickCallback;
	constructor(menuConfigUrl, onClickCallback) {
		this.menuContainer = document.createElement("div");
		this.menuContainer.classList.add("flux-menucontainer");
		this.menuContainer.classList.add("flux-menu");
		this.loadMenu(menuConfigUrl);
		this.onClickCallback = onClickCallback;
	}
	loadMenu(jsonUrl) {
		get$1(jsonUrl).then((json) => {
			json = JSON.parse(json);
			this.create(json, this.menuContainer);
			document.body.appendChild(this.menuContainer);
		});
	}
	create(config, element) {
		switch (config.type) {
			case "MAIN":
				var main = document.createElement("div");
				main.classList.add("flux-menu");
				main.classList.add("flux-menuitem");
				element.appendChild(main);
				if (config.menuItems) config.menuItems.forEach((item) => {
					this.create(item, main);
				});
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
						var submenus = document.getElementsByClassName("flux-submenu");
						for (var i = 0; i < submenus.length; i++) submenus[i].style.display = "none";
						submenu.style.display = "block";
					}
				};
				submenu.onmouseleave = () => {
					submenu.style.display = "none";
				};
				element.appendChild(menu);
				if (config.menuItems) config.menuItems.forEach((item) => {
					this.create(item, submenu);
				});
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
					if (event.target == menu) submenu.style.display = "block";
				};
				submenu.onmouseleave = () => {
					submenu.style.display = "none";
				};
				element.appendChild(menu);
				if (config.menuItems) config.menuItems.forEach((item) => {
					this.create(item, submenu);
				});
				break;
			case "CLICKABLE":
				var menu = document.createElement("div");
				menu.classList.add("flux-menuitem");
				menu.classList.add("flux-clickable");
				menu.innerHTML = config.display;
				menu.onclick = () => {
					this.menuClicked(config.id);
					if (menu.parentElement) menu.parentElement.style.display = "none";
				};
				element.appendChild(menu);
				if (config.menuItems) config.menuItems.forEach((item) => {
					this.create(item, menu);
				});
				break;
			case "FILESELECT":
				var menu = document.createElement("div");
				menu.classList.add("flux-menuitem");
				menu.classList.add("flux-clickable");
				menu.innerHTML = config.display;
				menu.onclick = () => {
					this.menuClicked(config.id);
					if (menu.parentElement) menu.parentElement.style.display = "none";
				};
				var fileselect = document.createElement("input");
				fileselect.type = "file";
				fileselect.id = config.id + "FILESELECT";
				fileselect.classList.add("flux-fileselect");
				menu.appendChild(fileselect);
				element.appendChild(menu);
				if (config.menuItems) config.menuItems.forEach((item) => {
					this.create(item, menu);
				});
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
	menuClicked(itemId) {
		this.onClickCallback(itemId);
	}
};
function addUIEventListeners() {
	document.addEventListener("mousedown", (event) => {
		var srcElement = event.target;
		if (srcElement.matches(".flux-windowtitlebar")) {
			if (srcElement.parentElement) srcElement.parentElement.classList.add("flux-windowmoving");
		}
		if (srcElement.matches(".flux-windowresizeicon")) {
			if (srcElement.parentElement) srcElement.parentElement.classList.add("flux-windowsizing");
		}
		if (srcElement.matches(".drawingcanvas")) srcElement.classList.add("isdrawing");
	});
	document.addEventListener("mouseup", (event) => {
		var movingWindow = document.querySelector(".flux-windowmoving");
		if (movingWindow) movingWindow.classList.remove("flux-windowmoving");
		var sizingWindow = document.querySelector(".flux-windowsizing");
		if (sizingWindow) sizingWindow.classList.remove("flux-windowsizing");
	});
	document.addEventListener("mousemove", (event) => {
		if (!debug) return;
		debug.mouseX = event.x;
		debug.mouseY = event.y;
		debug.elementX = event.layerX;
		debug.elementY = event.layerY;
		debug.srcElementId = event.target.id;
		if (event.buttons > 0) {
			var movingWindow = document.querySelector(".flux-windowmoving");
			if (movingWindow) {
				var rect = movingWindow.getBoundingClientRect();
				var newX = rect.left + event.movementX;
				var newY = rect.top + event.movementY;
				movingWindow.style.left = newX + "px";
				movingWindow.style.top = newY + "px";
			}
			var sizingWindow = document.querySelector(".flux-windowsizing");
			if (sizingWindow) {
				var rect = sizingWindow.getBoundingClientRect();
				var newX = rect.width + event.movementX;
				var newY = rect.height + event.movementY;
				sizingWindow.style.width = newX + "px";
				sizingWindow.style.height = newY + "px";
				const postEvent = new CustomEvent("fluxWindowResize", { detail: {
					srcElementId: sizingWindow.id,
					srcElement: sizingWindow
				} });
				document.dispatchEvent(postEvent);
			}
		}
		printlog();
	});
	document.addEventListener("click", (event) => {
		var srcElement = event.target;
		if (srcElement.matches(".flux-toolbarbutton")) {
			var tools = document.querySelectorAll(".flux-toolbarbutton");
			for (var i = 0; i < tools.length; i++) tools[i].classList.remove("flux-toolselected");
			srcElement.classList.add("flux-toolselected");
		}
	});
}
//#endregion
//#region src/js/common/misc.js
var rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map((n) => parseInt(n, 10).toString(16).padStart(2, "0")).join("")}`;
var rgb2intArray = (rgb) => rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map((n) => n);
var n255 = (n) => {
	return n * (1 / 255);
};
var rand = (max) => {
	return Math.floor(Math.random() * max);
};
function hex2rgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}
function hex2rgba(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16),
		a: 255
	} : null;
}
function bound$1(num, min, max) {
	if (num < min) return min;
	if (num > max) return max;
	return num;
}
function download(dataurl, filename) {
	const link = document.createElement("a");
	link.href = dataurl;
	link.download = filename;
	link.click();
}
//#endregion
//#region src/js/common/keyboardinputhandler.js
var KeyboardHandler = class {
	constructor() {
		this.keys = new Array();
		this.initKeyboardHandler();
	}
	initKeyboardHandler() {
		document.addEventListener("keydown", (event) => {
			this.keys[event.keyCode] = true;
		});
		document.addEventListener("keyup", (event) => {
			this.keys[event.keyCode] = false;
		});
	}
	isDown(keyCode) {
		return this.keys[keyCode];
	}
};
//#endregion
//#region src/js/common/sprite.js
var Sprite = class Sprite {
	constructor(width, height) {
		this.isSprite = true;
		this.width = width;
		this.height = height;
		this.name = "";
		this.nameSet = false;
		this.frames = new Array();
		this.frames[0] = new Frame(width, height);
		this.currentFrame = 0;
		this.canvas = document.createElement("canvas");
		this.canvas.width = width;
		this.canvas.height = height;
		this.context = this.canvas.getContext("2d", { willReadFrequently: true });
		this.history = new Array();
		this.redoArray = new Array();
		this.fps = 12;
		this.spriteSheetCanvas = null;
	}
	setFramerate(fps) {
		if (fps > 0 && fps <= 60) this.fps = fps;
		else console.log(`Selected Framerate (${fps}) not valid`);
		return this.fps;
	}
	addFrame() {
		var frame = new Frame(this.width, this.height);
		this.frames.push(frame);
		this.currentFrame = this.frames.length - 1;
		this.updateCanvasChain();
	}
	setCurrentFrame(n) {
		this.currentFrame = bound$1(n, 0, this.frames.length - 1);
	}
	selectNextFrame() {
		var f = this.currentFrame + 1;
		if (f > this.frames.length - 1) f = 0;
		this.currentFrame = f;
		this.updateCanvasChain();
	}
	selectPreviousFrame() {
		var f = this.currentFrame - 1;
		if (f < 0) f = this.frames.length - 1;
		this.currentFrame = f;
		this.updateCanvasChain();
	}
	insertFrameAfterCurrent() {
		var p = this.currentFrame + 1;
		var frame = new Frame(this.width, this.height);
		this.frames.splice(p, 0, frame);
		this.currentFrame = p;
		this.updateCanvasChain();
	}
	insertFrameBeforeCurrent() {
		var p = this.currentFrame;
		var frame = new Frame(this.width, this.height);
		this.frames.splice(p, 0, frame);
		this.currentFrame = p;
		this.updateCanvasChain();
	}
	insertFrameAfter(n) {
		var currentFrame = this.currentFrame;
		this.currentFrame = n;
		this.insertFrameAfterCurrent();
		this.currentFrame = currentFrame;
	}
	copyFrame(n) {
		var currentFrame = this.currentFrame;
		this.currentFrame = n;
		this.insertFrameAfterCurrent();
		this.frames[this.currentFrame].copyFromFrame(this.frames[n]);
		this.currentFrame = currentFrame;
		this.updateCanvasChain();
	}
	moveFrameForward(n) {
		var frame = this.frames.splice(n, 1);
		this.frames.splice(n + 1, 0, frame[0]);
		this.updateCanvasChain();
	}
	moveFrameBackward(n) {
		var frame = this.frames.splice(n, 1);
		this.frames.splice(n - 1, 0, frame[0]);
		this.updateCanvasChain();
	}
	deleteFrame(n) {
		this.frames.splice(n, 1);
		this.currentFrame = bound$1(this.currentFrame, 0, this.frames.length - 1);
		this.updateCanvasChain();
	}
	setCurrentLayer(n) {
		if (pixelFlux$1.preferences.preserveLayerContinuity) this.frames.forEach((f) => {
			f.setCurrentLayer(n);
		});
		else this.frames[this.currentFrame].setCurrentLayer(n);
	}
	addLayer() {
		this.frames[this.currentFrame].addLayer();
	}
	addLayerAllFrames() {
		this.frames.forEach((frame) => {
			frame.addLayer();
		});
	}
	replicateCurrentLayer() {
		let currentLayerId = this.getCurrentFrame().currentLayer;
		let currentFrameId = this.currentFrame;
		let currentLayer = this.getCurrentFrame().getCurrentLayer();
		this.frames.forEach((f, i, a) => {
			console.log(f, i, a);
			if (i != currentFrameId) {
				console.log("copying to frame", i);
				f.layers[currentLayerId].copyFromLayer(currentLayer);
				f.updateCanvasChain();
				this.updateCanvasChain();
			}
		});
	}
	setLayerNameAllFrames(layerIndex, name) {
		this.frames.forEach((frame) => {
			frame.layers[layerIndex].name = name;
		});
	}
	setLayerVisible(layerId, visible) {
		this.frames.forEach((f) => {
			f.layers[layerId].visible = visible;
			f.layers[layerId].updateCanvas();
			f.updateCanvasChain();
		});
		this.updateCanvasChain();
		pixelFlux$1.updateCanvasAndPreview();
	}
	nextLayerUp() {
		this.frames[this.currentFrame].nextLayer(1);
	}
	nextLayerDown() {
		this.frames[this.currentFrame].nextLayer(-1);
	}
	lockLayer(n) {
		if (pixelFlux$1.preferences.preserveLayerContinuity) this.frames.forEach((f) => {
			f.layers[n].lock();
		});
		else this.frames[this.currentFrame].layers[n].lock();
	}
	unlockLayer(n) {
		if (pixelFlux$1.preferences.preserveLayerContinuity) this.frames.forEach((f) => {
			f.layers[n].unlock();
		});
		else this.frames[this.currentFrame].layers[n].unlock();
	}
	clearLayer(i) {
		this.frames[this.currentFrame].clearLayer(i);
		this.pushToUndoHistory();
	}
	moveLayerDown(n) {
		if (pixelFlux$1.preferences.preserveLayerContinuity) this.frames.forEach((f) => {
			f.moveLayerDown(n);
		});
		else this.frames[this.currentFrame].moveLayerDown(n);
	}
	moveLayerUp(n) {
		if (pixelFlux$1.preferences.preserveLayerContinuity) this.frames.forEach((f) => {
			f.moveLayerUp(n);
		});
		else this.frames[this.currentFrame].moveLayerUp(n);
	}
	mergeLayerDown(n) {
		if (pixelFlux$1.preferences.preserveLayerContinuity) this.frames.forEach((f) => {
			f.mergeLayerDown(n);
		});
		else this.frames[this.currentFrame].mergeLayerDown(n);
	}
	moveLayerUp(n) {
		if (pixelFlux$1.preferences.preserveLayerContinuity) this.frames.forEach((f) => {
			f.moveLayerUp(n);
		});
		else this.frames[this.currentFrame].moveLayerUp(n);
	}
	moveLayerDown(n) {
		if (pixelFlux$1.preferences.preserveLayerContinuity) this.frames.forEach((f) => {
			f.moveLayerDown(n);
		});
		else this.frames[this.currentFrame].moveLayerDown(n);
	}
	deleteLayer(n) {
		log("Deleting Layer: " + n);
		if (pixelFlux$1.preferences.preserveLayerContinuity) this.frames.forEach((f) => {
			f.deleteLayer(n);
		});
		else this.frames[this.currentFrame].deleteLayer(n);
	}
	setPixelRGBA(x, y, r, g, b, a) {
		this.frames[this.currentFrame].setPixelRGBA(x, y, r, g, b, a);
		this.updateCanvas();
	}
	getPixelRGBA(x, y) {
		return this.frames[this.currentFrame].getPixelRGBA(x, y);
	}
	setPixelHex(x, y, col, a) {
		this.frames[this.currentFrame].setPixelHex(x, y, col, a);
		this.updateCanvas();
	}
	setPixelHexInterim(x, y, col, a) {
		this.frames[this.currentFrame].setPixelHexInterim(x, y, col, a);
		this.updateCanvas();
	}
	reducePixelAlpha(x, y, amt) {
		this.frames[this.currentFrame].reducePixelAlpha(x, y, amt);
		this.updateCanvas();
	}
	randomise() {
		this.frames[this.currentFrame].randomise();
		this.updateCanvas();
	}
	clearCanvas() {
		this.context.clearRect(0, 0, this.width, this.height);
	}
	updateCanvas() {
		this.clearCanvas();
		this.frames[this.currentFrame].drawToCanvas(this.context, 0, 0);
	}
	drawToCanvasId(id, x, y, scale) {
		this.updateCanvas();
		document.getElementById(id).getContext("2d", { willReadFrequently: true }).drawImage(this.canvas, 0, 0, this.width, this.height, 0, 0, this.width * scale, this.height * scale);
	}
	drawAnimationToCanvasId(id, x, y, scale) {
		var canvas = document.getElementById(id);
		var ctx = canvas.getContext("2d");
		ctx.imageSmoothingEnabled = false;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		var fps = this.fps;
		var epochm = Date.now();
		var n = this.frames.length;
		var interval = 1e3 / fps;
		var runtime = interval * n;
		var frameNumber = Math.floor(epochm % runtime / interval);
		ctx.drawImage(this.frames[frameNumber].canvas, 0, 0, this.width, this.height, x, y, this.width * scale, this.height * scale);
	}
	getCurrentCanvasContext() {
		return this.frames[this.currentFrame].getCurrentCanvasContext();
	}
	getCurrentFrame() {
		return this.frames[this.currentFrame];
	}
	updateCanvasChain() {
		this.frames[this.currentFrame].updateCanvasChain();
		this.updateCanvas();
	}
	updateCurrentLayerCanvas() {
		this.frames[this.currentFrame].updateCurrentLayerCanvas();
	}
	updateCurrentLayerPixelArray() {
		this.frames[this.currentFrame].updateCurrentLayerPixelArray();
	}
	updateSpriteSheetCanvas() {
		var w = this.width;
		var h = this.height;
		var f = this.frames.length;
		this.spriteSheetCanvas = document.createElement("canvas");
		this.spriteSheetCanvas.width = w * f;
		this.spriteSheetCanvas.height = h;
		var ctx = this.spriteSheetCanvas.getContext("2d", { willReadFrequently: true });
		this.updateCanvasChain();
		var i = 0;
		this.frames.forEach((frame) => {
			var x = w * i;
			ctx.drawImage(frame.canvas, 0, 0, w, h, x, 0, w, h);
			i++;
		});
	}
	loadFromSprite(source) {
		this.width = source.width;
		this.height = source.height;
		this.canvas = document.createElement("canvas");
		this.canvas.width = source.width;
		this.canvas.height = source.height;
		this.context = this.canvas.getContext("2d", { willReadFrequently: true });
		this.name = source.name;
		this.frames = new Array();
		this.currentFrame = 0;
		for (var f = 0; f < source.frames.length; f++) {
			var frame = new Frame(this.width, this.height);
			this.frames.push(frame);
			this.frames[f].layers = new Array();
			for (var l = 0; l < source.frames[f].layers.length; l++) {
				var layer = new Layer(this.width, this.height);
				this.frames[f].layers.push(layer);
				this.frames[f].layers[l].name = source.frames[f].layers[l].name;
				this.frames[f].layers[l].visible = source.frames[f].layers[l].visible;
				for (var p = 0; p < source.frames[f].layers[l].pixels.length; p++) {
					this.frames[f].layers[l].pixels[p].red = source.frames[f].layers[l].pixels[p].red;
					this.frames[f].layers[l].pixels[p].green = source.frames[f].layers[l].pixels[p].green;
					this.frames[f].layers[l].pixels[p].blue = source.frames[f].layers[l].pixels[p].blue;
					this.frames[f].layers[l].pixels[p].alpha = source.frames[f].layers[l].pixels[p].alpha;
				}
				this.frames[f].layers[l].updateCanvas();
			}
			this.frames[f].updateCanvas();
		}
		this.updateCanvas();
	}
	loadFromDataURL(dataURL, callback) {
		const sprite = this;
		var image = new Image();
		image.src = dataURL;
		image.onload = () => {
			sprite.frames[sprite.currentFrame].addLayer();
			sprite.getCurrentCanvasContext().drawImage(image, 0, 0, image.width, image.height, 0, 0, sprite.width, sprite.height);
			sprite.updateCurrentLayerPixelArray();
			sprite.updateCanvasChain();
			callback();
		};
	}
	exportPixelArray() {
		var pa = new Array();
		for (var i = 0; i < this.pixelArray.length; i++) pa.push(this.pixelArray[i].getRGBAArray());
		return pa;
	}
	importPixelArray(pa, width, height) {
		this.width = width;
		this.height = height;
		this.initCanvas();
		this.initPixelArray();
		for (var i = 0; i < width * height; i++) this.pixelArray[i].setColour(pa[i][0], pa[i][1], pa[i][2], pa[i][3]);
		this.updateInternalCanvas();
	}
	pushToUndoHistory() {
		var s = new Sprite(this.width, this.height);
		s.loadFromSprite(this);
		this.history.push(s);
		this.redoArray = new Array();
		if (this.history.length > pixelFlux$1.preferences.undoHistorySize) this.history = this.history.slice(-pixelFlux$1.preferences.undoHistorySize, this.history.length);
	}
	undo() {
		if (this.history.length > 0) {
			var r = new Sprite(this.width, this.height);
			r.loadFromSprite(this);
			this.redoArray.push(r);
			var h = this.history.pop();
			this.loadFromSprite(h);
			this.updateCanvasChain();
		}
	}
	redo() {
		if (this.redoArray.length > 0) {
			var r = this.redoArray.pop();
			var s = new Sprite(this.width, this.height);
			s.loadFromSprite(this);
			this.history.push(s);
			this.loadFromSprite(r);
			this.updateCanvasChain();
		}
	}
};
var Frame = class {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.layers = new Array();
		this.layers[0] = new Layer(width, height);
		this.layers[0].name = "LAYER 0";
		this.currentLayer = 0;
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d", { willReadFrequently: true });
	}
	setCurrentLayer(n) {
		if (n > this.layers.length - 1) n = this.layers.length - 1;
		if (n < 0) n = 0;
		this.currentLayer = n;
	}
	getCurrentLayer() {
		return this.layers[this.currentLayer];
	}
	reInitCanvas() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.context = this.canvas.getContext("2d", { willReadFrequently: true });
		this.updateCanvas();
	}
	addLayer() {
		var layer = new Layer(this.width, this.height);
		layer.name = "LAYER " + this.layers.length.toString();
		this.layers.push(layer);
		this.currentLayer = this.layers.length - 1;
		log("New Layer Added... " + this.layers.length + " layers in this frame");
	}
	nextLayer(n) {
		this.currentLayer += n;
		if (this.currentLayer > this.layers.length - 1) this.currentLayer = 0;
		if (this.currentLayer < 0) this.currentLayer = this.layers.length - 1;
		log("Current Layer is: " + this.currentLayer);
	}
	clearCurrentLayer() {
		this.layers[this.currentLayer].clear();
		this.updateCanvas();
	}
	clearLayer(i) {
		this.layers[i].clear();
	}
	deleteLayer(i) {
		this.layers.splice(i, 1);
	}
	moveLayerUp(n) {
		var layer = this.layers.splice(n, 1);
		this.layers.splice(n + 1, 0, layer[0]);
		this.updateCanvas();
	}
	moveLayerDown(n) {
		var layer = this.layers.splice(n, 1);
		this.layers.splice(n - 1, 0, layer[0]);
		this.updateCanvas();
	}
	setPixelRGBA(x, y, r, g, b, a) {
		this.layers[this.currentLayer].setPixelRGBA(x, y, r, g, b, a);
		this.updateCanvas();
	}
	getPixelRGBA(x, y) {
		return this.layers[this.currentLayer].getPixelRGBA(x, y);
	}
	setPixelHex(x, y, col, a) {
		this.layers[this.currentLayer].setPixelHex(x, y, col, a);
		this.updateCanvas();
	}
	setPixelHexInterim(x, y, col, a) {
		this.layers[this.currentLayer].setPixelHexInterim(x, y, col, a);
		this.updateCanvas();
	}
	reducePixelAlpha(x, y, amt) {
		this.layers[this.currentLayer].reducePixelAlpha(x, y, amt);
		this.updateCanvas();
	}
	randomise() {
		this.layers[this.currentLayer].randomise();
		this.updateCanvas();
	}
	clearCanvas() {
		this.context.clearRect(0, 0, this.width, this.height);
	}
	copyFromFrame(src) {
		this.layers = new Array();
		for (var l = 0; l < src.layers.length; l++) {
			var layer = new Layer(src.width, src.height);
			this.layers.push(layer);
			this.layers[l].copyFromLayer(src.layers[l]);
		}
		this.updateCanvas();
	}
	updateCanvas() {
		this.clearCanvas();
		this.layers.forEach((layer) => {
			if (layer.visible) this.context.drawImage(layer.canvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
		});
	}
	updateCanvasChain() {
		this.updateCanvas();
	}
	updateCurrentLayerCanvas() {
		this.layers[this.currentLayer].updateCanvas();
	}
	updateCurrentLayerPixelArray() {
		this.layers[this.currentLayer].updatePixelArray();
	}
	drawToCanvas(context, x, y) {
		context.drawImage(this.canvas, 0, 0, this.width, this.height, x, y, this.width, this.height);
	}
	getCurrentCanvasContext() {
		return this.layers[this.currentLayer].context;
	}
	mergeLayerDown(n) {
		this.layers[n].mergeInto(this.layers[n - 1]);
		this.deleteLayer(n);
	}
};
var Layer = class {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.name = "";
		this.visible = true;
		this.locked = false;
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d", { willReadFrequently: true });
		this.pixels = new Array();
		this.initPixelArray();
	}
	initPixelArray() {
		this.pixels = new Array();
		for (var i = 0; i < this.width * this.height; i++) {
			var p = new Pixel();
			this.pixels.push(p);
		}
	}
	show() {
		this.visible = true;
		this.updateCanvas();
	}
	hide() {
		this.visible = false;
		this.updateCanvas();
	}
	toggleVisible() {
		this.visible = !this.visible;
		this.updateCanvas();
	}
	lock() {
		this.locked = true;
	}
	unlock() {
		this.locked = false;
	}
	toggleLocked() {
		this.locked = !this.locked;
	}
	clear() {
		if (this.locked) return;
		for (var i = 0; i < this.pixels.length; i++) this.pixels[i].setRGBA(0, 0, 0, 0);
		this.updateCanvas();
	}
	copyFromLayer(src) {
		if (this.locked) return;
		for (var i = 0; i < src.width * src.height; i++) this.pixels[i].copyFromPixel(src.pixels[i]);
		this.name = src.name;
		this.updateCanvas();
	}
	mergeInto(destination) {
		this.updateCanvas();
		destination.updateCanvas();
		destination.context.drawImage(this.canvas, 0, 0);
		destination.updatePixelArray();
	}
	setPixelRGBA(x, y, r, g, b, a) {
		if (this.locked) return;
		var i = y * this.width + x;
		this.pixels[i].setColour(r, g, b, a);
		this.pixels[i].drawToCanvas(this.context, x, y);
	}
	getPixelRGBA(x, y) {
		x = bound$1(x, 0, this.width - 1);
		y = bound$1(y, 0, this.height - 1);
		var i = y * this.width + x;
		return this.pixels[i].getRGBA();
	}
	getPixel(x, y) {
		return this.pixels[y * this.width + x];
	}
	setPixelHex(x, y, col, a) {
		if (this.locked) return;
		if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) return;
		var i = y * this.width + x;
		if (!col) this.pixels[i].setAlpha(a);
		else {
			var rgb = hex2rgb(col);
			this.pixels[i].setColour(rgb.r, rgb.g, rgb.b, a);
		}
		this.updateCanvas();
	}
	setPixelHexInterim(x, y, col, a) {
		if (this.locked) return;
		if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) return;
		var i = y * this.width + x;
		if (!col) this.pixels[i].setAlpha(a);
		else {
			var rgb = hex2rgb(col);
			this.pixels[i].setColour(rgb.r, rgb.g, rgb.b, a);
		}
	}
	clearLayer() {
		if (this.locked) return;
		this.context.clearRect(0, 0, this.width, this.height);
	}
	reducePixelAlpha(x, y, amt) {
		if (this.locked) return;
		var i = y * this.width + x;
		this.pixels[i].alpha = this.pixels[i].alpha - amt;
		if (this.pixels[i].alpha < 0) this.pixels[i].alpha = 0;
		this.updateCanvas();
	}
	randomise() {
		if (this.locked) return;
		for (var i = 0; i < this.width * this.height; i++) this.pixels[i].setRandomColour();
		this.updateCanvas();
	}
	updateCanvas() {
		this.clearLayer();
		for (var i = 0; i < this.width * this.height; i++) {
			var x = i % this.width;
			var y = Math.floor(i / this.width);
			this.pixels[i].drawToCanvas(this.context, x, y);
		}
	}
	updatePixelArray() {
		var data = this.context.getImageData(0, 0, this.width, this.height).data;
		for (var i = 0; i < this.width * this.height; i++) {
			var di = i * 4;
			this.pixels[i].setRGBA(data[di], data[di + 1], data[di + 2], data[di + 3]);
		}
	}
};
var Pixel = class {
	constructor() {
		this.red = 0;
		this.green = 0;
		this.blue = 0;
		this.alpha = 0;
	}
	setRGBA(r, g, b, a) {
		this.setColour(r, g, b, a);
	}
	setColour(r, g, b, a) {
		this.red = r;
		this.green = g;
		this.blue = b;
		this.alpha = a;
	}
	setAlpha(a) {
		this.alpha = a;
	}
	setRandomColour() {
		this.red = rand(255);
		this.green = rand(255);
		this.blue = rand(255);
		this.alpha = 255;
	}
	getRGBA() {
		return {
			r: ~~this.red,
			g: ~~this.green,
			b: ~~this.blue,
			a: ~~this.alpha
		};
	}
	getHTMLHex() {
		return `#${parseInt(this.red, 10).toString(16).padStart(2, "0")}${parseInt(this.green, 10).toString(16).padStart(2, "0")}${parseInt(this.blue, 10).toString(16).padStart(2, "0")}`;
	}
	getRGBAArray() {
		return [
			this.red,
			this.green,
			this.blue,
			this.alpha
		];
	}
	copyFromPixel(src) {
		this.red = src.red;
		this.green = src.green;
		this.blue = src.blue;
		this.alpha = src.alpha;
	}
	drawToCanvas(ctx, x, y) {
		ctx.fillStyle = "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha / 255 + ")";
		ctx.fillRect(x, y, 1, 1);
	}
};
//#endregion
//#region src/js/common/colourpallets.js
var colourPalletContent = "<div class='flux-colourpickercontainer'><input type='color' class='flux-colourpicker' id='PRIMARYCOLOURPICKER' value='#ff0000'><div class='flux-label'>Primary</div> <div class='flux-clickable flux-inline' id='ADDPRIMARYCOLOUR' onclick='pixelFlux.objectClicked(\"ADDPRIMARYCOLOUR\")'> + </div></div><div class='flux-colourpickercontainer'><input type='color' class='flux-colourpicker' id='SECONDARYCOLOURPICKER' value='#00ff00'><div class='flux-label'>Secondary</div> <div class='flux-clickable flux-inline' id='ADDSECONDARYCOLOUR' onclick='pixelFlux.objectClicked(\"ADDSECONDARYCOLOUR\")'> + </div></div><div class='flux-slidercontainer'><input type='range' min='1' max='255' value='255' class='flux-slider' id='COLOUROPACITY'></div><div class='flux-label flux-opacitylabel'>Opacity</div><div id='COLOURPALLETSTORE'></div>";
var builtInColourPallets = {
	DEFAULT: [
		"rgb(248, 238, 229)",
		"rgb(235, 157, 134)",
		"rgb(255, 0, 0)",
		"rgb(118, 35, 2)",
		"rgb(71, 34, 3)",
		"rgb(192, 226, 151)",
		"rgb(43, 255, 0)",
		"rgb(50, 88, 2)",
		"rgb(41, 46, 3)",
		"rgb(169, 180, 224)",
		"rgb(0, 8, 255)",
		"rgb(18, 36, 71)",
		"rgb(233, 172, 245)",
		"rgb(255, 0, 247)",
		"rgb(102, 32, 89)",
		"rgb(54, 35, 39)",
		"rgb(248, 196, 184)",
		"rgb(255, 123, 0)",
		"rgb(249, 228, 197)",
		"rgb(251, 217, 131)",
		"rgb(255, 221, 0)",
		"rgb(87, 85, 3)"
	],
	WOODLANDJOURNEY: [
		"rgb(31, 36, 10)",
		"rgb(57, 87, 28)",
		"rgb(165, 140, 39)",
		"rgb(239, 172, 40)",
		"rgb(239, 216, 161)",
		"rgb(171, 92, 28)",
		"rgb(24, 63, 57)",
		"rgb(239, 105, 47)",
		"rgb(239, 183, 117)",
		"rgb(165, 98, 67)",
		"rgb(119, 52, 33)",
		"rgb(114, 65, 19)",
		"rgb(42, 29, 13)",
		"rgb(57, 42, 28)",
		"rgb(104, 76, 60)",
		"rgb(146, 126, 106)",
		"rgb(39, 100, 104)",
		"rgb(239, 58, 12)",
		"rgb(69, 35, 13)",
		"rgb(60, 159, 156)",
		"rgb(155, 26, 10)",
		"rgb(54, 23, 12)",
		"rgb(85, 15, 10)",
		"rgb(48, 15, 10)"
	],
	PASTELDREAMS: [
		"rgb(171, 255, 221)",
		"rgb(147, 219, 189)",
		"rgb(146, 218, 188)",
		"rgb(130, 194, 193)",
		"rgb(114, 169, 182)",
		"rgb(114, 170, 182)",
		"rgb(91, 132, 154)",
		"rgb(243, 208, 164)",
		"rgb(242, 181, 145)",
		"rgb(227, 170, 154)",
		"rgb(208, 157, 157)",
		"rgb(209, 157, 160)",
		"rgb(184, 136, 158)",
		"rgb(183, 136, 158)",
		"rgb(86, 173, 140)",
		"rgb(71, 137, 136)",
		"rgb(255, 155, 145)",
		"rgb(255, 107, 118)",
		"rgb(255, 104, 116)",
		"rgb(232, 94, 119)",
		"rgb(196, 81, 126)",
		"rgb(247, 157, 142)",
		"rgb(225, 70, 213)",
		"rgb(190, 58, 215)",
		"rgb(187, 58, 217)",
		"rgb(168, 54, 212)",
		"rgb(134, 41, 208)",
		"rgb(130, 41, 209)",
		"rgb(255, 253, 134)",
		"rgb(211, 211, 150)",
		"rgb(208, 207, 160)",
		"rgb(177, 178, 163)",
		"rgb(149, 150, 172)",
		"rgb(169, 194, 187)",
		"rgb(150, 150, 171)",
		"rgb(108, 118, 179)",
		"rgb(80, 88, 159)",
		"rgb(79, 86, 161)",
		"rgb(250, 190, 9)",
		"rgb(251, 172, 11)",
		"rgb(237, 153, 27)",
		"rgb(235, 151, 28)",
		"rgb(199, 124, 62)",
		"rgb(167, 103, 61)",
		"rgb(255, 143, 55)",
		"rgb(255, 125, 42)",
		"rgb(255, 91, 20)",
		"rgb(224, 77, 58)",
		"rgb(192, 65, 78)"
	],
	HIGHCONTRAST: [
		"rgb(185, 34, 0)",
		"rgb(175, 69, 81)",
		"rgb(197, 155, 250)",
		"rgb(155, 110, 205)",
		"rgb(171, 123, 81)",
		"rgb(133, 88, 249)",
		"rgb(148, 119, 163)",
		"rgb(2, 1, 2)",
		"rgb(52, 34, 14)",
		"rgb(185, 125, 0)",
		"rgb(87, 52, 196)",
		"rgb(140, 231, 255)",
		"rgb(159, 161, 156)",
		"rgb(162, 161, 200)",
		"rgb(148, 30, 0)",
		"rgb(200, 133, 44)",
		"rgb(120, 73, 136)",
		"rgb(235, 191, 147)",
		"rgb(201, 157, 136)",
		"rgb(222, 180, 210)",
		"rgb(70, 56, 123)",
		"rgb(140, 98, 41)",
		"rgb(228, 223, 229)",
		"rgb(229, 213, 184)",
		"rgb(234, 195, 97)",
		"rgb(127, 92, 0)",
		"rgb(27, 21, 53)",
		"rgb(162, 167, 247)",
		"rgb(98, 83, 62)",
		"rgb(128, 106, 98)",
		"rgb(17, 92, 6)",
		"rgb(92, 58, 0)",
		"rgb(136, 42, 36)",
		"rgb(14, 76, 63)",
		"rgb(194, 169, 72)",
		"rgb(192, 192, 192)",
		"rgb(182, 0, 0)",
		"rgb(60, 94, 24)",
		"rgb(220, 70, 57)",
		"rgb(173, 67, 0)",
		"rgb(164, 155, 109)",
		"rgb(227, 181, 249)",
		"rgb(130, 129, 244)",
		"rgb(191, 126, 192)",
		"rgb(58, 120, 253)",
		"rgb(90, 46, 40)",
		"rgb(30, 10, 89)",
		"rgb(46, 164, 249)",
		"rgb(23, 93, 245)",
		"rgb(6, 34, 15)",
		"rgb(95, 55, 231)",
		"rgb(69, 40, 156)",
		"rgb(165, 117, 123)",
		"rgb(121, 137, 116)",
		"rgb(166, 16, 45)",
		"rgb(136, 78, 215)",
		"rgb(98, 117, 84)",
		"rgb(146, 189, 107)",
		"rgb(243, 159, 1)",
		"rgb(234, 186, 65)",
		"rgb(219, 0, 52)",
		"rgb(242, 155, 109)",
		"rgb(201, 199, 149)",
		"rgb(0, 164, 214)",
		"rgb(91, 48, 75)",
		"rgb(169, 119, 244)",
		"rgb(92, 11, 8)",
		"rgb(255, 115, 83)",
		"rgb(238, 94, 118)",
		"rgb(0, 185, 251)",
		"rgb(24, 56, 105)",
		"rgb(74, 112, 214)",
		"rgb(208, 122, 101)",
		"rgb(104, 98, 218)",
		"rgb(34, 15, 146)",
		"rgb(103, 0, 83)",
		"rgb(165, 0, 149)",
		"rgb(220, 0, 196)",
		"rgb(59, 40, 57)",
		"rgb(74, 96, 175)",
		"rgb(130, 0, 2)",
		"rgb(34, 11, 201)",
		"rgb(15, 129, 0)",
		"rgb(30, 105, 132)",
		"rgb(203, 100, 39)",
		"rgb(0, 171, 0)",
		"rgb(139, 153, 0)",
		"rgb(241, 153, 56)",
		"rgb(239, 27, 0)",
		"rgb(50, 125, 51)",
		"rgb(74, 157, 180)",
		"rgb(255, 222, 153)",
		"rgb(170, 136, 34)",
		"rgb(61, 87, 56)"
	],
	CYBERPUNKNEON: [
		"rgb(0, 0, 0)",
		"rgb(101, 167, 222)",
		"rgb(102, 89, 81)",
		"rgb(104, 210, 227)",
		"rgb(108, 134, 195)",
		"rgb(109, 105, 111)",
		"rgb(11, 87, 145)",
		"rgb(133, 165, 225)",
		"rgb(140, 112, 196)",
		"rgb(143, 102, 165)",
		"rgb(152, 72, 169)",
		"rgb(153, 22, 114)",
		"rgb(159, 150, 191)",
		"rgb(178, 106, 211)",
		"rgb(197, 64, 195)",
		"rgb(220, 120, 231)",
		"rgb(24, 66, 108)",
		"rgb(244, 159, 243)",
		"rgb(27, 26, 52)",
		"rgb(41, 107, 164)",
		"rgb(42, 112, 195)",
		"rgb(47, 75, 156)",
		"rgb(55, 74, 126)",
		"rgb(59, 37, 46)",
		"rgb(64, 2, 55)",
		"rgb(64, 60, 96)",
		"rgb(71, 158, 209)",
		"rgb(78, 128, 199)",
		"rgb(81, 100, 162)",
		"rgb(95, 57, 38)",
		"rgb(97, 29, 106)",
		"rgb(97, 73, 129)"
	],
	DRAGONFIRE: [
		"rgb(100, 80, 98)",
		"rgb(109, 73, 55)",
		"rgb(117, 7, 0)",
		"rgb(135, 106, 115)",
		"rgb(142, 60, 25)",
		"rgb(144, 99, 23)",
		"rgb(145, 98, 55)",
		"rgb(147, 29, 7)",
		"rgb(164, 126, 146)",
		"rgb(175, 68, 42)",
		"rgb(175, 76, 3)",
		"rgb(178, 132, 99)",
		"rgb(178, 46, 12)",
		"rgb(180, 102, 40)",
		"rgb(20, 0, 2)",
		"rgb(210, 162, 47)",
		"rgb(225, 143, 93)",
		"rgb(230, 141, 17)",
		"rgb(236, 196, 78)",
		"rgb(236, 90, 34)",
		"rgb(236, 96, 3)",
		"rgb(238, 186, 108)",
		"rgb(245, 182, 45)",
		"rgb(251, 238, 67)",
		"rgb(253, 240, 117)",
		"rgb(48, 35, 53)",
		"rgb(53, 22, 22)",
		"rgb(79, 60, 66)",
		"rgb(83, 9, 8)",
		"rgb(93, 40, 26)"
	]
};
//#endregion
//#region src/js/common/windowarrangements.js
var builtInWindowArrangements = {
	CLASSIC: [
		{
			id: "WORKSPACE",
			top: "32px",
			left: "146px",
			width: "600px",
			height: "600px"
		},
		{
			id: "COLOURPALLET",
			top: "296px",
			left: "749px",
			width: "180px",
			height: "284px"
		},
		{
			id: "TOOLBAR",
			top: "32px",
			left: "1px",
			width: "142px",
			height: "600px"
		},
		{
			id: "PREVIEW",
			top: "32px",
			left: "932px",
			width: "180px",
			height: "200px"
		},
		{
			id: "ANIMATIONPREVIEW",
			top: "32px",
			left: "1115px",
			width: "180px",
			height: "200px"
		},
		{
			id: "ANIMATIONTOOLS",
			top: "585px",
			left: "749px",
			width: "180px",
			height: "42px"
		},
		{
			id: "TOOLOPTIONS",
			top: "32px",
			left: "749px",
			width: "180px",
			height: "260px"
		},
		{
			id: "LAYERS",
			top: "235px",
			left: "932px",
			width: "180px",
			height: "396px"
		},
		{
			id: "FRAMES",
			top: "235px",
			left: "1115px",
			width: "181px",
			height: "397px"
		},
		{
			id: "DEBUG",
			top: "636px",
			left: "4px",
			width: "500px",
			height: "120px"
		},
		{
			id: "OPENGALLERY",
			top: "200px",
			left: "200px",
			width: "800px",
			height: "600px"
		},
		{
			id: "PIXELBRUSH",
			top: "636px",
			left: "508px",
			width: "500px",
			height: "120px"
		}
	],
	NEOCLASSIC: [
		{
			id: "WORKSPACE",
			top: "32px",
			left: "328px",
			width: "600px",
			height: "600px"
		},
		{
			id: "COLOURPALLET",
			top: "348px",
			left: "145px",
			width: "180px",
			height: "284px"
		},
		{
			id: "TOOLBAR",
			top: "32px",
			left: "1px",
			width: "142px",
			height: "600px"
		},
		{
			id: "PREVIEW",
			top: "32px",
			left: "932px",
			width: "180px",
			height: "200px"
		},
		{
			id: "ANIMATIONPREVIEW",
			top: "32px",
			left: "1115px",
			width: "180px",
			height: "200px"
		},
		{
			id: "ANIMATIONTOOLS",
			top: "717px",
			left: "1116px",
			width: "180px",
			height: "42px"
		},
		{
			id: "TOOLOPTIONS",
			top: "33px",
			left: "145px",
			width: "181px",
			height: "312px"
		},
		{
			id: "LAYERS",
			top: "235px",
			left: "932px",
			width: "179px",
			height: "523px"
		},
		{
			id: "FRAMES",
			top: "235px",
			left: "1115px",
			width: "180px",
			height: "477px"
		},
		{
			id: "DEBUG",
			top: "636px",
			left: "4px",
			width: "500px",
			height: "120px"
		},
		{
			id: "PIXELBRUSH",
			top: "636px",
			left: "508px",
			width: "421px",
			height: "121px"
		},
		{
			id: "OPENGALLERY",
			top: "200px",
			left: "200px",
			width: "800px",
			height: "600px"
		},
		{
			id: "GIFDISPLAY",
			top: "300px",
			left: "400px",
			width: "200px",
			height: "200px"
		}
	],
	WIDE: [
		{
			id: "WORKSPACE",
			top: "131px",
			left: "5px",
			width: "925px",
			height: "537px"
		},
		{
			id: "COLOURPALLET",
			top: "533px",
			left: "932px",
			width: "180px",
			height: "267px"
		},
		{
			id: "TOOLBAR",
			top: "33px",
			left: "2px",
			width: "1113px",
			height: "96px"
		},
		{
			id: "PREVIEW",
			top: "131px",
			left: "933px",
			width: "180px",
			height: "200px"
		},
		{
			id: "ANIMATIONPREVIEW",
			top: "32px",
			left: "1115px",
			width: "180px",
			height: "200px"
		},
		{
			id: "TOOLOPTIONS",
			top: "333px",
			left: "932px",
			width: "181px",
			height: "197px"
		},
		{
			id: "DEBUG",
			top: "671px",
			left: "5px",
			width: "510px",
			height: "116px"
		},
		{
			id: "OPENGALLERY",
			top: "200px",
			left: "200px",
			width: "800px",
			height: "600px"
		}
	],
	TILECREATOR: [
		{
			id: "WORKSPACE",
			top: "32px",
			left: "146px",
			width: "600px",
			height: "600px"
		},
		{
			id: "COLOURPALLET",
			top: "296px",
			left: "749px",
			width: "180px",
			height: "284px"
		},
		{
			id: "TOOLBAR",
			top: "32px",
			left: "1px",
			width: "142px",
			height: "600px"
		},
		{
			id: "PREVIEW",
			top: "32px",
			left: "932px",
			width: "400px",
			height: "394px"
		},
		{
			id: "ANIMATIONPREVIEW",
			top: "430px",
			left: "932px",
			width: "175px",
			height: "185px"
		},
		{
			id: "ANIMATIONTOOLS",
			top: "585px",
			left: "749px",
			width: "180px",
			height: "42px"
		},
		{
			id: "TOOLOPTIONS",
			top: "635px",
			left: "508px",
			width: "188px",
			height: "121px"
		},
		{
			id: "LAYERS",
			top: "32px",
			left: "748px",
			width: "181px",
			height: "262px"
		},
		{
			id: "FRAMES",
			top: "430px",
			left: "1112px",
			width: "171px",
			height: "319px"
		},
		{
			id: "DEBUG",
			top: "636px",
			left: "4px",
			width: "500px",
			height: "120px"
		},
		{
			id: "OPENGALLERY",
			top: "200px",
			left: "200px",
			width: "800px",
			height: "600px"
		}
	]
};
//#endregion
//#region src/js/common/pixeleditor.js
var PixelEditor = class {
	constructor(ui) {
		this.flux = ui;
		this.sprite = new Sprite(32, 32);
		this.drawingScale = 16;
		this.previewScale = 2;
		this.animationPreviewScale = 2;
		this.animating = false;
		this.currentTool = false;
		this.tilePreview = false;
		this.lastUpdate = Date.now();
		this.currentSelection = {
			enabled: false,
			x1: 0,
			y1: 0,
			x2: 0,
			y2: 0
		};
		this.preferences = {
			preserveLayerContinuity: true,
			undoHistorySize: 20
		};
	}
	init(callback) {
		this.setupUI();
		this.addEventListeners();
		callback();
		this.start();
		log("PixelFlux Editor Initialised - Version 0.1.0");
	}
	start() {
		this.sprite.updateCanvasChain();
		this.updateCanvasAndPreview();
	}
	setupUI() {
		this.flux.createFullScreenUI();
		let menuUrl = "./config/menu.json";
		console.log("LOADING MENU: ", menuUrl);
		this.flux.loadMenu(menuUrl, (id) => {
			const postEvent = new CustomEvent("menuButtonClicked", { detail: { srcElementId: id } });
			document.dispatchEvent(postEvent);
			log("MENU ID: " + id + " CLICKED");
		});
		log("Calling Create Workspace Window");
		this.createWorkspaceWindow();
		this.createColourPalletWindow();
		this.createToolbarWindow();
		this.createPreviewWindow();
		this.createAnimationPreviewWindow();
		this.createAnimationToolsWindow();
		this.createToolOptionsWindow();
		this.createLayersWindow();
		this.createFramesWindow();
		this.createDebugWindow();
		this.createPixelBrushWindow();
		this.createOpenGallery();
		this.createGifDisplayWindow();
		this.flux.restoreWindowArrangement(builtInWindowArrangements.NEOCLASSIC);
	}
	addEventListeners() {
		document.addEventListener("fluxWindowResize", (event) => {
			this.resizeContentCanvases();
			this.updateCanvasAndPreview();
		});
		document.addEventListener("click", (event) => {
			var srcElement = event.target;
			if (srcElement.matches(".flux-toolbarbutton")) {
				const postEvent = new CustomEvent("toolButtonClicked", { detail: {
					srcElementId: srcElement.id,
					srcElement
				} });
				document.dispatchEvent(postEvent);
			}
		});
		document.addEventListener("keyup", (event) => {
			switch (event.keyCode) {
				case 90:
					if (event.ctrlKey) {
						this.sprite.undo();
						this.updateCanvasAndPreview();
					}
					break;
				case 82:
					if (event.altKey) {
						event.preventDefault();
						this.sprite.redo();
						this.updateCanvasAndPreview();
					}
					break;
				case 37:
					pixelFlux.sprite.selectPreviousFrame();
					pixelFlux.sprite.updateCanvasChain();
					pixelFlux.updateCanvasAndPreview();
					break;
				case 39:
					pixelFlux.sprite.selectNextFrame();
					pixelFlux.sprite.updateCanvasChain();
					pixelFlux.updateCanvasAndPreview();
					break;
			}
		});
	}
	setFramerate(fps) {
		return this.sprite.setFramerate(fps);
	}
	resizeContentCanvases() {
		var canvas = document.getElementById("DRAWINGCANVAS");
		canvas.parentElement.style.width = "100%";
		canvas.parentElement.style.height = "100%";
		canvas = document.getElementById("PREVIEWCANVAS");
		canvas.parentElement.style.width = "100%";
		canvas.parentElement.style.height = "100%";
		canvas = document.getElementById("PREVIEWCANVAS");
		canvas.parentElement.style.width = "100%";
		canvas.parentElement.style.height = "100%";
		this.updateCanvasAndPreview();
	}
	toggleTilePreview() {
		this.tilePreview = !this.tilePreview;
	}
	createWorkspaceWindow() {
		log("Calling Create Workspace Window");
		this.flux.createWindow("WORKSPACE", "Workspace", 200, 60, 600, 620);
		var container = document.getElementById("WORKSPACECONTENT");
		var canvas = document.createElement("canvas");
		container.classList.add("flux-windowchequered");
		canvas.id = "DRAWINGCANVAS";
		canvas.classList.add("drawingcanvas");
		container.appendChild(canvas);
	}
	createColourPalletWindow() {
		log("Calling Create Colour Pallet Window");
		this.flux.createWindow("COLOURPALLET", "Colour Pallet", 900, 550, 190, 280);
		var container = document.getElementById("COLOURPALLETCONTENT");
		container.innerHTML = colourPalletContent;
		this.loadColourPallet("defaultColourPallet");
	}
	createToolbarWindow() {
		this.flux.createWindow("TOOLBAR", "Toolbar", 30, 60, 142, 600);
		this.flux.appendToolButton("TOOLBAR", "SELECTION", appUrl + "resources/icons/selecttoolicon.png");
		this.flux.appendToolButton("TOOLBAR", "MOVE", appUrl + "resources/icons/movetoolicon.png");
		this.flux.appendToolButton("TOOLBAR", "PENCIL", appUrl + "resources/icons/penciltoolicon.png");
		this.flux.appendToolButton("TOOLBAR", "ERASER", appUrl + "resources/icons/erasertoolicon.png");
		this.flux.appendToolButton("TOOLBAR", "FLOODFILL", appUrl + "resources/icons/bucketfillicon.png");
		this.flux.appendToolButton("TOOLBAR", "SPRAYCAN", appUrl + "resources/icons/spraycanicon.png");
		this.flux.appendToolButton("TOOLBAR", "STRAIGHTLINE", appUrl + "resources/icons/straightlinetoolicon.png");
		this.flux.appendToolButton("TOOLBAR", "DARKENLIGHTEN", appUrl + "resources/icons/lightendarkentoolicon.png");
		this.flux.appendToolButton("TOOLBAR", "BLEND", appUrl + "resources/icons/blendtoolicon.png");
		this.flux.appendToolButton("TOOLBAR", "SQUARE", appUrl + "resources/icons/squaretoolicon.png");
		this.flux.appendToolButton("TOOLBAR", "FILLEDSQUARE", appUrl + "resources/icons/filledsquaretoolicon.png");
		this.flux.appendToolButton("TOOLBAR", "ELLIPSE", appUrl + "resources/icons/ellipsetoolicon.png");
		this.flux.appendToolButton("TOOLBAR", "FILLEDELLIPSE", appUrl + "resources/icons/filledellipsetoolicon.png");
	}
	createPreviewWindow() {
		this.flux.createWindow("PREVIEW", "Preview", 900, 60, 180, 200);
		var container = document.getElementById("PREVIEWCONTENT");
		var canvas = document.createElement("canvas");
		container.classList.add("flux-windowchequered");
		canvas.style.width = "100%";
		canvas.style.height = "100%";
		canvas.id = "PREVIEWCANVAS";
		container.appendChild(canvas);
	}
	createAnimationPreviewWindow() {
		this.flux.createWindow("ANIMATIONPREVIEW", "Animation Preview", 1082, 60, 180, 200);
		var container = document.getElementById("ANIMATIONPREVIEWCONTENT");
		var canvas = document.createElement("canvas");
		container.classList.add("flux-windowchequered");
		canvas.style.width = "100%";
		canvas.style.height = "100%";
		canvas.id = "ANIMATIONPREVIEWCANVAS";
		container.appendChild(canvas);
	}
	createAnimationToolsWindow() {
		this.flux.createWindow("ANIMATIONTOOLS", "Frame Navigation", 1082, 262, 180, 200);
		var container = document.getElementById("ANIMATIONTOOLSCONTENT");
		var first = document.createElement("div");
		first.classList.add("layercontrolbutton");
		first.style.backgroundImage = `url(${appUrl}resources/icons/firstframeicon.png)`;
		first.onclick = (event) => {
			pixelFlux.sprite.setCurrentFrame(0);
			pixelFlux.sprite.updateCanvasChain();
			pixelFlux.updateCanvasAndPreview();
		};
		container.appendChild(first);
		var prev = document.createElement("div");
		prev.classList.add("layercontrolbutton");
		prev.style.backgroundImage = `url(${appUrl}resources/icons/previousframeicon.png)`;
		prev.onclick = (event) => {
			pixelFlux.sprite.selectPreviousFrame();
			pixelFlux.sprite.updateCanvasChain();
			pixelFlux.updateCanvasAndPreview();
		};
		container.appendChild(prev);
		var play = document.createElement("div");
		play.classList.add("layercontrolbutton");
		play.style.backgroundImage = `url(${appUrl}resources/icons/startanimationicon.png)`;
		play.onclick = (event) => {
			pixelFlux.animating = true;
			pixelFlux.sprite.updateCanvasChain();
			pixelFlux.renderAnimationPreview();
		};
		container.appendChild(play);
		var stop = document.createElement("div");
		stop.classList.add("layercontrolbutton");
		stop.style.backgroundImage = `url(${appUrl}resources/icons/stopanimationicon.png)`;
		stop.onclick = (event) => {
			pixelFlux.animating = true;
			pixelFlux.sprite.updateCanvasChain();
			pixelFlux.renderAnimationPreview();
		};
		container.appendChild(stop);
		var currentframe = document.createElement("div");
		currentframe.classList.add("currentframenumber");
		currentframe.id = "CURRENTFRAMENUMBER";
		container.appendChild(currentframe);
		var next = document.createElement("div");
		next.classList.add("layercontrolbutton");
		next.style.backgroundImage = `url(${appUrl}resources/icons/nextframeicon.png)`;
		next.onclick = (event) => {
			pixelFlux.sprite.selectNextFrame();
			pixelFlux.sprite.updateCanvasChain();
			pixelFlux.updateCanvasAndPreview();
		};
		container.appendChild(next);
		var last = document.createElement("div");
		last.classList.add("layercontrolbutton");
		last.style.backgroundImage = `url(${appUrl}resources/icons/lastframeicon.png)`;
		last.onclick = (event) => {
			pixelFlux.sprite.setCurrentFrame(pixelFlux.sprite.frames.length - 1);
			pixelFlux.sprite.updateCanvasChain();
			pixelFlux.updateCanvasAndPreview();
		};
		container.appendChild(last);
	}
	createToolOptionsWindow() {
		this.flux.createWindow("TOOLOPTIONS", "Tool Options", 900, 270, 180, 260);
	}
	createDebugWindow() {
		this.flux.createWindow("DEBUG", "Debug Info", 200, 700, 500, 120);
		var container = document.getElementById("DEBUGCONTENT");
		var div = document.createElement("div");
		div.classList.add("flux-debuginfo");
		div.id = "FLUXDEBUGINFO";
		div.style.width = "100%";
		div.style.height = "100%";
		container.appendChild(div);
	}
	createPixelBrushWindow() {
		this.flux.createWindow("PIXELBRUSH", "Pixel Brush", 510, 600, 500, 120);
	}
	createOpenGallery() {
		this.flux.createWindow("OPENGALLERY", "Your Saved Images", 200, 200, 800, 600);
	}
	createLayersWindow() {
		this.flux.createWindow("LAYERS", "Layers", 800, 400, 200, 400);
	}
	createFramesWindow() {
		this.flux.createWindow("FRAMES", "Frames", 800, 400, 200, 400);
	}
	createGifDisplayWindow() {
		this.flux.createWindow("GIFDISPLAY", "GIF Image Preview", 400, 300, 200, 200);
	}
	objectClicked(id) {
		switch (id) {
			case "ADDPRIMARYCOLOUR":
				this.addColourToPallet(document.getElementById("PRIMARYCOLOURPICKER").value);
				break;
			case "ADDSECONDARYCOLOUR":
				this.addColourToPallet(document.getElementById("SECONDARYCOLOURPICKER").value);
				break;
		}
	}
	addColourToPallet(colour) {
		var container = document.getElementById("COLOURPALLETSTORE");
		var colourPreview = document.createElement("div");
		colourPreview.classList.add("flux-palletcolour");
		colourPreview.style.backgroundColor = colour;
		colourPreview.onclick = (event) => {
			var newColourRGB = event.srcElement.style.backgroundColor;
			console.log(newColourRGB);
			if (event.shiftKey) colourPreview.remove();
			else if (event.button == 0) document.getElementById("PRIMARYCOLOURPICKER").value = rgb2hex(event.srcElement.style.backgroundColor);
		};
		colourPreview.oncontextmenu = (event) => {
			var newColourRGB = event.srcElement.style.backgroundColor;
			console.log(newColourRGB);
			document.getElementById("SECONDARYCOLOURPICKER").value = rgb2hex(event.srcElement.style.backgroundColor);
		};
		container.appendChild(colourPreview);
		this.saveColourPallet();
	}
	saveColourPaletteAs() {
		console.log("Saving Colour Palette");
		this.flux.showModalQuestionWindow("Please enter a name for your Palette...", "", "Save", "cancel", (response) => {
			if (response) this.saveColourPallet(response);
		});
	}
	saveColourPallet(name) {
		if (!name) name = "defaultColourPallet";
		var palette = { type: "palette" };
		palette.colours = [];
		var elements = document.querySelectorAll(".flux-palletcolour");
		for (var i = 0; i < elements.length; i++) {
			var col = elements[i].style.backgroundColor;
			palette.colours.push(col);
		}
		localStorage.setItem(name, JSON.stringify(palette));
	}
	loadColourPallet(palletName) {
		if (localStorage.getItem(palletName)) {
			var colours = JSON.parse(localStorage.getItem(palletName)).colours;
			this.loadColours(colours);
		}
	}
	loadColours(colours) {
		if (colours === void 0) return false;
		for (var i = 0; i < colours.length; i++) this.addColourToPallet(colours[i]);
	}
	reduceColourPalette(threshold) {
		var colours = [];
		var elements = document.querySelectorAll(".flux-palletcolour");
		for (var i = 0; i < elements.length; i++) {
			let colour = elements[i].style.backgroundColor;
			let rgb = rgb2intArray(colour);
			let include = true;
			colours.forEach((c) => {
				let r1 = c[0], g1 = c[1], b1 = c[2];
				let r2 = rgb[0], g2 = rgb[1], b2 = rgb[2];
				if (r1 - r2 < threshold && r1 - r2 > -threshold && g1 - g2 < threshold && g1 - g2 > -threshold && b1 - b2 < threshold && b1 - b2 > -threshold) include = false;
			});
			if (include) colours.push(rgb);
		}
		colours.sort();
		this.clearColourPallet();
		colours.forEach((c) => {
			let hex = `#${parseInt(c[0], 10).toString(16).padStart(2, "0")}${parseInt(c[1], 10).toString(16).padStart(2, "0")}${parseInt(c[2], 10).toString(16).padStart(2, "0")}`;
			console.log(hex);
			this.addColourToPallet(hex);
		});
	}
	createPaletteFromCurrentLayer() {
		var colours = /* @__PURE__ */ new Set();
		this.sprite.getCurrentFrame().getCurrentLayer().pixels.forEach((pixel) => {
			colours.add(pixel.getHTMLHex());
		});
		colours.forEach((colour) => {
			this.addColourToPallet(colour);
		});
	}
	clearColourPallet() {
		document.getElementById("COLOURPALLETSTORE").innerHTML = "";
	}
	selectSavedPalette() {
		this.flux.showModalSelectionWindow("Please select your Palette to load...", this.getSavedPaletteList(), "Load", "cancel", (response) => {
			if (response) {
				this.clearColourPallet();
				this.loadColourPallet(response);
			}
		});
	}
	getSavedPaletteList() {
		let palettes = new Array();
		console.log(localStorage.length);
		for (let i = 0; i < localStorage.length; i++) {
			let key = localStorage.key(i);
			if (JSON.parse(localStorage.getItem(key)).type == "palette" && key != "defaultColourPallet") palettes.push(key);
		}
		return palettes;
	}
	exportCurrentPalette() {
		console.log("Exporting Current Palette");
		this.flux.showModalQuestionWindow("Please enter a name for your Palette...", "", "Export", "cancel", (response) => {
			if (response) {
				var palette = { type: "palette" };
				palette.colours = [];
				var elements = document.querySelectorAll(".flux-palletcolour");
				for (var i = 0; i < elements.length; i++) {
					var col = elements[i].style.backgroundColor;
					palette.colours.push(col);
				}
				var url = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(palette));
				if (response.length == 0) download(url, "pixelFlux-download.palette");
				else download(url, response + ".palette");
			}
		});
	}
	importPaletteFile() {}
	refresh() {
		this.updateCanvasAndPreview(true);
	}
	updateCanvasAndPreview(fullUpdate) {
		if (Date.now() - this.lastUpdate > 100) fullUpdate = true;
		debug.counter++;
		var scale = this.drawingScale;
		var drawingCanvas = document.getElementById("DRAWINGCANVAS");
		var previewCanvas = document.getElementById("PREVIEWCANVAS");
		drawingCanvas.width = drawingCanvas.clientWidth;
		drawingCanvas.height = drawingCanvas.clientHeight;
		previewCanvas.width = previewCanvas.clientWidth;
		previewCanvas.height = previewCanvas.clientHeight;
		var ctx = drawingCanvas.getContext("2d");
		ctx.imageSmoothingEnabled = false;
		var pctx = previewCanvas.getContext("2d");
		pctx.imageSmoothingEnabled = false;
		var canvasWidth = drawingCanvas.clientWidth;
		var canvasHeight = drawingCanvas.clientHeight - 20;
		var imageOriginX = canvasWidth / 2 - this.sprite.width / 2 * scale;
		var imageOriginY = canvasHeight / 2 - this.sprite.height / 2 * scale;
		ctx.clearRect(0, 0, this.width, this.height);
		ctx.drawImage(this.sprite.canvas, 0, 0, this.sprite.width, this.sprite.height, imageOriginX, imageOriginY, this.sprite.width * scale, this.sprite.height * scale);
		ctx.beginPath();
		ctx.rect(imageOriginX - 1, imageOriginY - 1, this.sprite.width * scale + 2, this.sprite.height * scale + 2);
		ctx.stroke();
		if (this.tilePreview) {
			scale = this.previewScale;
			canvasWidth = previewCanvas.clientWidth;
			canvasHeight = previewCanvas.clientHeight - 20;
			imageOriginX = canvasWidth / 2 - this.sprite.width / 2 * scale;
			imageOriginY = canvasHeight / 2 - this.sprite.height / 2 * scale;
			var pattern = pctx.createPattern(this.sprite.canvas, "repeat");
			pctx.clearRect(0, 0, this.width, this.height);
			pctx.scale(scale, scale);
			pctx.fillStyle = pattern;
			pctx.fillRect(0, 0, canvasWidth / scale, canvasHeight / scale);
			pctx.scale(1, 1);
		} else {
			scale = this.previewScale;
			canvasWidth = previewCanvas.clientWidth;
			canvasHeight = previewCanvas.clientHeight - 20;
			imageOriginX = canvasWidth / 2 - this.sprite.width / 2 * scale;
			imageOriginY = canvasHeight / 2 - this.sprite.height / 2 * scale;
			pctx.clearRect(0, 0, this.width, this.height);
			pctx.drawImage(this.sprite.canvas, 0, 0, this.sprite.width, this.sprite.height, imageOriginX, imageOriginY, this.sprite.width * scale, this.sprite.height * scale);
			pctx.beginPath();
			pctx.rect(imageOriginX - 1, imageOriginY - 1, this.sprite.width * scale + 2, this.sprite.height * scale + 2);
			pctx.stroke();
		}
		if (fullUpdate) {
			this.renderLayersWindow();
			this.updateFrameNumberDisplay();
			this.renderFramesWindow();
		}
		this.lastUpdate = Date.now();
	}
	renderAnimationPreview() {
		var scale = pixelFlux.animationPreviewScale;
		var previewCanvas = document.getElementById("ANIMATIONPREVIEWCANVAS");
		previewCanvas.width = previewCanvas.clientWidth;
		previewCanvas.height = previewCanvas.clientHeight;
		var pctx = previewCanvas.getContext("2d");
		pctx.imageSmoothingEnabled = false;
		var canvasWidth = previewCanvas.clientWidth;
		var canvasHeight = previewCanvas.clientHeight - 20;
		var imageOriginX = canvasWidth / 2 - pixelFlux.sprite.width / 2 * scale;
		var imageOriginY = canvasHeight / 2 - pixelFlux.sprite.height / 2 * scale;
		pctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
		pixelFlux.sprite.drawAnimationToCanvasId("ANIMATIONPREVIEWCANVAS", imageOriginX, imageOriginY, scale);
		pctx.beginPath();
		pctx.rect(imageOriginX - 1, imageOriginY - 1, pixelFlux.sprite.width * scale + 2, pixelFlux.sprite.height * scale + 2);
		pctx.stroke();
		if (pixelFlux.animating) setTimeout(pixelFlux.renderAnimationPreview, 1e3 / pixelFlux.fps);
	}
	updateFrameNumberDisplay() {
		document.getElementById("CURRENTFRAMENUMBER").innerHTML = this.sprite.currentFrame + 1 + " / " + this.sprite.frames.length;
	}
	renderLayersWindow() {
		var container = document.getElementById("LAYERSCONTENT");
		container.innerHTML = "";
		var frame = this.sprite.getCurrentFrame();
		var layerCount = frame.layers.length;
		var current = frame.currentLayer;
		for (var i = layerCount - 1; i > -1; i--) {
			var layercontainer = document.createElement("div");
			layercontainer.classList.add("layercontainer");
			if (i == current) layercontainer.classList.add("currentlayercontainer");
			var canvas = document.createElement("canvas");
			canvas.classList.add("layerwindowcanvas");
			canvas.width = 32;
			canvas.height = 32;
			canvas.style.zIndex = i;
			canvas.onclick = (event) => {
				this.sprite.setCurrentLayer(event.srcElement.style.zIndex);
				pixelFlux.renderLayersWindow();
			};
			canvas.getContext("2d").drawImage(frame.layers[i].canvas, 0, 0, frame.width, frame.height, 0, 0, canvas.width, canvas.height);
			var layerinfo = document.createElement("div");
			layerinfo.classList.add("layerinfo");
			var layername = document.createElement("div");
			layername.innerText = frame.layers[i].name;
			layername.classList.add("layername");
			var editlayername = document.createElement("div");
			editlayername.classList.add("editlayername");
			editlayername.zIndex = i;
			editlayername.onclick = (event) => {
				var id = event.srcElement.zIndex;
				var frame = pixelFlux.sprite.getCurrentFrame();
				flux.showModalQuestionWindow("Edit Layer Name:", frame.layers[id].name, "Save", "Cancel", (response) => {
					if (response) {
						if (this.preferences.preserveLayerContinuity) this.sprite.setLayerNameAllFrames(id, response);
						else frame.layers[id].name = response;
						pixelFlux.renderLayersWindow();
						pixelFlux.sprite.pushToUndoHistory();
					}
				});
			};
			var layercontrols = document.createElement("div");
			layercontrols.classList.add("layercontrols");
			var layervisible = document.createElement("div");
			layervisible.classList.add("layercontrolbutton");
			if (frame.layers[i].visible) layervisible.classList.add("buttonfeatureenabled");
			else layervisible.classList.add("buttonfeaturedisabled");
			layervisible.style.backgroundImage = `url(${appUrl}resources/icons/showhideicon.png)`;
			layervisible.zIndex = i;
			layervisible.onclick = (event) => {
				var id = event.srcElement.zIndex;
				var frame = pixelFlux.sprite.getCurrentFrame();
				if (frame.layers[id].visible) {
					if (this.preferences.preserveLayerContinuity) this.sprite.setLayerVisible(id, false);
					else frame.layers[id].hide();
					event.srcElement.classList.add("buttonfeatureenabled");
					pixelFlux.updateCanvasAndPreview();
					pixelFlux.sprite.pushToUndoHistory();
				} else {
					if (this.preferences.preserveLayerContinuity) this.sprite.setLayerVisible(id, true);
					else frame.layers[id].show();
					event.srcElement.classList.add("buttonfeaturedisabled");
					pixelFlux.sprite.pushToUndoHistory();
				}
				pixelFlux.sprite.updateCanvasChain();
				pixelFlux.updateCanvasAndPreview();
			};
			layercontrols.appendChild(layervisible);
			var layerlock = document.createElement("div");
			layerlock.classList.add("layercontrolbutton");
			if (frame.layers[i].locked) layerlock.classList.add("buttonfeatureenabled");
			else layerlock.classList.add("buttonfeaturedisabled");
			layerlock.style.backgroundImage = `url(${appUrl}resources/icons/padlockicon.png)`;
			layerlock.zIndex = i;
			layerlock.onclick = (event) => {
				var id = event.srcElement.zIndex;
				if (pixelFlux.sprite.getCurrentFrame().layers[id].locked) {
					this.sprite.unlockLayer(id);
					event.srcElement.classList.add("buttonfeaturedisabled");
					pixelFlux.updateCanvasAndPreview();
					pixelFlux.sprite.pushToUndoHistory();
				} else {
					this.sprite.lockLayer(id);
					event.srcElement.classList.add("buttonfeatureenabled");
					pixelFlux.sprite.pushToUndoHistory();
				}
				pixelFlux.sprite.updateCanvasChain();
				pixelFlux.updateCanvasAndPreview();
			};
			layercontrols.appendChild(layerlock);
			var layerclear = document.createElement("div");
			layerclear.classList.add("layercontrolbutton");
			layerclear.style.backgroundImage = `url(${appUrl}resources/icons/deletelayericon.png)`;
			layerclear.zIndex = i;
			layerclear.onclick = (event) => {
				var id = event.srcElement.zIndex;
				pixelFlux.sprite.getCurrentFrame().layers[id].clear();
				pixelFlux.sprite.updateCanvasChain();
				pixelFlux.updateCanvasAndPreview();
				pixelFlux.sprite.pushToUndoHistory();
			};
			layercontrols.appendChild(layerclear);
			var mergedown = document.createElement("div");
			mergedown.classList.add("layercontrolbutton");
			mergedown.style.backgroundImage = `url(${appUrl}resources/icons/mergedownicon.png)`;
			mergedown.zIndex = i;
			if (i > 0) mergedown.onclick = (event) => {
				var id = event.srcElement.zIndex;
				pixelFlux.sprite.mergeLayerDown(id);
				pixelFlux.sprite.updateCanvasChain();
				pixelFlux.updateCanvasAndPreview();
				pixelFlux.sprite.pushToUndoHistory();
			};
			else mergedown.style.opacity = "30%";
			layercontrols.appendChild(mergedown);
			var movedown = document.createElement("div");
			movedown.classList.add("layercontrolbutton");
			movedown.style.backgroundImage = `url(${appUrl}resources/icons/downarrow16.png)`;
			movedown.style.zIndex = i;
			if (i > 0) movedown.onclick = (event) => {
				var id = event.srcElement.style.zIndex;
				pixelFlux.sprite.getCurrentFrame();
				sprite.moveLayerDown(~~id);
				pixelFlux.sprite.updateCanvasChain();
				pixelFlux.updateCanvasAndPreview();
				pixelFlux.sprite.pushToUndoHistory();
			};
			else movedown.style.opacity = "30%";
			layercontrols.appendChild(movedown);
			var moveup = document.createElement("div");
			moveup.classList.add("layercontrolbutton");
			moveup.style.backgroundImage = `url(${appUrl}resources/icons/uparrow16.png)`;
			moveup.style.zIndex = i;
			if (i < frame.layers.length - 1) moveup.onclick = (event) => {
				var id = event.srcElement.style.zIndex;
				pixelFlux.sprite.getCurrentFrame();
				sprite.moveLayerUp(~~id);
				pixelFlux.sprite.updateCanvasChain();
				pixelFlux.updateCanvasAndPreview();
				pixelFlux.sprite.pushToUndoHistory();
				pixelFlux.renderLayersWindow();
			};
			else moveup.style.opacity = "30%";
			layercontrols.appendChild(moveup);
			var layerdelete = document.createElement("div");
			layerdelete.classList.add("layercontrolbutton");
			layerdelete.style.backgroundImage = `url(${appUrl}resources/icons/deleteicon.png)`;
			layerdelete.style.zIndex = i;
			layerdelete.onclick = (event) => {
				console.log(event);
				var id = event.srcElement.style.zIndex;
				pixelFlux.sprite.getCurrentFrame();
				sprite.deleteLayer(~~id);
				pixelFlux.sprite.updateCanvasChain();
				pixelFlux.updateCanvasAndPreview();
				pixelFlux.renderFramesWindow();
				pixelFlux.sprite.pushToUndoHistory();
			};
			layercontrols.appendChild(layerdelete);
			var layersettings = document.createElement("div");
			layersettings.classList.add("layercontrolbutton");
			layersettings.style.backgroundImage = `url(${appUrl}resources/icons/settingsicon.png)`;
			layersettings.zIndex = i;
			layersettings.onclick = (event) => {
				var id = event.srcElement.zIndex;
				pixelFlux.sprite.getCurrentFrame();
				pixelFlux.showLayerSettings(id);
			};
			layerinfo.appendChild(layername);
			layerinfo.appendChild(editlayername);
			layerinfo.appendChild(layercontrols);
			layercontainer.appendChild(canvas);
			layercontainer.appendChild(layerinfo);
			container.appendChild(layercontainer);
		}
	}
	renderFramesWindow() {
		var container = document.getElementById("FRAMESCONTENT");
		container.style.height = "100%";
		container.innerHTML = "";
		container.style.overflowY = "scroll";
		var frameNumber = 0;
		var count = this.sprite.frames.length;
		this.sprite.frames.forEach((frame) => {
			var i = frameNumber;
			var framesideleft = new Image();
			var framesideright = new Image();
			framesideleft.src = appUrl + "resources/icons/moviesides.png";
			framesideright.src = appUrl + "resources/icons/moviesides.png";
			framesideleft.classList.add("frameside");
			framesideright.classList.add("frameside");
			var framecontainer = document.createElement("div");
			framecontainer.classList.add("framecontainer");
			if (i == this.sprite.currentFrame) framecontainer.classList.add("framecontainercurrent");
			var canvas = document.createElement("canvas");
			canvas.classList.add("framepreview");
			canvas.width = 32;
			canvas.height = 32;
			canvas.style.zIndex = frameNumber;
			canvas.getContext("2d").drawImage(frame.canvas, 0, 0, frame.width, frame.height, 0, 0, canvas.width, canvas.height);
			canvas.onclick = (event) => {
				var id = ~~event.srcElement.style.zIndex;
				pixelFlux.sprite.setCurrentFrame(id);
				pixelFlux.sprite.updateCanvasChain();
				pixelFlux.updateCanvasAndPreview();
			};
			var frametools = document.createElement("div");
			frametools.classList.add("frametools");
			var movedown = document.createElement("div");
			movedown.classList.add("layercontrolbutton");
			movedown.style.backgroundImage = `url(${appUrl}resources/icons/downarrow16.png)`;
			movedown.zIndex = i;
			if (i < count - 1) movedown.onclick = (event) => {
				var id = event.srcElement.zIndex;
				pixelFlux.sprite.moveFrameForward(id);
				pixelFlux.sprite.updateCanvasChain();
				pixelFlux.updateCanvasAndPreview();
				pixelFlux.sprite.pushToUndoHistory();
			};
			else movedown.style.opacity = "30%";
			frametools.appendChild(movedown);
			var moveup = document.createElement("div");
			moveup.classList.add("layercontrolbutton");
			moveup.style.backgroundImage = `url(${appUrl}resources/icons/uparrow16.png)`;
			moveup.zIndex = i;
			if (i > 0) moveup.onclick = (event) => {
				var id = event.srcElement.zIndex;
				pixelFlux.sprite.moveFrameBackward(id);
				pixelFlux.sprite.updateCanvasChain();
				pixelFlux.updateCanvasAndPreview();
				pixelFlux.sprite.pushToUndoHistory();
			};
			else moveup.style.opacity = "30%";
			frametools.appendChild(moveup);
			var copy = document.createElement("div");
			copy.classList.add("layercontrolbutton");
			copy.style.backgroundImage = `url(${appUrl}resources/icons/copyframeicon.png)`;
			copy.zIndex = i;
			copy.onclick = (event) => {
				var id = event.srcElement.zIndex;
				pixelFlux.sprite.copyFrame(id);
				pixelFlux.sprite.updateCanvasChain();
				pixelFlux.updateCanvasAndPreview();
				pixelFlux.sprite.pushToUndoHistory();
			};
			frametools.appendChild(copy);
			var insert = document.createElement("div");
			insert.classList.add("layercontrolbutton");
			insert.style.backgroundImage = `url("${appUrl}resources/icons/insertframeicon.png")`;
			insert.zIndex = i;
			insert.onclick = (event) => {
				var id = event.srcElement.zIndex;
				pixelFlux.sprite.insertFrameAfter(id);
				pixelFlux.sprite.updateCanvasChain();
				pixelFlux.updateCanvasAndPreview();
				pixelFlux.sprite.pushToUndoHistory();
			};
			frametools.appendChild(insert);
			var deleteframe = document.createElement("div");
			deleteframe.classList.add("layercontrolbutton");
			deleteframe.style.backgroundImage = `url("${appUrl}resources/icons/deleteicon.png")`;
			deleteframe.zIndex = i;
			if (this.sprite.frames.length > 1) deleteframe.onclick = (event) => {
				var id = event.srcElement.zIndex;
				pixelFlux.sprite.deleteFrame(id);
				pixelFlux.sprite.updateCanvasChain();
				pixelFlux.updateCanvasAndPreview();
				pixelFlux.sprite.pushToUndoHistory();
			};
			else deleteframe.style.opacity = "30%";
			frametools.appendChild(deleteframe);
			framecontainer.appendChild(framesideleft);
			framecontainer.appendChild(canvas);
			framecontainer.appendChild(framesideright);
			framecontainer.appendChild(frametools);
			container.appendChild(framecontainer);
			frameNumber++;
		});
	}
	toolDown(x, y, button) {
		log("TOOL DOWN: " + x + ", " + y + ", " + button);
		if (this.currentTool.enabled) {
			if (x < 0 || y < 0 || x > this.sprite.width - 1 || y > this.sprite.height - 1) return;
			this.sprite.pushToUndoHistory();
			this.currentTool.alpha = document.getElementById("COLOUROPACITY").value;
			var priColour = document.getElementById("PRIMARYCOLOURPICKER").value;
			var secColour = document.getElementById("SECONDARYCOLOURPICKER").value;
			this.currentTool.down(x, y, priColour, secColour, button);
			this.updateCanvasAndPreview();
		}
	}
	toolUp(x, y, button) {
		if (this.currentTool.enabled) {
			var priColour = document.getElementById("PRIMARYCOLOURPICKER").value;
			var secColour = document.getElementById("SECONDARYCOLOURPICKER").value;
			this.currentTool.up(x, y, priColour, secColour, button);
			this.updateCanvasAndPreview();
		}
	}
	toolDrag(x1, y1, x2, y2, button) {
		if (this.currentTool.enabled) {
			if (x1 < 0 || y1 < 0 || x2 < 0 || y2 < 0 || x1 > this.sprite.width - 1 || x2 > this.sprite.width - 1 || y1 > this.sprite.height - 1 || y2 > this.sprite.height - 1) return;
			var priColour = document.getElementById("PRIMARYCOLOURPICKER").value;
			var secColour = document.getElementById("SECONDARYCOLOURPICKER").value;
			this.currentTool.drag(x1, y1, x2, y2, priColour, secColour, button);
			this.updateCanvasAndPreview();
		}
	}
	inSelection(x, y) {
		if (this.currentSelection.enabled) {
			if (x < this.currentSelection.x1 || x > this.currentSelection.x2) return false;
			if (y < this.currentSelection.y1 || y > this.currentSelection.y2) return false;
		}
		return true;
	}
	createNewSprite(x, y) {
		flux.showModalMessageBox("Create a New Sprite?", "Your current image will be lost.  Are you sure you want to proceed?", (result) => {
			if (result) this.sprite = new Sprite(x, y);
		});
	}
	setSpriteName() {
		return new Promise((resolve, reject) => {
			flux.showModalQuestionWindow("Please enter a name for your Sprite...", this.sprite.name, "Save", "cancel", (response) => {
				if (response) {
					this.sprite.name = response;
					resolve(true);
				}
			});
		});
	}
	saveSprite() {
		flux.showModalQuestionWindow("Please enter a name for your Sprite...", this.sprite.name, "Save", "cancel", (response) => {
			if (response) {
				var spriteData = new Sprite();
				spriteData.loadFromSprite(this.sprite);
				spriteData.name = response;
				this.sprite.name = response;
				var save = {
					isSprite: true,
					name: response,
					spriteData
				};
				localStorage.setItem(response, JSON.stringify(save));
			}
		});
	}
	saveSpriteOnline() {
		flux.showModalQuestionWindow("Please enter a name for your Sprite...", this.sprite.name, "Save", "cancel", (response) => {
			if (response) {
				var spriteData = new Sprite();
				spriteData.loadFromSprite(this.sprite);
				spriteData.name = response;
				var save = {
					isSprite: true,
					name: response,
					spriteData
				};
				post("/save", save);
			}
		});
	}
	loadFromServer(name) {
		get("/data/" + name).then((r) => {
			var res = JSON.parse(r);
			pixelFlux.sprite.loadFromSprite(res.spriteData);
			pixelFlux.updateCanvasAndPreview();
		}).catch((e) => {
			console.log(e);
		});
	}
	showLoadGallery() {
		var outercontainer = document.getElementById("OPENGALLERYCONTENT");
		outercontainer.style.overflowY = "scroll";
		outercontainer.innerHTML = "";
		let container = document.createElement("div");
		let fileInfoDiv = document.createElement("div");
		fileInfoDiv.classList.add("file-info");
		fileInfoDiv.id = "file-info";
		fileInfoDiv.innerHTML = "Sprite Name: ";
		outercontainer.appendChild(fileInfoDiv);
		outercontainer.appendChild(container);
		container.style.paddingTop = "32px";
		let spanBrowserStore = document.createElement("h3");
		spanBrowserStore.classList.add("load-screen-title");
		spanBrowserStore.innerHTML += "Local Browser Storage";
		container.appendChild(spanBrowserStore);
		var count = localStorage.length;
		for (var i = 0; i < count; i++) {
			var key = localStorage.key(i);
			var item = JSON.parse(localStorage.getItem(key));
			if (item.isSprite) [item].forEach((item) => {
				var s = new Sprite(64, 64);
				s.loadFromSprite(item.spriteData);
				var div = document.createElement("div");
				div.classList.add("gallerydiv");
				var canvas = document.createElement("canvas");
				canvas.width = 64;
				canvas.height = 64;
				canvas.classList.add("gallerycanvas");
				canvas.id = key;
				var del = document.createElement("div");
				del.classList.add("gallerydelete");
				del.innerHTML = "x";
				del.onclick = (event) => {
					var key = event.srcElement.parentElement.firstChild.id;
					localStorage.removeItem(key);
					event.srcElement.parentElement.remove();
				};
				var pallet = document.createElement("img");
				pallet.src = appUrl + "resources/icons/palleticonx16.png";
				pallet.classList.add("gallerypalleticon");
				pallet.onclick = (event) => {
					pixelFlux.importPalletFromSprite(s);
					flux.hideWindow("OPENGALLERY");
				};
				var bg = document.createElement("img");
				bg.src = appUrl + "resources/icons/bgicon.png";
				bg.classList.add("gallerybgicon");
				bg.onclick = (event) => {
					var bgurl = s.canvas.toDataURL();
					var ls = document.querySelectorAll(".flux-windowchequered");
					for (var i = 0; i < ls.length; i++) ls[i].style.backgroundImage = "url(" + bgurl + ")";
					flux.hideWindow("OPENGALLERY");
				};
				canvas.onmouseover = (event) => {
					console.log(s);
					document.getElementById("file-info").innerHTML = "Sprite Name: " + s.name;
				};
				div.appendChild(canvas);
				div.appendChild(del);
				div.appendChild(pallet);
				div.appendChild(bg);
				container.appendChild(div);
				canvas.onclick = (event) => {
					var load = JSON.parse(localStorage.getItem(event.srcElement.id));
					load.spriteData.name = load.name;
					pixelFlux.sprite.loadFromSprite(load.spriteData);
					pixelFlux.updateCanvasAndPreview();
					flux.hideWindow("OPENGALLERY");
				};
				s.drawToCanvasId(key, 0, 0, 64 / s.height);
			});
		}
		flux.showWindow("OPENGALLERY");
		this.appendServerSpritesToOpenGallery();
	}
	appendServerSpritesToOpenGallery() {
		get("/mysprites").then((response) => {
			if (JSON.parse(response).errorCode > 0) {
				console.log("Failed to load server side sprite list");
				console.log(response);
				google.accounts.id.prompt();
				return;
			}
			var container = document.getElementById("OPENGALLERYCONTENT");
			let spanServerStore = document.createElement("h3");
			spanServerStore.classList.add("load-screen-title");
			spanServerStore.innerHTML += "PixelFlux Server Storage";
			container.appendChild(spanServerStore);
			var spriteList = JSON.parse(response);
			if (spriteList.length > 0) spriteList.forEach((entry) => {
				let spriteId = entry.id;
				get("/load?id=" + spriteId).then((res) => {
					let item = JSON.parse(res).spriteData;
					if (item.isSprite) {
						var s = new Sprite(64, 64);
						s.loadFromSprite(item.spriteData);
						var div = document.createElement("div");
						div.classList.add("gallerydiv");
						var canvas = document.createElement("canvas");
						canvas.width = 64;
						canvas.height = 64;
						canvas.classList.add("gallerycanvas");
						canvas.id = spriteId;
						var pallet = document.createElement("img");
						pallet.src = appUrl + "resources/icons/palleticonx16.png";
						pallet.classList.add("gallerypalleticon");
						pallet.onclick = (event) => {
							pixelFlux.importPalletFromSprite(s);
							flux.hideWindow("OPENGALLERY");
						};
						var bg = document.createElement("img");
						bg.src = appUrl + "resources/icons/bgicon.png";
						bg.classList.add("gallerybgicon");
						bg.onclick = (event) => {
							var bgurl = s.canvas.toDataURL();
							var ls = document.querySelectorAll(".flux-windowchequered");
							for (var i = 0; i < ls.length; i++) ls[i].style.backgroundImage = "url(" + bgurl + ")";
							flux.hideWindow("OPENGALLERY");
						};
						canvas.onmouseover = (event) => {
							console.log(s);
							document.getElementById("file-info").innerHTML = "Sprite Name: " + s.name;
						};
						div.appendChild(canvas);
						div.appendChild(pallet);
						div.appendChild(bg);
						container.appendChild(div);
						canvas.onclick = (event) => {
							var load = item;
							load.spriteData.name = load.name;
							pixelFlux.sprite.loadFromSprite(load.spriteData);
							pixelFlux.updateCanvasAndPreview();
							flux.hideWindow("OPENGALLERY");
						};
						s.drawToCanvasId(spriteId, 0, 0, 64 / s.height);
					}
				});
			});
		});
	}
	importPalletFromSprite(s) {
		var added = new Array();
		document.getElementById("COLOURPALLETSTORE").innerHTML = "";
		s.frames.forEach((f) => {
			f.layers.forEach((l) => {
				l.pixels.forEach((p) => {
					var colour = "rgb(" + p.red + "," + p.green + "," + p.blue + ")";
					if (!added.includes(colour)) {
						this.addColourToPallet(colour);
						added.push(colour);
					}
				});
			});
		});
	}
	setBackgroundColour() {
		var priColour = document.getElementById("PRIMARYCOLOURPICKER").value;
		var elements = document.getElementsByClassName("flux-windowchequered");
		for (var i = 0; i < elements.length; i++) elements[i].style.backgroundColor = priColour;
	}
	downloadGif() {
		this.sprite.updateCanvasChain();
		log("Starting GIF create process");
		var gif = new GIF({
			workers: 2,
			quality: 10,
			workerScript: "./js/common/gif.worker.js",
			width: this.sprite.width,
			height: this.sprite.height,
			transparent: true
		});
		this.sprite.frames.forEach((frame) => {
			gif.addFrame(frame.canvas, { delay: 1e3 / 14 });
		});
		gif.on("finished", function(blob) {
			let gifUrl = URL.createObjectURL(blob);
			if (gifUrl);
			console.log(gifUrl);
			let gifPreview = new Image();
			gifPreview.src = gifUrl;
			gifPreview.classList.add("gifpreviewimg");
			let dlLink = document.createElement("a");
			dlLink.href = gifUrl;
			dlLink.setAttribute("download", pixelFlux.sprite.name);
			dlLink.appendChild(gifPreview);
			document.getElementById("GIFDISPLAYCONTENT").innerHTML = "";
			flux.appendWindowContent("GIFDISPLAY", dlLink);
			document.getElementById("GIFDISPLAYCONTENT").style.height = "100%";
			document.getElementById("GIFDISPLAYCONTENT").style.paddingTop = "40px";
			flux.addWindowContent("GIFDISPLAY", "<br><br><center>Click to Download</center>");
			gifPreview.onload = (e) => {
				flux.showWindow("GIFDISPLAY");
			};
		});
		gif.render();
	}
};
var PixelBrush = class {
	constructor(c) {
		this.name = "";
		this.func = 1;
		this.width = false;
		this.height = false;
		this.opacityArray = false;
	}
	loadFromPixelArray(width, heigth, name, pixelArray) {}
	loadFromOpacityArray(width, height, name, opacityArray) {
		if (width * height != opacityArray.length) {
			console.log("opacityArray not provided or does not contain correct number of pixels");
			this.loadDefaultBrush();
			return;
		} else {
			this.width = width;
			this.height = height;
			this.name = name;
			this.opacityArray = new Array();
			opacityArray.forEach((a) => {
				this.opacityArray.push(a);
			});
		}
	}
	loadDefaultBrush() {
		this.width = 3;
		this.height = 3;
		this.opacityArray = [
			.8,
			1,
			.8,
			1,
			1,
			1,
			.8,
			1,
			.8
		];
	}
	paint(sprite, frameNumber, layerNumber, x, y, color, opacity) {
		let offsetX = Math.round(this.width / 2) - this.width % 2;
		let offsetY = Math.round(this.height / 2) - this.height % 2;
		let layer = sprite.frames[frameNumber].layers[layerNumber];
		for (let sY = 0; sY < this.height; sY++) for (let sX = 0; sX < this.width; sX++) {
			let oIndex = sY * this.width + sX;
			let drawX = x - offsetX + sX;
			let drawY = y - offsetY + sY;
			if (drawX > -1 && drawX < sprite.width && drawY > -1 && drawY < sprite.height) switch (this.func) {
				case 0:
					this.setPixel(layer, drawX, drawY, color.r, color.g, color.b, this.opacityArray[oIndex] * 255, opacity);
					break;
				case 1:
					this.paintPixel(layer, drawX, drawY, color.r, color.g, color.b, this.opacityArray[oIndex] * 255, opacity);
					break;
				case 2: break;
				case FUNC_LIGTHEN: break;
				case 4: break;
			}
		}
		sprite.updateCanvasChain();
		pixelFlux.updateCanvasAndPreview();
	}
	setPixel(layer, drawX, drawY, r, g, b, a) {
		layer.getPixel(drawX, drawY).getRGBA();
		layer.setPixelRGBA(drawX, drawY, r, g, b, a);
	}
	paintPixel(layer, drawX, drawY, r, g, b, a, opacity) {
		let currentColor = layer.getPixel(drawX, drawY).getRGBA();
		let newColor = this.blend(currentColor, {
			r,
			g,
			b,
			a
		}, opacity);
		layer.setPixelRGBA(drawX, drawY, newColor.r, newColor.g, newColor.b, newColor.a, 0, 255);
	}
	blend(c1, c2, opacity) {
		c1 = normaliseColor(c1);
		c2 = normaliseColor(c2);
		c1.mag = magnitude3v(c1.r, c1.g, c1.b);
		c2.mag = magnitude3v(c2.r, c2.g, c2.b);
		c1.r = this.factorTo(c2.r, c1.r, c1.a);
		c1.g = this.factorTo(c2.g, c1.g, c1.a);
		c1.b = this.factorTo(c2.b, c1.b, c1.a);
		c1.mag = this.factorTo(c2.mag, c1.mag, c1.a);
		let targetMag = c1.mag + (c2.mag - c1.mag) * opacity;
		let c = {};
		c.r = this.factorTo(c1.r, c2.r, opacity * c2.a);
		c.g = this.factorTo(c1.g, c2.g, opacity * c2.a);
		c.b = this.factorTo(c1.b, c2.b, opacity * c2.a);
		let normalisedVector = normalise3v(c.r, c.g, c.b);
		c.r = normalisedVector.r * targetMag;
		c.g = normalisedVector.g * targetMag;
		c.b = normalisedVector.b * targetMag;
		c.a = c1.a + c2.a * opacity;
		c.r = bound(c.r * 255, 0, 255);
		c.b = bound(c.b * 255, 0, 255);
		c.g = bound(c.g * 255, 0, 255);
		c.a = bound(c.a * 255, 0, 255);
		return c;
	}
	darkenPixel(layer, drawX, drawY, opacity) {
		let currentColor = layer.getPixel(drawX, drawY).getRGBA();
		let adjuster = 1 - opacity;
		let newColor = {
			r: bound(currentColor.r * adjuster, 0, 255),
			g: bound(currentColor.g * adjuster, 0, 255),
			b: bound(currentColor.b * adjuster, 0, 255),
			a: bound(currentColor.a, 0, 255)
		};
		layer.setPixelRGBA(drawX, drawY, newColor.r, newColor.g, newColor.b, newColor.a);
	}
	lightenPixel(layer, drawX, drawY, opacity) {
		let currentColor = layer.getPixel(drawX, drawY).getRGBA();
		let adjuster = opacity * this.opacity;
		let newColor = {
			r: bound(currentColor.r + adjuster * 255, 0, 255),
			g: bound(currentColor.g + adjuster * 255, 0, 255),
			b: bound(currentColor.b + adjuster * 255, 0, 255),
			a: bound(currentColor.a, 0, 255)
		};
		layer.setPixelRGBA(drawX, drawY, newColor.r, newColor.g, newColor.b, newColor.a);
	}
	factorTo(o, n, factor) {
		return o + (n - o) * factor;
	}
};
//#endregion
//#region src/js/common/automator.js
var AutomationPlugin = class {
	constructor() {
		this.name = "";
		this.description = "";
		this.sourceCode = "";
		this.function = false;
		console.log(`
You have created a new plugin.  Welcome to the wonderful world of pixelflux scripting! Here are a few pointers to help you along the way.
            
app = The pixelflux application run app.help() for more information
sprite = The sprite you currently have loaded.  sprite.help() will get you going

`);
	}
	run(x, y, pri, sec, rightClick) {
		this.function(x, y, pri, sec, rightClick);
	}
	loadSourceFromURL(url) {
		get$1(url).then((r) => {
			this.sourceCode = r;
			this.function = window.eval(r);
			this.ready = true;
		});
	}
	load(script) {
		this.function = window.eval(script);
	}
};
//#endregion
//#region src/js/common/drawingtools.js
function addToolButtonEventListeners() {
	document.addEventListener("toolButtonClicked", (event) => {
		switch (event.detail.srcElement.id) {
			case "SELECTION":
				log("Selection Tool Selected");
				pixelFlux$1.currentTool = new Selection(pixelFlux$1.sprite);
				break;
			case "MOVE":
				log("Move Tool Selected");
				pixelFlux$1.currentTool = new Move(pixelFlux$1.sprite);
				break;
			case "PENCIL":
				log("Pencil Tool Selected");
				pixelFlux$1.currentTool = new Pencil(pixelFlux$1.sprite);
				break;
			case "ERASER":
				log("Eraser Tool Selected");
				pixelFlux$1.currentTool = new Eraser(pixelFlux$1.sprite);
				break;
			case "BRUSH":
				log("Brush Tool Selected");
				pixelFlux$1.currentTool = new Brush(pixelFlux$1.sprite);
				break;
			case "SPRAYCAN":
				log("Spray Can Tool Selected");
				pixelFlux$1.currentTool = new SprayCan(pixelFlux$1.sprite);
				break;
			case "FLOODFILL":
				log("Flood Fill Tool Selected");
				pixelFlux$1.currentTool = new FloodFill(pixelFlux$1.sprite);
				break;
			case "DARKENLIGHTEN":
				log("Darken Lighten Tool Selected");
				pixelFlux$1.currentTool = new DarkenLighten(pixelFlux$1.sprite);
				break;
			case "BLEND":
				log("Blend Tool Selected");
				pixelFlux$1.currentTool = new Blend(pixelFlux$1.sprite);
				break;
			case "STRAIGHTLINE":
				log("Straight Line Tool Selected");
				pixelFlux$1.currentTool = new StraightLine(pixelFlux$1.sprite);
				break;
			case "SQUARE":
				log("Square Tool Selected");
				pixelFlux$1.currentTool = new Square(pixelFlux$1.sprite);
				break;
			case "FILLEDSQUARE":
				log("Filled Square Tool Selected");
				pixelFlux$1.currentTool = new FilledSquare(pixelFlux$1.sprite);
				break;
			case "ELLIPSE":
				log("Ellipse Tool Selected");
				pixelFlux$1.currentTool = new Ellipse(pixelFlux$1.sprite);
				break;
			case "FILLEDELLIPSE":
				log("Filled Ellipse Tool Selected");
				pixelFlux$1.currentTool = new FilledEllipse(pixelFlux$1.sprite);
				break;
			case "PLUGIN":
				log("Plugin Tool Selected");
				pixelFlux$1.currentTool = new Plugin(pixelFlux$1.sprite);
				break;
		}
	});
}
var Selection = class {
	constructor(sprite) {
		this.sprite = sprite;
		this.sourceSprite = new Sprite(this.sprite.width, this.sprite.height);
		this.alpha = 255;
		this.enabled = true;
		this.startX = 0;
		this.startY = 0;
		this.toolOptions = "None Available!";
		document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions;
	}
	down(x, y, pri, sec, btn) {
		this.startX = x;
		this.startY = y;
	}
	up(x, y, pri, sec) {
		if (y < this.startY) y -= 1;
		if (x < this.startX) x -= 1;
		pixelFlux$1.currentSelection = {
			enabled: true,
			x1: this.startX,
			y1: this.startY,
			x2: x,
			y2: y
		};
	}
	drag(x1, y1, x2, y2, pri, sec, btn) {
		if (y2 < this.startY) y2 -= 1;
		if (x2 < this.startX) x2 -= 1;
		pixelFlux$1.currentSelection = {
			enabled: true,
			x1: this.startX,
			y1: this.startY,
			x2,
			y2
		};
	}
};
var Move = class {
	constructor(sprite) {
		this.sprite = sprite;
		this.canvas = document.createElement("canvas");
		this.canvas.width = this.sprite.width;
		this.canvas.height = this.sprite.height;
		this.context = this.canvas.getContext("2d");
		this.layerContext = null;
		this.alpha = 255;
		this.enabled = true;
		this.startX = 0;
		this.startY = 0;
		this.toolOptions = "Click an drag to move on the canvas.  Try it with the select tool!";
		document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions;
	}
	down(x, y, pri, sec, btn) {
		this.startX = x;
		this.startY = y;
		this.canvas = document.createElement("canvas");
		this.canvas.width = this.sprite.width;
		this.canvas.height = this.sprite.height;
		this.context = this.canvas.getContext("2d");
		this.layerContext = null;
		this.layerContext = this.sprite.getCurrentCanvasContext();
		this.context.drawImage(this.layerContext.canvas, 0, 0, this.sprite.width, this.sprite.height, 0, 0, this.sprite.width, this.sprite.height);
	}
	up(x, y, pri, sec) {
		this.sprite.updateCurrentLayerPixelArray();
		pixelFlux$1.currentSelection.enabled = false;
	}
	drag(x1, y1, x2, y2, pri, sec, btn) {
		if (pixelFlux$1.currentSelection.enabled) {
			this.sprite.updateCurrentLayerCanvas();
			var sX = pixelFlux$1.currentSelection.x1;
			var sY = pixelFlux$1.currentSelection.y1;
			var sW = pixelFlux$1.currentSelection.x2 - sX + 1;
			var sH = pixelFlux$1.currentSelection.y2 - sY + 1;
			this.layerContext.clearRect(sX, sY, sW, sH);
			var x = x2 - this.startX + sX;
			var y = y2 - this.startY + sY;
			this.layerContext.drawImage(this.canvas, sX, sY, sW, sH, x, y, sW, sH);
			this.sprite.updateCanvasChain();
		} else {
			this.sprite.updateCurrentLayerCanvas();
			this.layerContext.clearRect(0, 0, this.sprite.width, this.sprite.height);
			var x = x2 - this.startX;
			var y = y2 - this.startY;
			this.layerContext.drawImage(this.canvas, x, y);
			this.sprite.updateCanvasChain();
		}
	}
};
var Pencil = class {
	constructor(sprite) {
		this.sprite = sprite;
		this.alpha = 255;
		this.enabled = true;
		this.toolOptions = "Left Click - Primary<br>Right Click - Secondary<br>Middle Click - Erase";
		document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions;
	}
	down(x, y, pri, sec, btn) {
		var col = pri;
		if (btn == 2) col = sec;
		if (btn == 4 || keyboard.isDown(16)) {
			col = "#000000";
			this.alpha = 0;
		}
		if (pixelFlux$1.inSelection(x, y)) this.sprite.setPixelHex(x, y, col, this.alpha);
	}
	up(x, y, pri, sec) {}
	drag(x1, y1, x2, y2, pri, sec, btn) {
		var col = pri;
		if (btn == 2) col = sec;
		if (btn == 4 || keyboard.isDown(16)) {
			col = "#000000";
			this.alpha = 0;
		}
		if (pixelFlux$1.inSelection(x2, y2)) this.sprite.setPixelHex(x2, y2, col, this.alpha);
	}
};
var Eraser = class {
	constructor(sprite) {
		this.sprite = sprite;
		this.alpha = document.getElementById("COLOUROPACITY").value;
		this.enabled = true;
		this.toolOptions = "No options for this tool!";
		document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions;
	}
	down(x, y, pri, sec, btn) {
		this.sprite.reducePixelAlpha(x, y, this.alpha);
	}
	up(x, y, pri, sec) {}
	drag(x1, y1, x2, y2, pri, sec, btn) {
		this.sprite.reducePixelAlpha(x1, y1, this.alpha);
		this.sprite.reducePixelAlpha(x2, y2, this.alpha);
	}
};
var Brush = class {
	constructor(sprite) {
		this.lastX = 0;
		this.lastY = 0;
		this.sprite = sprite;
		this.alpha = document.getElementById("COLOUROPACITY").value;
		this.enabled = true;
		this.toolOptions = "No options for this tool!";
		document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions;
		this.brush = new PixelBrush(3, 3, 1);
		this.brush.loadDefaultBrush();
	}
	down(x, y, pri, sec, btn) {
		this.alpha = document.getElementById("COLOUROPACITY").value;
		let col = pri;
		if (btn == 2) col = sec;
		let color = hex2rgba(col);
		color.a = 255;
		this.brush.paint(this.sprite, this.sprite.currentFrame, this.sprite.getCurrentFrame().currentLayer, x, y, color, n255(this.alpha));
		this.lastX = x;
		this.lastY = y;
	}
	up(x, y, pri, sec) {}
	drag(x1, y1, x2, y2, pri, sec, btn) {
		if (this.lastX == x2 && this.lastY == y2) return;
		this.lastX = x2;
		this.lastY = y2;
		var col = pri;
		if (btn == 2) col = sec;
		let color = hex2rgba(col);
		color.a = 255;
		this.brush.paint(this.sprite, this.sprite.currentFrame, this.sprite.getCurrentFrame().currentLayer, x2, y2, color, n255(this.alpha));
	}
};
var SprayCan = class {
	constructor(sprite) {
		this.sprite = sprite;
		this.alpha = 255;
		this.enabled = true;
		this.radius = 6;
		this.toolOptions = "<div class='flux-slidercontainer'><input type='range' min='1' max='10' value='2' class='flux-slider' id='SPRAYCANRADIUS'></div><div class='flux-label sprayradiuslabel'>Spray Radius</div>";
		document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions;
	}
	down(x, y, pri, sec, btn) {
		var col = pri;
		if (btn == 2) col = sec;
		this.radius = document.getElementById("SPRAYCANRADIUS").value;
		this.sprite.setPixelHex(x + (rand(this.radius * 2) - this.radius), y + (rand(this.radius * 2) - this.radius), col, this.alpha);
	}
	up(x, y, pri, sec) {}
	drag(x1, y1, x2, y2, pri, sec, btn) {
		var col = pri;
		if (btn == 2) col = sec;
		this.sprite.setPixelHex(x2 + (rand(this.radius * 2) - this.radius), y2 + (rand(this.radius * 2) - this.radius), col, this.alpha);
	}
};
var FloodFill = class {
	constructor(sprite) {
		this.sprite = sprite;
		this.alpha = 255;
		this.enabled = true;
		this.toolOptions = "No options for this tool!";
		document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions;
	}
	down(x, y, pri, sec, btn) {
		var col = pri;
		if (btn == 2) col = sec;
		var p = this.sprite.getPixelRGBA(x, y);
		this.fillingColour = {
			r: p.r,
			g: p.g,
			b: p.b
		};
		this.newColour = hex2rgb(col);
		this.fillPixel(x, y);
	}
	up(x, y, pri, sec) {}
	drag(x1, y1, x2, y2, pri, sec) {}
	fillPixel(x, y) {
		var w = pixelFlux$1.currentTool.sprite.width;
		var h = pixelFlux$1.currentTool.sprite.height;
		if (x < 0 || y < 0 || x > w - 1 || y > h - 1) return;
		var pcol = pixelFlux$1.currentTool.sprite.getPixelRGBA(x, y);
		if (pcol.r != pixelFlux$1.currentTool.fillingColour.r || pcol.g != pixelFlux$1.currentTool.fillingColour.g || pcol.b != pixelFlux$1.currentTool.fillingColour.b) return;
		if (pcol.r != pixelFlux$1.currentTool.newColour.r || pcol.g != pixelFlux$1.currentTool.newColour.g || pcol.b != pixelFlux$1.currentTool.newColour.b) {
			pixelFlux$1.currentTool.sprite.setPixelRGBA(x, y, pixelFlux$1.currentTool.newColour.r, pixelFlux$1.currentTool.newColour.g, pixelFlux$1.currentTool.newColour.b, pixelFlux$1.currentTool.alpha);
			pixelFlux$1.updateCanvasAndPreview();
			setTimeout(() => {
				pixelFlux$1.currentTool.fillPixel(x - 1, y);
			}, .1);
			setTimeout(() => {
				pixelFlux$1.currentTool.fillPixel(x, y - 1);
			}, .1);
			setTimeout(() => {
				pixelFlux$1.currentTool.fillPixel(x + 1, y);
			}, .1);
			setTimeout(() => {
				pixelFlux$1.currentTool.fillPixel(x, y + 1);
			}, .1);
		}
	}
};
var DarkenLighten = class {
	constructor(sprite) {
		this.sprite = sprite;
		this.alpha = 255;
		this.enabled = true;
		this.amount = 2;
		this.toolOptions = "<div class='flux-slidercontainer'><input type='range' min='1' max='10' value='2' class='flux-slider' id='DARKENLIGHTENAMOUNT'></div><div class='flux-label sprayradiuslabel'>Darken/Lighten Amount</div>";
		document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions;
	}
	down(x, y, pri, sec, btn) {
		this.amount = document.getElementById("DARKENLIGHTENAMOUNT").value;
		if (btn > 1) this.amount = this.amount * -1;
		var rgba = this.sprite.getPixelRGBA(x, y);
		rgba.r = bound$1(rgba.r - this.amount, 0, 255);
		rgba.g = bound$1(rgba.g - this.amount, 0, 255);
		rgba.b = bound$1(rgba.b - this.amount, 0, 255);
		this.sprite.setPixelRGBA(x, y, rgba.r, rgba.g, rgba.b, rgba.a);
	}
	up(x, y, pri, sec) {}
	drag(x1, y1, x2, y2, pri, sec, btn) {
		this.amount = document.getElementById("DARKENLIGHTENAMOUNT").value;
		if (btn > 1) this.amount = this.amount * -1;
		var rgba = this.sprite.getPixelRGBA(x2, y2);
		rgba.r = bound$1(rgba.r - this.amount, 0, 255);
		rgba.g = bound$1(rgba.g - this.amount, 0, 255);
		rgba.b = bound$1(rgba.b - this.amount, 0, 255);
		this.sprite.setPixelRGBA(x2, y2, rgba.r, rgba.g, rgba.b, rgba.a);
	}
};
var Blend = class {
	constructor(sprite) {
		this.sprite = sprite;
		this.alpha = 255;
		this.enabled = true;
		this.amount = 2;
		this.toolOptions = "No options Yet :P";
		document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions;
	}
	down(x, y, pri, sec, btn) {
		var c1 = this.sprite.getPixelRGBA(x, y);
		var c2 = this.sprite.getPixelRGBA(x - 1, y);
		var c3 = this.sprite.getPixelRGBA(x, y - 1);
		var c4 = this.sprite.getPixelRGBA(x + 1, y);
		var c5 = this.sprite.getPixelRGBA(x, y + 1);
		var rgba = {};
		rgba.r = (c1.r + c2.r + c3.r + c4.r + c5.r) / 5;
		rgba.g = (c1.g + c2.g + c3.g + c4.g + c5.g) / 5;
		rgba.b = (c1.b + c2.b + c3.b + c4.b + c5.b) / 5;
		rgba.a = (c1.a + c2.a + c3.a + c4.a + c5.a) / 5;
		this.sprite.setPixelRGBA(x, y, rgba.r, rgba.g, rgba.b, rgba.a);
	}
	up(x, y, pri, sec) {}
	drag(x1, y1, x2, y2, pri, sec, btn) {
		var x = x2;
		var y = y2;
		var c1 = this.sprite.getPixelRGBA(x, y);
		var c2 = this.sprite.getPixelRGBA(x - 1, y);
		var c3 = this.sprite.getPixelRGBA(x, y - 1);
		var c4 = this.sprite.getPixelRGBA(x + 1, y);
		var c5 = this.sprite.getPixelRGBA(x, y + 1);
		var rgba = {};
		rgba.r = (c1.r + c2.r + c3.r + c4.r + c5.r) / 5;
		rgba.g = (c1.g + c2.g + c3.g + c4.g + c5.g) / 5;
		rgba.b = (c1.b + c2.b + c3.b + c4.b + c5.b) / 5;
		rgba.a = (c1.a + c2.a + c3.a + c4.a + c5.a) / 5;
		this.sprite.setPixelRGBA(x2, y2, rgba.r, rgba.g, rgba.b, rgba.a);
	}
};
var StraightLine = class {
	constructor(sprite) {
		this.sprite = sprite;
		this.alpha = 255;
		this.enabled = true;
		this.colour = null;
		this.startX = 0;
		this.startY = 0;
		this.toolOptions = "No options for this tool!";
		document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions;
	}
	down(x, y, pri, sec, btn) {
		this.colour = pri;
		if (btn > 1) this.colour = sec;
		this.startX = x + .5;
		this.startY = y + .5;
	}
	up(x, y, pri, sec) {
		this.sprite.updateCurrentLayerPixelArray();
	}
	drag(x1, y1, x2, y2, pri, sec, btn) {
		this.sprite.updateCurrentLayerCanvas();
		var ctx = this.sprite.getCurrentCanvasContext();
		ctx.save();
		ctx.strokeStyle = this.colour;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(this.startX, this.startY);
		ctx.lineTo(x2 + .5, y2 + .5);
		ctx.stroke();
		ctx.restore();
		this.sprite.updateCanvasChain();
	}
};
var Square = class {
	constructor(sprite) {
		this.sprite = sprite;
		this.alpha = 255;
		this.enabled = true;
		this.temporaryCanvas = document.createElement("canvas");
		this.temporaryCanvas.width = this.sprite.width;
		this.temporaryCanvas.height = this.sprite.height;
		this.temporaryContext = this.temporaryCanvas.getContext("2d");
		this.colour = null;
		this.startX = 0;
		this.startY = 0;
		this.toolOptions = "No options for this tool!";
		document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions;
	}
	down(x, y, pri, sec, btn) {
		this.colour = pri;
		if (btn > 1) this.colour = sec;
		this.startX = x + .5;
		this.startY = y + .5;
	}
	up(x, y, pri, sec) {
		this.sprite.updateCurrentLayerPixelArray();
	}
	drag(x1, y1, x2, y2, pri, sec, btn) {
		this.sprite.updateCurrentLayerCanvas();
		var ctx = this.sprite.getCurrentCanvasContext();
		ctx.save();
		ctx.strokeStyle = this.colour;
		ctx.lineWidth = 1;
		ctx.strokeRect(this.startX, this.startY, x2 + .5 - this.startX, y2 + .5 - this.startY);
		ctx.restore();
		this.sprite.updateCanvasChain();
	}
};
var FilledSquare = class {
	constructor(sprite) {
		this.sprite = sprite;
		this.alpha = 255;
		this.enabled = true;
		this.colour = null;
		this.startX = 0;
		this.startY = 0;
		this.toolOptions = "No options for this tool!";
		document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions;
	}
	down(x, y, pri, sec, btn) {
		this.colour = pri;
		if (btn > 1) this.colour = sec;
		this.startX = x;
		this.startY = y;
	}
	up(x, y, pri, sec) {
		this.sprite.updateCurrentLayerPixelArray();
	}
	drag(x1, y1, x2, y2, pri, sec, btn) {
		this.sprite.updateCurrentLayerCanvas();
		var ctx = this.sprite.getCurrentCanvasContext();
		ctx.save();
		ctx.fillStyle = this.colour;
		ctx.lineWidth = 1;
		ctx.fillRect(this.startX, this.startY, x2 - this.startX, y2 - this.startY);
		ctx.restore();
		this.sprite.updateCanvasChain();
	}
};
var Ellipse = class {
	constructor(sprite) {
		this.sprite = sprite;
		this.alpha = 255;
		this.enabled = true;
		this.colour = null;
		this.startX = 0;
		this.startY = 0;
		this.toolOptions = "No options for this tool!";
		document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions;
	}
	down(x, y, pri, sec, btn) {
		this.colour = pri;
		if (btn > 1) this.colour = sec;
		this.startX = x + .5;
		this.startY = y + .5;
	}
	up(x, y, pri, sec) {
		this.sprite.updateCurrentLayerPixelArray();
	}
	drag(x1, y1, x2, y2, pri, sec, btn) {
		var centreX = this.startX + (x2 - this.startX) / 2;
		var centreY = this.startY + (y2 - this.startY) / 2;
		var radiusX = (x2 + .5 - this.startX) / 2;
		var radiusY = (y2 + .5 - this.startY) / 2;
		if (radiusX < 0) radiusX *= -1;
		if (radiusY < 0) radiusY *= -1;
		this.sprite.updateCurrentLayerCanvas();
		var ctx = this.sprite.getCurrentCanvasContext();
		ctx.save();
		ctx.strokeStyle = this.colour;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.ellipse(centreX, centreY, radiusX, radiusY, 0, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.restore();
		this.sprite.updateCanvasChain();
	}
};
var FilledEllipse = class {
	constructor(sprite) {
		this.sprite = sprite;
		this.alpha = 255;
		this.enabled = true;
		this.temporaryCanvas = document.createElement("canvas");
		this.temporaryCanvas.width = this.sprite.width;
		this.temporaryCanvas.height = this.sprite.height;
		this.temporaryContext = this.temporaryCanvas.getContext("2d");
		this.colour = null;
		this.startX = 0;
		this.startY = 0;
		this.toolOptions = "No options for this tool!";
		document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions;
	}
	down(x, y, pri, sec, btn) {
		this.colour = pri;
		if (btn > 1) this.colour = sec;
		this.startX = x + .5;
		this.startY = y + .5;
	}
	up(x, y, pri, sec) {
		this.sprite.updateCurrentLayerPixelArray();
	}
	drag(x1, y1, x2, y2, pri, sec, btn) {
		var centreX = this.startX + (x2 - this.startX) / 2;
		var centreY = this.startY + (y2 - this.startY) / 2;
		var radiusX = (x2 + .5 - this.startX) / 2;
		var radiusY = (y2 + .5 - this.startY) / 2;
		if (radiusX < 0) radiusX *= -1;
		if (radiusY < 0) radiusY *= -1;
		this.sprite.updateCurrentLayerCanvas();
		var ctx = this.sprite.getCurrentCanvasContext();
		ctx.save();
		ctx.fillStyle = this.colour;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.ellipse(centreX, centreY, radiusX, radiusY, 0, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();
		this.sprite.updateCanvasChain();
	}
};
var Plugin = class {
	constructor(sprite) {
		this.sprite = sprite;
		this.alpha = 255;
		this.enabled = true;
		this.automationPlugin = new AutomationPlugin();
		this.toolOptions = "";
		document.getElementById("TOOLOPTIONSCONTENT").innerHTML = this.toolOptions;
	}
	down(x, y, pri, sec, btn) {
		let action = "DOWN";
		let rightClick = false;
		if (btn == 2) rightClick = true;
		this.automationPlugin.run(x, y, pri, sec, rightClick, action);
	}
	up(x, y, pri, sec) {
		this.automationPlugin.run(x2, y2, pri, sec, rightClick, "UP");
	}
	drag(x1, y1, x2, y2, pri, sec, btn) {
		let action = "DRAG";
		let rightClick = false;
		if (btn == 2) rightClick = true;
		this.automationPlugin.run(x2, y2, pri, sec, rightClick, action);
	}
};
//#endregion
//#region src/js/common/menuhandler.js
function addMenuHandler() {
	document.addEventListener("menuButtonClicked", (event) => {
		log("MenuHandler: menuButtonClicked - " + event.detail.srcElementId);
		switch (event.detail.srcElementId) {
			case "HOMEPAGE":
				window.open("https://github.com/rsabbarton/PixelFlux/");
				break;
			case "FORUM":
				window.open("https://github.com/rsabbarton/PixelFlux/discussions");
				break;
			case "NEW6X6":
				pixelFlux$1.createNewSprite(6, 6);
				pixelFlux$1.drawingScale = 64;
				pixelFlux$1.previewScale = 8;
				break;
			case "NEW9X9":
				pixelFlux$1.createNewSprite(9, 9);
				pixelFlux$1.drawingScale = 48;
				pixelFlux$1.previewScale = 8;
				break;
			case "NEW16X16":
				pixelFlux$1.createNewSprite(16, 16);
				pixelFlux$1.drawingScale = 32;
				pixelFlux$1.previewScale = 8;
				break;
			case "NEW32X32":
				pixelFlux$1.createNewSprite(32, 32);
				pixelFlux$1.drawingScale = 16;
				pixelFlux$1.previewScale = 4;
				break;
			case "NEW48X48":
				pixelFlux$1.createNewSprite(48, 48);
				pixelFlux$1.drawingScale = 12;
				pixelFlux$1.previewScale = 3;
				break;
			case "NEW64X64":
				pixelFlux$1.createNewSprite(64, 64);
				pixelFlux$1.drawingScale = 8;
				pixelFlux$1.previewScale = 2;
				break;
			case "NEW100X100":
				pixelFlux$1.createNewSprite(100, 100);
				break;
			case "NEW44X44":
				pixelFlux$1.createNewSprite(44, 44);
				pixelFlux$1.drawingScale = 12;
				pixelFlux$1.previewScale = 3;
				break;
			case "IMPORT":
				flux.showModalQuestionWindow("Enter the URL of the image you would like to import: <br> <i>Note: Your current image will be replaced!</i>", "http://", "Import", "Cancel", (response) => {
					if (response) pixelFlux$1.sprite.loadFromURL(response, () => {
						pixelFlux$1.updateCanvasAndPreview();
					});
				});
				break;
			case "OPEN":
				pixelFlux$1.showLoadGallery();
				break;
			case "OPENPIXELFILE":
				var selector = document.getElementById("OPENPIXELFILEFILESELECT");
				selector.onchange = (e) => {
					log("Opening: " + selector.value);
					selector.value;
					var file = selector.files[0];
					if (file) {
						var reader = new FileReader();
						reader.readAsText(file, "UTF-8");
						reader.onload = function(evt) {
							var contents = evt.target.result;
							var spriteObject = JSON.parse(contents);
							pixelFlux$1.sprite.loadFromSprite(spriteObject);
							pixelFlux$1.updateCanvasAndPreview();
						};
						reader.onerror = function(evt) {
							window.alert("Error Reading File!");
							console.log(evt);
						};
					}
				};
				selector.value = "";
				return;
			case "EXPORT": break;
			case "SAVE":
				pixelFlux$1.saveSprite();
				break;
			case "SAVEONLINE": break;
			case "DOWNLOAD":
				pixelFlux$1.setSpriteName().then(() => {
					var url = pixelFlux$1.sprite.canvas.toDataURL("image/png");
					if (pixelFlux$1.sprite.name.length == 0) download(url, "pixelFlux-download.png");
					else download(url, pixelFlux$1.sprite.name + ".png");
				});
				break;
			case "DOWNLOADPIXELFILE":
				pixelFlux$1.setSpriteName().then(() => {
					var url = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pixelFlux$1.sprite));
					if (pixelFlux$1.sprite.name.length == 0) download(url, "pixelFlux-download.pixel");
					else download(url, pixelFlux$1.sprite.name + ".pixel");
				});
				break;
			case "DOWNLOADSPRITESHEET":
				pixelFlux$1.setSpriteName().then(() => {
					pixelFlux$1.sprite.updateSpriteSheetCanvas();
					download(pixelFlux$1.sprite.spriteSheetCanvas.toDataURL("image/png"), pixelFlux$1.sprite.name + "_spritesheet.png");
				});
				break;
			case "DOWNLOADGIF":
				pixelFlux$1.downloadGif();
				break;
			case "": break;
			case "UNDO":
				pixelFlux$1.sprite.undo();
				pixelFlux$1.updateCanvasAndPreview();
				break;
			case "REDO":
				pixelFlux$1.sprite.redo();
				pixelFlux$1.updateCanvasAndPreview();
				break;
			case "": break;
			case "": break;
			case "SELECTALL":
				pixelFlux$1.currentSelection.enabled = true;
				pixelFlux$1.currentSelection.x1 = 0;
				pixelFlux$1.currentSelection.y1 = 0;
				pixelFlux$1.currentSelection.x2 = pixelFlux$1.sprite.width - 1;
				pixelFlux$1.currentSelection.y2 = pixelFlux$1.sprite.height - 1;
				pixelFlux$1.updateCanvasAndPreview();
				break;
			case "SELECTNONE":
				pixelFlux$1.currentSelection.enabled = false;
				pixelFlux$1.updateCanvasAndPreview();
				break;
			case "": break;
			case "": break;
			case "ADDLAYERCURRENTFRAME":
				if (pixelFlux$1.preferences.preserveLayerContinuity) pixelFlux$1.sprite.addLayerAllFrames();
				else pixelFlux$1.sprite.addLayer();
				pixelFlux$1.renderLayersWindow();
				break;
			case "UPLAYERSTACK":
				pixelFlux$1.sprite.nextLayerUp();
				pixelFlux$1.renderLayersWindow();
				break;
			case "DOWNLAYERSTACK":
				pixelFlux$1.sprite.nextLayerDown();
				pixelFlux$1.renderLayersWindow();
				break;
			case "LAYERTOGGLEVISIBLE":
				pixelFlux$1.sprite.getCurrentFrame().getCurrentLayer().toggleVisible();
				pixelFlux$1.sprite.updateCanvasChain();
				pixelFlux$1.updateCanvasAndPreview();
				break;
			case "LAYERTOGGLELOCKED":
				pixelFlux$1.sprite.getCurrentFrame().getCurrentLayer().toggleLocked();
				pixelFlux$1.sprite.updateCanvasChain();
				pixelFlux$1.updateCanvasAndPreview();
				break;
			case "LAYERCLEAR":
				pixelFlux$1.sprite.getCurrentFrame().getCurrentLayer().clear();
				pixelFlux$1.sprite.updateCanvasChain();
				pixelFlux$1.updateCanvasAndPreview();
				break;
			case "LAYERREPLICATE":
				pixelFlux$1.sprite.replicateCurrentLayer();
				pixelFlux$1.renderLayersWindow();
				break;
			case "": break;
			case "": break;
			case "": break;
			case "": break;
			case "ADDFRAME":
				pixelFlux$1.sprite.addFrame();
				pixelFlux$1.sprite.updateCanvasChain();
				pixelFlux$1.updateCanvasAndPreview();
				break;
			case "NEXTFRAME":
				pixelFlux$1.sprite.selectNextFrame();
				pixelFlux$1.sprite.updateCanvasChain();
				pixelFlux$1.updateCanvasAndPreview();
				break;
			case "PREVIOUSFRAME":
				pixelFlux$1.sprite.selectPreviousFrame();
				pixelFlux$1.sprite.updateCanvasChain();
				pixelFlux$1.updateCanvasAndPreview();
				break;
			case "": break;
			case "": break;
			case "": break;
			case "INSERTFRAMEBEFORE":
				pixelFlux$1.sprite.insertFrameBeforeCurrent();
				pixelFlux$1.sprite.updateCanvasChain();
				pixelFlux$1.updateCanvasAndPreview();
				break;
			case "INSERTFRAMEAFTER":
				pixelFlux$1.sprite.insertFrameAfterCurrent();
				pixelFlux$1.sprite.updateCanvasChain();
				pixelFlux$1.updateCanvasAndPreview();
				break;
			case "": break;
			case "": break;
			case "DUPLICATECURRENTFRAME":
				pixelFlux$1.sprite.copyFrame(pixelFlux$1.sprite.currentFrame);
				pixelFlux$1.updateCanvasAndPreview();
				break;
			case "DELETECURRENTFRAME":
				pixelFlux$1.sprite.deleteFrame(pixelFlux$1.sprite.currentFrame);
				pixelFlux$1.updateCanvasAndPreview();
				break;
			case "": break;
			case "": break;
			case "": break;
			case "": break;
			case "STARTANIMATION":
				pixelFlux$1.animating = true;
				pixelFlux$1.renderAnimationPreview();
				break;
			case "1FPS":
				pixelFlux$1.setFramerate(1);
				break;
			case "2FPS":
				pixelFlux$1.setFramerate(2);
				break;
			case "4FPS":
				pixelFlux$1.setFramerate(4);
				break;
			case "6FPS":
				pixelFlux$1.setFramerate(6);
				break;
			case "7FPS":
				pixelFlux$1.setFramerate(7);
				break;
			case "12FPS":
				pixelFlux$1.setFramerate(12);
				break;
			case "14FPS":
				pixelFlux$1.setFramerate(14);
				break;
			case "24FPS":
				pixelFlux$1.setFramerate(24);
				break;
			case "28FPS":
				pixelFlux$1.setFramerate(28);
				break;
			case "30FPS":
				pixelFlux$1.setFramerate(30);
				break;
			case "STOPANIMATION":
				pixelFlux$1.animating = false;
				break;
			case "": break;
			case "": break;
			case "ICONSIZEMICRO":
				flux.setToolButtonSize(24);
				break;
			case "ICONSIZESMALL":
				flux.setToolButtonSize(32);
				break;
			case "ICONSIZEMEDIUM":
				flux.setToolButtonSize(42);
				break;
			case "ICONSIZELARGE":
				flux.setToolButtonSize(64);
				break;
			case "": break;
			case "": break;
			case "SHOWTOOLOPTIONS":
				flux.showWindow("TOOLOPTIONS");
				break;
			case "SHOWPREVIEW":
				flux.showWindow("PREVIEW");
				break;
			case "SHOWANIMATIONPREVIEW":
				flux.showWindow("ANIMATIONPREVIEW");
				break;
			case "SHOWANIMATIONTOOLS":
				flux.showWindow("ANIMATIONTOOLS");
				break;
			case "SHOWANIMATIONFRAMES":
				flux.showWindow("FRAMES");
				break;
			case "SHOWWORKSPACE":
				flux.showWindow("WORKSPACE");
				break;
			case "SHOWCOLOURPALLET":
				flux.showWindow("COLOURPALLET");
				break;
			case "SHOWTOOLBAR":
				flux.showWindow("TOOLBAR");
				break;
			case "SHOWLAYERS":
				flux.showWindow("LAYERS");
				break;
			case "SHOWDEBUG":
				flux.showWindow("DEBUG");
				break;
			case "SHOWALL":
				log("MenuHandler: SHOWALL");
				flux.showWindow("WORKSPACE");
				flux.showWindow("PREVIEW");
				flux.showWindow("COLOURPALLET");
				flux.showWindow("TOOLBAR");
				flux.showWindow("TOOLOPTIONS");
				flux.showWindow("DEBUG");
				flux.showWindow("LAYERS");
				flux.showWindow("ANIMATIONPREVIEW");
				flux.showWindow("ANIMATIONTOOLS");
				flux.showWindow("FRAMES");
				flux.showWindow("PIXELBRUSH");
				log("MenuHandler: SHOWALL - Complete");
				break;
			case "SETBACKGROUNDCOLOR":
				pixelFlux$1.setBackgroundColour();
				break;
			case "TOGGLETILEPREVIEW":
				pixelFlux$1.toggleTilePreview();
				break;
			case "ARRANGECLASSIC":
				flux.restoreWindowArrangement(builtInWindowArrangements.CLASSIC);
				pixelFlux$1.resizeContentCanvases();
				break;
			case "ARRANGENEOCLASSIC":
				flux.restoreWindowArrangement(builtInWindowArrangements.NEOCLASSIC);
				pixelFlux$1.resizeContentCanvases();
				break;
			case "ARRANGEWIDE":
				flux.restoreWindowArrangement(builtInWindowArrangements.WIDE);
				pixelFlux$1.resizeContentCanvases();
				break;
			case "ARRANGETILECREATOR":
				flux.restoreWindowArrangement(builtInWindowArrangements.TILECREATOR);
				pixelFlux$1.tilePreview = true;
				pixelFlux$1.resizeContentCanvases();
				break;
			case "SAVEWINDOWARRANGEMENT":
				var arrangement = flux.getWindowArrangement();
				localStorage.setItem("arrangement", JSON.stringify(arrangement));
				break;
			case "RESTOREWINDOWARRANGEMENT":
				var arrangement = JSON.parse(localStorage.getItem("arrangement"));
				flux.restoreWindowArrangement(arrangement);
				break;
			case "": break;
			case "": break;
			case "LOADPALLETDEFAULT":
				pixelFlux$1.clearColourPallet();
				pixelFlux$1.loadColours(builtInColourPallets.DEFAULT);
				break;
			case "LOADPALLETWOODLAND":
				pixelFlux$1.clearColourPallet();
				pixelFlux$1.loadColours(builtInColourPallets.WOODLANDJOURNEY);
				break;
			case "LOADPALLETPASTELDREAMS":
				pixelFlux$1.clearColourPallet();
				pixelFlux$1.loadColours(builtInColourPallets.PASTELDREAMS);
				break;
			case "LOADPALLETHIGHCONTRAST":
				pixelFlux$1.clearColourPallet();
				pixelFlux$1.loadColours(builtInColourPallets.HIGHCONTRAST);
				break;
			case "LOADPALLETCYBERPUNKNEON":
				pixelFlux$1.clearColourPallet();
				pixelFlux$1.loadColours(builtInColourPallets.CYBERPUNKNEON);
				break;
			case "LOADPALLETDRAGONFIRE":
				pixelFlux$1.clearColourPallet();
				pixelFlux$1.loadColours(builtInColourPallets.DRAGONFIRE);
				break;
			case "LOADPALETTE":
				pixelFlux$1.selectSavedPalette();
				break;
			case "SAVEPALETTE":
				pixelFlux$1.saveColourPaletteAs();
				break;
			case "EXPORTPALETTE":
				pixelFlux$1.exportCurrentPalette();
				break;
			case "IMPORTPALETTEFILE":
				var selector = document.getElementById("IMPORTPALETTEFILEFILESELECT");
				selector.onchange = (e) => {
					log("Importing: " + selector.value);
					selector.value;
					var file = selector.files[0];
					if (file) {
						var reader = new FileReader();
						reader.readAsText(file, "UTF-8");
						reader.onload = function(evt) {
							var contents = evt.target.result;
							var palette = JSON.parse(contents);
							pixelFlux$1.clearColourPallet();
							pixelFlux$1.loadColours(palette.colours);
							pixelFlux$1.updateCanvasAndPreview();
						};
						reader.onerror = function(evt) {
							window.alert("Error Reading File!");
							console.log(evt);
						};
					}
				};
				selector.value = "";
				break;
			case "CLEARPALLET":
				pixelFlux$1.clearColourPallet();
				break;
			case "REDUCEPALLET":
				pixelFlux$1.reduceColourPalette(30);
				break;
			case "GETPALLETFROMLAYER":
				pixelFlux$1.clearColourPallet();
				pixelFlux$1.createPaletteFromCurrentLayer();
				break;
			case "": break;
			case "ABOUTPIXELFLUX":
				let aboutInfo = `
            Version: ${config.version}<br>
            Build: ${config.build}<br>
            Release Date: ${config.releaseDate}<br>
            Developer Preview: ${DEVPREVIEW}<br>
            .pixel Filespec: v2.0.0<br>
            <br>
            &copy; Richard Sabbarton

            `;
				flux.showModalMessageBox("About PixelFlux", aboutInfo, () => {});
				break;
			case "TODOLIST":
				window.open("https://github.com/rsabbarton/PixelFlux/issues");
				break;
			case "KNOWNISSUES":
				window.open("https://github.com/rsabbarton/PixelFlux/issues");
				break;
			case "LOADHELPPAGES":
				window.open("https://github.com/rsabbarton/PixelFlux/wiki");
				break;
		}
	});
}
//#endregion
//#region src/js/app.js
var DEVPREVIEW = true;
var uri = "/";
if (window.location.href.indexOf("/PixelFlux") > -1) {
	uri = "/PixelFlux/";
	DEVPREVIEW = false;
}
var appUrl = uri;
showLoadingAnimation();
var flux = new FluxUI();
var pixelFlux$1 = new PixelEditor(flux);
var keyboard = new KeyboardHandler();
addMenuHandler();
addToolButtonEventListeners();
var config = {};
var configUrl = "./config/main.json";
fetch(configUrl).then((response) => {
	response.json().then((json) => {
		config = json;
		log("Config loaded from " + configUrl);
		console.log(flux);
		pixelFlux$1.init(() => {});
		setTimeout(() => {
			hideLoadingAnimation();
			flux.menu.onClickCallback("SHOWALL");
		}, 2e3);
	});
}).catch((error) => {
	console.log(error);
});
document.addEventListener("mousedown", (event) => {
	log(event);
	var srcElement = event.target;
	if (srcElement.matches(".drawingcanvas")) {
		srcElement.classList.add("isdrawing");
		var scale = pixelFlux$1.drawingScale;
		var oX = srcElement.clientWidth / 2 - pixelFlux$1.sprite.width / 2 * pixelFlux$1.drawingScale;
		var oY = (srcElement.clientHeight - 20) / 2 - pixelFlux$1.sprite.height / 2 * pixelFlux$1.drawingScale;
		var dX = Math.floor((event.layerX - oX) / scale);
		var dY = Math.floor((event.layerY - oY - 24) / scale);
		pixelFlux$1.toolDown(dX, dY, event.buttons);
	}
});
document.addEventListener("mouseup", (event) => {
	var srcElement = document.getElementById("DRAWINGCANVAS");
	if (srcElement.matches(".isdrawing")) {
		srcElement.classList.remove("isdrawing");
		var scale = pixelFlux$1.drawingScale;
		var oX = srcElement.clientWidth / 2 - pixelFlux$1.sprite.width / 2 * pixelFlux$1.drawingScale;
		var oY = (srcElement.clientHeight - 20) / 2 - pixelFlux$1.sprite.height / 2 * pixelFlux$1.drawingScale;
		var dX = Math.floor((event.layerX - oX) / scale);
		var dY = Math.floor((event.layerY - oY - 24) / scale);
		pixelFlux$1.toolUp(dX, dY);
	}
});
document.addEventListener("mousemove", (event) => {
	var srcElement = event.target;
	var scale = pixelFlux$1.drawingScale;
	var oX = srcElement.clientWidth / 2 - pixelFlux$1.sprite.width / 2 * pixelFlux$1.drawingScale;
	var oY = (srcElement.clientHeight - 20) / 2 - pixelFlux$1.sprite.height / 2 * pixelFlux$1.drawingScale;
	var sX = Math.floor((event.layerX - event.movementX - oX) / scale);
	var sY = Math.floor((event.layerY - event.movementY - oY - 24) / scale);
	var dX = Math.floor((event.layerX - oX) / scale);
	var dY = Math.floor((event.layerY - oY - 24) / scale);
	debug.layerX = dX;
	debug.layerY = dY;
	debug.mSize = window.performance.memory.totalJSHeapSize / 1024;
	debug.mUsed = window.performance.memory.usedJSHeapSize / 1024;
	debug.mMax = window.performance.memory.jsHeaSizeLimit / 1024;
	if (srcElement.matches(".drawingcanvas")) {
		pixelFlux$1.updateCanvasAndPreview();
		if (srcElement.matches(".isdrawing")) pixelFlux$1.toolDrag(sX, sY, dX, dY, event.buttons);
		if (pixelFlux$1.currentSelection.enabled) {
			var selectX = oX + pixelFlux$1.currentSelection.x1 * pixelFlux$1.drawingScale;
			var selectY = oY + pixelFlux$1.currentSelection.y1 * pixelFlux$1.drawingScale;
			var selectW = (pixelFlux$1.currentSelection.x2 - pixelFlux$1.currentSelection.x1 + 1) * pixelFlux$1.drawingScale;
			var selectH = (pixelFlux$1.currentSelection.y2 - pixelFlux$1.currentSelection.y1 + 1) * pixelFlux$1.drawingScale;
			var ctx = srcElement.getContext("2d");
			ctx.save();
			ctx.beginPath();
			ctx.strokeStyle = "#444444";
			ctx.lineWidth = 3;
			ctx.setLineDash([5, 5]);
			ctx.rect(selectX, selectY, selectW, selectH);
			ctx.stroke();
			ctx.restore();
		}
		if (dX >= 0 && dY >= 0 && dX < pixelFlux$1.sprite.width && dY < pixelFlux$1.sprite.height) {
			var ctx = srcElement.getContext("2d");
			ctx.beginPath();
			ctx.rect(oX + dX * scale, oY + dY * scale, scale, scale);
			ctx.stroke();
		}
	}
});
document.addEventListener("wheel", (event) => {
	if (event.target.id == "DRAWINGCANVAS") {
		pixelFlux$1.drawingScale += event.deltaY * -.01;
		log("Drawing Window Scale set to: " + pixelFlux$1.drawingScale);
		pixelFlux$1.updateCanvasAndPreview();
	}
	if (event.target.id == "PREVIEWCANVAS") {
		pixelFlux$1.previewScale += event.deltaY * -.01;
		log("Preview Window Scale set to: " + pixelFlux$1.previewScale);
		pixelFlux$1.updateCanvasAndPreview();
	}
	if (event.target.id == "ANIMATIONPREVIEWCANVAS") {
		pixelFlux$1.animationPreviewScale += event.deltaY * -.01;
		log("Preview Window Scale set to: " + pixelFlux$1.animationPreviewScale);
		pixelFlux$1.updateCanvasAndPreview();
	}
});
document.addEventListener("paste", function(evt) {
	const clipboardItems = evt.clipboardData.items;
	const items = [].slice.call(clipboardItems).filter(function(item) {
		return item.type.indexOf("image") !== -1;
	});
	if (items.length === 0) return;
	log("Processing image from Clipboard...");
	const blob = items[0].getAsFile();
	const img = new Image();
	img.onload = (event) => {
		var img = event.target;
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
		var imgUrl = canvas.toDataURL("image/png");
		pixelFlux$1.sprite.loadFromDataURL(imgUrl, () => {
			pixelFlux$1.updateCanvasAndPreview();
		});
	};
	img.src = window.URL.createObjectURL(blob);
	console.log(img.src);
});
window.addEventListener("contextmenu", (e) => {
	e.preventDefault();
});
//#endregion

//# sourceMappingURL=index-BraiN5O2.js.map