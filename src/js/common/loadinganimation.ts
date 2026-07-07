import { appUrl } from "../app.js";

const logo1: HTMLImageElement = document.createElement("img");
const logo2: HTMLImageElement = document.createElement("img");
const logocontainer: HTMLDivElement = document.createElement("div");
let showingLoadingAnimation = false;
const loadingMessage = "Loading...";
const loadingMessageElement: HTMLDivElement = document.createElement("div");
loadingMessageElement.innerHTML = loadingMessage;
logocontainer.appendChild(loadingMessageElement);

export function showLoadingAnimation(): void {
  logo1.src = appUrl + "resources/icons/loading-clockwise.png";
  logo2.src = appUrl + "resources/icons/loading-anticlockwise.png";

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
  const body = document.body;
  if (body) {
    body.appendChild(logocontainer);
    body.appendChild(logo1);
    body.appendChild(logo2);
  }

  updateLogoRotation();
}

export function updateLogoRotation(): void {
  logo1.style.position = "absolute";
  logo1.style.left = window.innerWidth / 2 - logo1.width / 2 + "px";
  logo1.style.top = window.innerHeight / 2 - logo1.height / 2 + "px";
  logo1.style.transform = "rotate(" + Date.now() / 2 / 1000 + "turn)";
  logo1.style.zIndex = "90";

  logo2.style.position = "absolute";
  logo2.style.left = window.innerWidth / 2 - logo2.width / 2 + "px";
  logo2.style.top = window.innerHeight / 2 - logo2.height / 2 + "px";
  logo2.style.transform = "rotate(" + Date.now() / -2 / 1000 + "turn)";
  logo2.style.zIndex = "100";

  loadingMessageElement.style.opacity = String(
    0.5 + 0.5 * Math.sin(Date.now() / 1000),
  );
  if (showingLoadingAnimation) {
    setTimeout(updateLogoRotation, 1000 / 60);
  }
}

export function hideLoadingAnimation(): void {
  showingLoadingAnimation = false;
  logocontainer.remove();
  logo1.remove();
  logo2.remove();
}
