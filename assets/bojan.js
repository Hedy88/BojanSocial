// copyright rgb
(function () {
  window.onerror = function (e, f, l) {
    alert("js went boom lol: \n" + e + "\n" + f + ":" + l);
  };

  const countPost = function () {
    const postLength = document.querySelector(".post-box-textarea").value.trim().length;
    const postLengthCounter = document.querySelector(".post-box-counter");

    postLengthCounter.innerHTML = 255 - postLength;

    if (postLength >= 220) {
      postLengthCounter.style.color = "#5c0002";
    }
  };

  window.bojan = { tools: { countPost } };
})();
