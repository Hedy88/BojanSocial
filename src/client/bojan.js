// bojan frontend
import { errorHandler } from "./errorHandler.js";
import { postInit } from "./postInit.js";

import * as funnyDOM from "./dom.js";

// external
import retry from "async-retry";

window.addEventListener("load", () => {
  // anti asshole design
  console.log("%cbojan social!", "color: white; font-family: 'Comic Sans MS'; font-size: 50px; text-shadow: 3px 3px 0 black;");
  console.log("%chey! if someone tells you to copy / paste something here 9/10 they are trying to get your account info.", "color: red; font-family: monospace; font-size: 20px");

  // check for posts
  if (funnyDOM.doesSelectorExist(".posts")) {
    const tabs = document.getElementsByClassName("tab");
    const posts = document.querySelector(".posts");

    postInit();

    // tabs
    if (funnyDOM.doesSelectorExist(".main-box-tabs")) {
      let activeTab = "";

      Array.from(tabs).forEach((el) => {
        let thisTab = "";

        // assign thisTab and activetab
        if (el.classList.contains("all-tab")) thisTab = "all";
        if (el.classList.contains("friends-tab")) thisTab = "friends";
        if (el.classList.contains("popular-tab")) thisTab = "popular";

        if (el.classList.contains("active-tab")) {
          if (el.classList.contains("all-tab")) activeTab = "all";
          if (el.classList.contains("friends-tab")) activeTab = "friends";
          if (el.classList.contains("popular-tab")) activeTab = "popular";
        }

        // update post content every 5000ms
        setInterval(async () => {
          const response = await fetch(`/posts/ajax/get_${activeTab}_posts`, {
            method: "POST",
            credentials: "same-origin",
          });

          if (response.status !== 200) {
            return;
          }

          const data = await response.text();

          posts.innerHTML = data;
          postInit();
        }, 5000);

        el.addEventListener("click", async () => {
          if (activeTab != thisTab) {
            const activeTabElement = document.querySelector(`.${activeTab}-tab`);

            activeTabElement.classList.remove("active-tab");
            el.classList.add("active-tab");
            activeTab = thisTab;

            posts.innerHTML = `
            <div class="fetching-alert">
              <span>fetching posts...</span>
            </div>`;

            await retry(
              async (bail) => {
                const response = await fetch(`/posts/ajax/get_${thisTab}_posts`, {
                  method: "POST",
                  credentials: "same-origin",
                });

                if (response.status !== 200) {
                  posts.innerHTML = `
                  <div class="fetching-alert">
                    <span>failed to fetch posts.</span>
                  </div>`;

                  bail(new Error("seems like the server is busy or not responding correctly, please try again."));
                  return;
                }

                const data = await response.text();

                posts.innerHTML = data;
                postInit();
              },
              { retries: 5 }
            );
          }
        });
      });
    }
  }

  if (funnyDOM.doesSelectorExist(".profile-layout")) {
    const picturePreview = document.querySelector(".picture-preview");
    const profileBannerPfp = document.querySelector(".profile-banner-pfp");

    profileBannerPfp.addEventListener("click", function () {
      picturePreview.style.display = "flex";
    });

    picturePreview.addEventListener("click", function () {
      picturePreview.style.display = "none";
    });
  }

  if (funnyDOM.doesSelectorExist(".post-box")) {
    const postBoxTextarea = document.querySelector(".post-box-textarea");

    postBoxTextarea.addEventListener("input", function () {
      const postLength = postBoxTextarea.value.trim().length;
      const postLengthCounter = document.querySelector(".post-box-counter");
      const postButton = document.querySelector(".post-box-button");

      postLengthCounter.innerHTML = 255 - postLength;

      if (postLength > 255) {
        postLengthCounter.style.color = "#c51e3a";
        postButton.disabled = true;
      } else if (postLength > 175) {
        postLengthCounter.style.color = "#eed202";
        postButton.disabled = false;
      } else if (postLength < 175) {
        postLengthCounter.style.color = "#545454";
        postButton.disabled = false;
      } else if (postLength == 0) {
        postButton.disabled = true;
      }
    });
  }
});

window.onerror = errorHandler;
