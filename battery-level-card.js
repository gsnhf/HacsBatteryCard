/**
 * Battery Level Card
 * Lovelace card that displays battery level as a visual battery indicator.
 * Color ranges from red (empty) to green (full).
 */

const LitElement = Object.getPrototypeOf(customElements.get("ha-panel-lovelace"));
const { html, css } = LitElement.prototype;

class BatteryLevelCard extends LitElement {
  static properties = {
    _config: { state: true },
    hass: { attribute: false },
  };

  static styles = css`
    ha-card {
      padding: 16px;
      box-sizing: border-box;
    }

    .battery-container {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .battery-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .battery-name {
      font-size: 1rem;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--primary-text-color);
    }

    .battery-percentage {
      font-size: 0.9rem;
      color: var(--secondary-text-color);
    }

    .battery-wrapper {
      display: flex;
      align-items: center;
    }

    .battery {
      position: relative;
      width: 50px;
      height: 24px;
      border: 2px solid var(--primary-text-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      overflow: hidden;
    }

    .battery-tip {
      width: 4px;
      height: 12px;
      background: var(--primary-text-color);
      border-radius: 0 2px 2px 0;
      margin-left: 2px;
    }

    .battery-level {
      position: absolute;
      top: 2px;
      left: 2px;
      bottom: 2px;
      border-radius: 2px;
      transition: width 0.3s ease, background-color 0.3s ease;
    }

    .battery-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--primary-text-color);
      text-shadow: 0 0 2px var(--card-background-color, #fff);
      z-index: 1;
    }

    .unavailable {
      opacity: 0.5;
      font-style: italic;
    }
  `;

  setConfig(config) {
    if (!config || !config.entity) {
      throw new Error("Bitte eine Entity für die battery-level-card angeben.");
    }

    this._config = {
      entity: config.entity,
      name: config.name || null,
      show_percentage_text: config.show_percentage_text !== false,
    };
  }

  getCardSize() {
    return 1;
  }

  /**
   * Calculate color based on battery percentage.
   * Red (0%) -> Yellow (50%) -> Green (100%)
   */
  _getBatteryColor(percentage) {
    const p = Math.max(0, Math.min(100, percentage));

    let r, g, b;

    if (p <= 50) {
      // Red to Yellow (0-50%)
      r = 255;
      g = Math.round((p / 50) * 255);
      b = 0;
    } else {
      // Yellow to Green (50-100%)
      r = Math.round(255 - ((p - 50) / 50) * 255);
      g = 255;
      b = 0;
    }

    return `rgb(${r}, ${g}, ${b})`;
  }

  render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    const entityId = this._config.entity;
    const stateObj = this.hass.states[entityId];

    if (!stateObj) {
      return html`
        <ha-card>
          <div class="battery-container unavailable">
            <span>Entity nicht gefunden: ${entityId}</span>
          </div>
        </ha-card>
      `;
    }

    const state = stateObj.state;
    const isUnavailable = state === "unavailable" || state === "unknown";
    const percentage = isUnavailable ? 0 : parseFloat(state) || 0;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    const name = this._config.name || stateObj.attributes.friendly_name || entityId;
    const batteryColor = this._getBatteryColor(clampedPercentage);
    const levelWidth = `calc(${clampedPercentage}% - 4px)`;

    return html`
      <ha-card>
        <div class="battery-container ${isUnavailable ? 'unavailable' : ''}">
          <div class="battery-info">
            <span class="battery-name">${name}</span>
            <span class="battery-percentage">
              ${isUnavailable ? 'Nicht verfügbar' : `${Math.round(clampedPercentage)}%`}
            </span>
          </div>
          <div class="battery-wrapper">
            <div class="battery">
              ${this._config.show_percentage_text && !isUnavailable
        ? html`<span class="battery-text">${Math.round(clampedPercentage)}%</span>`
        : ''
      }
              <div 
                class="battery-level" 
                style="width: ${isUnavailable ? '0' : levelWidth}; background-color: ${batteryColor};"
              ></div>
            </div>
            <div class="battery-tip"></div>
          </div>
        </div>
      </ha-card>
    `;
  }

  static getStubConfig(hass) {
    // Try to find a battery entity
    const batteryEntities = Object.keys(hass.states).filter(
      (entityId) => {
        const state = hass.states[entityId];
        return (
          state.attributes.device_class === "battery" ||
          entityId.includes("battery")
        );
      }
    );

    return {
      entity: batteryEntities[0] || "sensor.battery_level",
      name: "",
      show_percentage_text: true,
    };
  }

  static getConfigElement() {
    return document.createElement("battery-level-card-editor");
  }
}

/**
 * Simple Card Editor for visual configuration
 */
class BatteryLevelCardEditor extends LitElement {
  static properties = {
    _config: { state: true },
    hass: { attribute: false },
  };

  static styles = css`
    .editor-row {
      margin-bottom: 16px;
    }
    .editor-row label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
    }
    .editor-row input,
    .editor-row select {
      width: 100%;
      padding: 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      box-sizing: border-box;
    }
    .editor-row input[type="checkbox"] {
      width: auto;
    }
    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `;

  setConfig(config) {
    this._config = config;
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) return;

    const target = ev.target;
    const newConfig = { ...this._config };

    if (target.type === "checkbox") {
      newConfig[target.name] = target.checked;
    } else {
      newConfig[target.name] = target.value;
    }

    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    const batteryEntities = Object.keys(this.hass.states)
      .filter((entityId) => {
        const state = this.hass.states[entityId];
        return (
          state.attributes.device_class === "battery" ||
          entityId.includes("battery")
        );
      })
      .sort();

    return html`
      <div class="editor-row">
        <label>Entity</label>
        <select
          name="entity"
          .value=${this._config.entity || ""}
          @change=${this._valueChanged}
        >
          <option value="">-- Wähle eine Entity --</option>
          ${batteryEntities.map(
      (entity) => html`
              <option value=${entity} ?selected=${this._config.entity === entity}>
                ${this.hass.states[entity].attributes.friendly_name || entity}
              </option>
            `
    )}
        </select>
      </div>

      <div class="editor-row">
        <label>Name (optional, überschreibt Entity-Name)</label>
        <input
          type="text"
          name="name"
          .value=${this._config.name || ""}
          @input=${this._valueChanged}
          placeholder="Benutzerdefinierter Name"
        />
      </div>

      <div class="editor-row checkbox-row">
        <input
          type="checkbox"
          name="show_percentage_text"
          id="show_percentage_text"
          .checked=${this._config.show_percentage_text !== false}
          @change=${this._valueChanged}
        />
        <label for="show_percentage_text">Prozent in Batterie anzeigen</label>
      </div>
    `;
  }
}

if (!customElements.get("battery-level-card-editor")) {
  customElements.define("battery-level-card-editor", BatteryLevelCardEditor);
}

if (!customElements.get("battery-level-card")) {
  customElements.define("battery-level-card", BatteryLevelCard);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "battery-level-card")) {
  window.customCards.push({
    type: "battery-level-card",
    name: "Battery Level Card",
    description: "Zeigt den Batteriestand als visuelle Batterie-Anzeige mit Farbverlauf an",
    preview: true,
  });
}
