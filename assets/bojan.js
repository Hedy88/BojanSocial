// copyright rgb
(function () {
  window.onerror = function (e, f, l) {
    alert("js went boom lol: \n" + e + "\n" + f + ":" + l);
  };

  // profiles
  if (document.querySelector(".profile-layout")) {
    const picturePreview = document.querySelector(".picture-preview");
    const profileBannerPfp = document.querySelector(".profile-banner-pfp");

    profileBannerPfp.addEventListener("click", function () {
      picturePreview.style.display = "flex";
    });

    picturePreview.addEventListener("click", function () {
      picturePreview.style.display = "none";
    });
  }

  // post box
  if (document.querySelector(".post-box")) {
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
})();
