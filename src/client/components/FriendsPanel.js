import { html, LitElement } from "lit";

export class FriendsPanel extends LitElement {
  static properties = {};

  constructor() {
    super();
  }

  render() {
    return html`
      <div id="friends-panel" class="panel">
        <h2 class="panel-header">friends</h2>
        <div class="panel-content">list of friends and friend requests</div>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }
}
