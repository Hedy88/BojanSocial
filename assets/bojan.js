// copyright rgb
(function () {
  window.onerror = function (e, f, l) {
    alert("js went boom lol: \n" + e + "\n" + f + ":" + l);
  };

  Array.from(document.getElementsByClassName("timestamp")).forEach(function (el) {
    const date = new Date(el.getAttribute("data-timestamp") * 1000);

    // use switch statements, they said :troll:
    if (navigator.language == "en-US") {
      el.textContent = date.toLocaleDateString("en-US");
    } else if (navigator.language == "en-GB") {
      el.textContent = date.toLocaleDateString("en-GB");
    } else if (navigator.language == "ja-JP") {
      el.textContent = date.toLocaleDateString("ja-JP");
    } else if (navigator.language == "de-DE") {
      el.textContent = date.toLocaleDateString("de-DE");
    } else if (navigator.language == "tr-TR") {
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
    };

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

  if (document.querySelector(".main-box-tabs")) {
    const posts = document.querySelector(".posts");
    let activeTab = "";

    // get tabs
    Array.from(document.getElementsByClassName("tab")).forEach(function (el) {
      let thisTab = "";

      if (el.classList.contains("all-tab")) thisTab = "all";
      if (el.classList.contains("friends-tab")) thisTab = "friends";
      if (el.classList.contains("popular-tab")) thisTab = "popular";

      if (el.classList.contains("active-tab")) {
        if (el.classList.contains("all-tab")) activeTab = "all";
        if (el.classList.contains("friends-tab")) activeTab = "friends";
        if (el.classList.contains("popular-tab")) activeTab = "popular";
      }

      el.addEventListener("click", function () {
        if (activeTab == thisTab) {
          // do nothing
        } else {
          const activeTabElement = document.querySelector(`.${activeTab}-tab`);

          activeTabElement.classList.remove("active-tab");
          el.classList.add("active-tab");
          activeTab = thisTab;

          posts.innerHTML = `
            <div class="fetching-alert">
              <span>fetching posts...</span>
            </div>`;

          ajax("GET", `http://${window.location.host}/posts/${thisTab}.json`, function (data) {
            data = JSON.parse(data);

            if (!data.ok) {
              posts.innerHTML = `
              <div class="fetching-alert">
                <img src="/img/icons/exclamation-red.png" alt="Error" width="16" height="16">
                <span>${data.error}</span>
              </div>`;

              return;
            }

            posts.innerHTML = ``;

            data.posts.forEach(function (post) {
              const postElement = document.createElement("div");
              postElement.classList.add("post");

              // who needs dates anyway :trolley:
              postElement.innerHTML = `
                <div class="post-left">
                  <img src="/@${post.author.username}/pfp" alt="Avatar" width="48" height="48">
                </div>
                <div class="post-right">
                  <div class="post-right-top">
                    <a href="/@${post.author.username}">
                      <span class="post-right-display-name">${post.author.displayName} <span class="post-right-username">@${post.author.username}</span></span>
                    </a>
                    <span class="post-right-posted-on timestamp" data-timestamp="${post.postedOn}"></span>
                  </div>
                  <span class="post-right-content">${post.content}</span>
                </div>
              `;

              posts.appendChild(postElement);
            });
          });
        }
      });
    });
  }
})();
