import { html, LitElement } from "lit";
import { Task } from "@lit/task";
import { fetchPost } from "../utils";

export class PostPreview extends LitElement {
  static properties = {
    postId: {
      type: String,
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

  _fetchPostInfoTask = new Task(this, {
    task: async ([postId], { signal }) => {
      return await fetchPost(postId, signal);
    },
    args: () => [this.postId],
  });

  render() {
    return this._fetchPostInfoTask.render({
      pending: () => html`<p>fetching post...</p>`,
      complete: (post) => html`
        <div class="post-preview">
          <div class="pfp-container">
            <img class="pfp" src="/@${post.username}/pfp" alt="Avatar" width="48" height="48" />
          </div>
          <div class="post-container">
            <div class="post-info">
              <a href="/@${post.username}" class="post-username">
                <span class="nickname">${post.displayName}</span>
                <span class="username">${post.username}</span>
              </a>
              <span class="post-timestamp">wip</span>
            </div>
            <div class="post-text">
              <p>${post.content}</p>
            </div>
            <div class="post-actions">
              <div class="post-action like-post">
                <div class="post-actions-icon"></div>
                <div class="post-actions-label">${post.reactions.length}</div>
              </div>
              <div class="post-action reply-post">
                <div class="post-actions-icon"></div>
                <div class="post-actions-label">WIP</div>
              </div>
            </div>
          </div>
        </div>
      `,
      error: () => html`
        <p>something went wrong</p>
      `
    });
  }

  createRenderRoot() {
    return this;
  }
}
