import { html, LitElement } from "lit";
import { addAlert } from "../alerts";

export class PostBox extends LitElement {
  static properties = {
    _content: {
      state: true,
    },
    _attachments: {
      state: true,
    },
    // todo: FIND A BETTER WAY OF DOING THIS SHIT
    currentUser: {
      type: String,
    }
  };

  constructor() {
    super();

    this.currentUser = "";
    this._content = "";
    this._attachments = [];
  }

  _changePostContent(e) {
    this._content = e.target.value.trim();
    const postBoxCharacterLimit = this.renderRoot.querySelector(".post-box-character-limit");
    const postButton = this.renderRoot.querySelector(".post-button");

    postBoxCharacterLimit.innerHTML = 255 - this._content.length;

    if (this._content.length > 255) {
      postBoxCharacterLimit.style.color = "#c51e3a";
      postButton.disabled = true;
    } else if (this._content.length > 175) {
      postBoxCharacterLimit.style.color = "#eed202";
      postButton.disabled = false;
    } else if (this._content.length < 175) {
      postBoxCharacterLimit.style.color = "#545454";
      postButton.disabled = false;
    } else if (this._content.length == 0) {
      postButton.disabled = true;
    }
  }

  _postContent() {
    if (this._content.length == 0) {
      addAlert("error", "You can't just post nothing.");
      return;
    }


  }

  render() {
    return html`
      <div class="post-box">
        <div class="pfp-container">
          <img class="pfp" src="/@${this.currentUser}/pfp" alt="Avatar" width="54" height="54" />
        </div>
        <div class="post-box-content">
          <textarea class="post-box-textarea" autocomplete="off" placeholder="what are you doing today?" @input="${this._changePostContent}"></textarea>
          <div class="post-box-actions">
            <div class="post-box-options">
              <p class="post-box-character-limit">255</p>
            </div>
            <button class="button button-blue post-button" @click="${this._postContent}">Post!</button>
          </div>
        </div>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }
}
