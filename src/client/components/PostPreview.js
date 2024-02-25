import { html, LitElement } from "lit";

export class PostPreview extends LitElement {
  static properties = {
    username: {
      type: String
    },
    displayName: {
      type: String
    },
    content: {
      type: String
    }
  };

  constructor () {
    super();

    this.username = "";
    this.displayName = "";
    this.content = "";
  }

  render() {
    return html`
    <div class="post-preview">
      <div class="pfp-container">
        <img class="pfp" src="/@${this.username}/pfp" alt="Avatar" width="48" height="48">
      </div>
      <div class="post-container">
        <div class="post-info">
            <a href="/@${this.username}" class="post-username">
                <span class="nickname">${this.displayName}</span>
                <span class="username">${this.username}</span>
            </a>
            <span class="post-timestamp">wip</span>
        </div>
        <div class="post-text">
            <p>${this.content}</p>
        </div>
        <div class="post-actions">
            <div class="post-action like-post">
                <div class="post-actions-icon"></div>
                <div class="post-actions-label">0</div>
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
