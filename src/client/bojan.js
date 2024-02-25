// bojan frontend
import { errorHandler } from "./errorHandler.js";
import { addAlert } from "./alerts.js";

import { PostPreview } from "./components/PostPreview.js";
import { PostBox } from "./components/PostBox.js";

window.addEventListener("load", () => {
  // anti asshole design
  console.log("%cbojan social!", "color: white; font-family: 'Comic Sans MS'; font-size: 50px; text-shadow: 3px 3px 0 black;");
  console.log("%chey! if someone tells you to copy / paste something here 9/10 they are trying to get your account info.", "color: red; font-family: monospace; font-size: 20px");

  if (!("customElements" in window)) {
    addAlert("error", "bojanSocial needs a browser that supports WebComponents");
  } else {
    customElements.define("post-preview", PostPreview);
    customElements.define("post-box", PostBox);
  }
});

window.onerror = errorHandler;
