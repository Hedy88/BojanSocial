import * as funnyDOM from "./dom.js";

import retry from "async-retry";

const postInit = () => {
  if (funnyDOM.doesSelectorExist(".posts")) {
    const likeButtons = document.getElementsByClassName("like-button");

    Array.from(likeButtons).forEach((el) => {
      el.addEventListener("click", async () => {
        await retry(
          async (bail) => {
            const response = await fetch(`/actions/posts/like?postId=${el.dataset.id}`, {
              method: "POST",
            });

            if (response.status !== 200) {
              bail(new Error("seems like the server is busy or not responding correctly, please try again."));
              return;
            }

            const data = await response.json();

            if (!data.ok) {
              bail(new Error("couldn't like post: " + data.error));
              return;
            } else {
              location.reload();
            }
          },
          { retries: 5 }
        );
      });
    });
  }
};

export { postInit };
