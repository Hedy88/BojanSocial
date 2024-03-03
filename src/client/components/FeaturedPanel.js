import { html, LitElement } from "lit";

export class FeaturedPanel extends LitElement {
  static properties = {};

  constructor() {
    super();
  }

  render() {
    return html`
      <div id="featured-panel" class="panel">
        <h2 class="panel-header">featured</h2>
        <div class="panel-content">users can see active / cool people here</div>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }
}
