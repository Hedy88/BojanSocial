import { html, LitElement } from "lit";

export class PostPreview extends LitElement {
  static properties = {
    postData: {
      type: Object,
    },
    _liked: {
      state: true,
    },
    _replied: {
      state: true,
    },
  };

  constructor() {
    super();

    this.postId = "";
    this._liked = false;
    this._replied = false;
  }

  render() {
    return html`
      <div class="post-preview">
        <div class="pfp-container">
          <img class="pfp" src="/@${this.postData.username}/pfp" alt="Avatar" width="48" height="48" />
        </div>
        <div class="post-container">
          <div class="post-info">
            <a href="/@${this.postData.username}" class="post-username">
              <span class="nickname">${this.postData.displayName}</span>
              <span class="username">${this.postData.username}</span>
            </a>
            <span class="post-timestamp">wip</span>
          </div>
          <div class="post-text">
            <p>${this.postData.content}</p>
          </div>
          <div class="post-actions">
            <div class="post-action like-post">
              <div class="post-actions-icon"></div>
              <div class="post-actions-label">${this.postData.reactions.length}</div>
            </div>
            <div class="post-action reply-post">
              <div class="post-actions-icon"></div>
              <div class="post-actions-label">WIP</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }
}
