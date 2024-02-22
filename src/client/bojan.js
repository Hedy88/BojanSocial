// bojan frontend
import { errorHandler } from "./errorHandler.js";

window.addEventListener("load", () => {
  // anti asshole design
  console.log("%cbojan social!", "color: white; font-family: 'Comic Sans MS'; font-size: 50px; text-shadow: 3px 3px 0 black;");
  console.log("%chey! if someone tells you to copy / paste something here 9/10 they are trying to get your account info.", "color: red; font-family: monospace; font-size: 20px");
});

window.onerror = errorHandler;
