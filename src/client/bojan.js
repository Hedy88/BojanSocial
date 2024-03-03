// bojan frontend
import { errorHandler } from "./errorHandler.js";
import { addAlert } from "./alerts.js";

// WebComponents
import { PostPreview } from "./components/PostPreview.js";
import { PostBox } from "./components/PostBox.js";
import { Posts } from "./components/Posts.js";
import { FeedsPanel } from "./components/FeedsPanel.js";
import { FriendsPanel } from "./components/FriendsPanel.js";
import { FeaturedPanel } from "./components/FeaturedPanel.js";

window.addEventListener("load", () => {
  // anti asshole design
  console.log("%cbojan social!", "color: white; font-family: 'Comic Sans MS'; font-size: 50px; text-shadow: 3px 3px 0 black;");
  console.log("%chey! if someone tells you to copy / paste something here 9/10 they are trying to get your account info.", "color: red; font-family: monospace; font-size: 20px");

  if (!("customElements" in window)) {
    addAlert("error", "bojanSocial needs a browser that supports WebComponents");
  } else {
    customElements.define("bs-post-preview", PostPreview);
    customElements.define("bs-post-box", PostBox);
    customElements.define("bs-posts", Posts);

    // homepage panels
    customElements.define("bs-feeds-panel", FeedsPanel);
    customElements.define("bs-featured-panel", FeaturedPanel);
    customElements.define("bs-friends-panel", FriendsPanel);
  }
});

window.onerror = errorHandler;
