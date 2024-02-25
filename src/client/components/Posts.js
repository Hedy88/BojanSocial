import { Task } from "@lit/task";
import { html, LitElement } from "lit";
import { map } from "lit/directives/map.js";
import { fetchPostCatagory } from "../utils";

// todo: Do this.
export class Posts extends LitElement {
  static properties = {
    feed: {
      // "all", "friends", "popular"
      type: String,
    },
    page: {
      type: Number,
    },
    _maxPages: {
      state: true,
    },
  };

  constructor() {
    super();

    this.feed = "all";
    this.page = 0;
    this._maxPages = 0;
  }

  _fetchPostsTask = new Task(this, {
    task: async ([feed, page], { signal }) => {
      const data = await fetchPostCatagory(feed, page, signal);
      this._maxPages = data.pages;
      return data.posts;
    },
    args: () => [this.feed, this.page],
  });

  _goBackAPage() {
    this.page = (this.page - 1);
  }

  _getNextPage() {
    this.page = (this.page + 1);
  }

  _checkPages() {
    if (this.page + 1 == this._maxPages) {
      return html`<button class="button button-blue" @click="${this._goBackAPage}">« go back</button> `;
    } else if (this.page == 0) {
      return html`<button class="button button-blue" @click="${this._getNextPage}">next »</button>`;
    } else {
      return html`
        <button class="button button-blue" @click="${this._goBackAPage}">« go back</button>
        <button class="button button-blue" @click="${this._getNextPage}">next »</button>
      `;
    }
  }

  render() {
    return this._fetchPostsTask.render({
      pending: () => html`<p>fetching posts...</p>`,
      complete: (posts) => html`
        <div class="posts-container">${map(posts, (post) => html` <post-preview .postData=${post}></post-preview> `)}</div>
        <div class="posts-footer">
          <div class="paginator">
            <p>Page ${this.page + 1} of ${this._maxPages + 1}.</p>
            ${this._checkPages()}
          </div>
          <div class="posts-footer-extra">
            <a href="/posts/${this.feed}.rss" rel="nofollow">
              <img src="/img/rss-feed.png" width="16" height="16" alt="RSS feed" />
            </a>
          </div>
        </div>
      `,
      error: () => html` <p>something went wrong</p> `,
    });
  }

  createRenderRoot() {
    return this;
  }
}
