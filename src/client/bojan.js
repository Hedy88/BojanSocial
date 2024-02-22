// bojan frontend
import { errorHandler } from "./errorHandler.js";

window.addEventListener("load", () => {
  // anti asshole design
  console.log("%cbojan social!", "color: white; font-family: 'Comic Sans MS'; font-size: 50px; text-shadow: 3px 3px 0 black;");
  console.log("%chey! if someone tells you to copy / paste something here 9/10 they are trying to get your account info.", "color: red; font-family: monospace; font-size: 20px");

  /* signup
  if (document.querySelector(".signup-panel")) {
    const signupButton = document.querySelector(".sign-up");
    const signupPanel = document.querySelector(".signup-panel");

    signupButton.addEventListener("click", () => {
      // change signup panel html
      signupPanel.innerHTML =
        `
          <h2 class="panel-header">just a few more clicks away...</h2>
          <form class="signup-panel-form" action="/signup" method="post">
            <button type="submit" class="button button-yellow large sign-up">Create Account</button>
          </form>
        `;
    });
  }
  */
});

window.onerror = errorHandler;
