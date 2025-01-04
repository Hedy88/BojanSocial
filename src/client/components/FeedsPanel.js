import { html, LitElement } from "lit";

export class FeedsPanel extends LitElement {
  static properties = {
    _currentTab: {
      state: true,
    },
  };

  constructor() {
    super();

    this._currentTab = "all";
  }

  _changeTab(tabName) {
    const posts = document.querySelector("bs-posts");

    posts.setAttribute("feed", tabName);
    this._currentTab = tabName;
  }

  render() {
    return html`
      <div id="feeds-panel" class="panel">
        <h2 class="panel-header">feeds</h2>
        <div class="panel-content feeds-container">
          <div class="tab all-tab  ${this._currentTab === "all" ? "active-tab" : ""}" @click="${() => this._changeTab("all")}">all</div>
          <div class="tab friends-tab ${this._currentTab === "friends" ? "active-tab" : ""}" @click="${() => this._changeTab("friends")}">friends</div>
          <div class="tab popular-tab  ${this._currentTab === "popular" ? "active-tab" : ""}" @click="${() => this._changeTab("popular")}">popular</div>
        </div>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }
}
