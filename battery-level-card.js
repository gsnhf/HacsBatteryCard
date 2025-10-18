import { LitElement, html, css } from "lit";

/**
 * Battery Level Card
 * Minimal Lovelace card that renders the configured name.
 */
class BatteryLevelCard extends LitElement {
  static properties = {
    _config: { state: false },
  };

  static styles = css`
    ha-card {
      padding: 24px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      font-weight: 600;
    }
  `;

  setConfig(config) {
    if (!config || (!config.name && !config.title)) {
      throw new Error("Set a name for battery-level-card via 'name' or 'title'.");
    }

    this._config = {
      name: config.name || config.title,
    };
  }

  getCardSize() {
    return 1;
  }

  render() {
    if (!this._config) {
      return html``;
    }

    return html`
      <ha-card>
        ${this._config.name}
      </ha-card>
    `;
  }

  static getStubConfig() {
    return {
      name: "Battery Level Card",
    };
  }
}

if (!customElements.get("battery-level-card")) {
  customElements.define("battery-level-card", BatteryLevelCard);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "battery-level-card")) {
  window.customCards.push({
    type: "battery-level-card",
    name: "Battery Level Card",
    description: "Display a custom name in a simple card",
  });
}
