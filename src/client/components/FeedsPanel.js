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

  render() {
    return html`
      <div id="feeds-panel" class="panel">
        <h2 class="panel-header">feeds</h2>
        <div class="panel-content feeds-container">
          <div class="tab all-tab">all</div>
          <div class="tab friends-tab">friends</div>
          <div class="tab popular-tab">popular</div>
        </div>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }
}
