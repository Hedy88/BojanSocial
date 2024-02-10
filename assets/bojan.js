// copyright rgb
(function () {
  window.onerror = function (e, f, l) {
    alert("js went boom lol: \n" + e + "\n" + f + ":" + l);
  };

  // convert timestamps
  Array.from(document.getElementsByClassName("timestamp")).forEach(function (el) {
    const date = new Date(el.getAttribute("data-timestamp") * 1000);

    // use switch statements, they said :troll:
    if (navigator.language == "en-US") {
      el.textContent = date.toLocaleDateString("en-US")
    } else if (navigator.language == "en-GB") {
      el.textContent = date.toLocaleDateString("en-GB")
    } else if (navigator.language == "ja-JP") {
      el.textContent = date.toLocaleDateString("ja-JP")
    } else if (navigator.language == "de-DE") {
      el.textContent = date.toLocaleDateString("de-DE");
    } else if (navigator.language == "tr-TR")  {
      el.textContent = date.toLocaleDateString("tr-TR");
    } else if (navigator.language == "el-GR") {
      el.textContent = date.toLocaleDateString("el-GR");
    }
  });

  const ajax = function (method, uri, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, uri);

    if (method == "POST") {
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }

    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        callback(this.response);
      }
    }

    xhr.send();
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

  // actions
  Array.from(document.getElementsByClassName("like-button")).forEach(function (el) {
    el.addEventListener("click", function () {
      ajax("POST", `/actions/posts/like?postId=${el.dataset.id}`, function (data) {
        data = JSON.parse(data);

        if (!data.ok) {
          throw new Error("failed to like post, " + data.error);
        } else {
          location.reload();
        }
      });
    });
  });
})();
