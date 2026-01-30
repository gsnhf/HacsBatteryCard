/**
 * Battery Level Card
 * Lovelace card that displays battery level as a visual battery indicator.
 * Color ranges from red (empty) to green (full).
 */

// Wait for HA to be ready and get LitElement
function loadCardHelpers() {
  return new Promise((resolve) => {
    if (customElements.get("ha-panel-lovelace")) {
      resolve();
    } else {
      customElements.whenDefined("ha-panel-lovelace").then(() => resolve());
    }
  });
}

loadCardHelpers().then(() => {
  const LitElement = Object.getPrototypeOf(customElements.get("ha-panel-lovelace"));
  const { html, css } = LitElement.prototype;

  class BatteryLevelCard extends LitElement {
    static get properties() {
      return {
        _config: { type: Object },
        hass: { type: Object },
      };
    }

    static get styles() {
      return css`
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
    }

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

    _getBatteryColor(percentage) {
      const p = Math.max(0, Math.min(100, percentage));
      let r, g;

      if (p <= 50) {
        r = 255;
        g = Math.round((p / 50) * 255);
      } else {
        r = Math.round(255 - ((p - 50) / 50) * 255);
        g = 255;
      }

      return `rgb(${r}, ${g}, 0)`;
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
          <div class="battery-container ${isUnavailable ? "unavailable" : ""}">
            <div class="battery-info">
              <span class="battery-name">${name}</span>
              <span class="battery-percentage">
                ${isUnavailable ? "Nicht verfügbar" : `${Math.round(clampedPercentage)}%`}
              </span>
            </div>
            <div class="battery-wrapper">
              <div class="battery">
                ${this._config.show_percentage_text && !isUnavailable
          ? html`<span class="battery-text">${Math.round(clampedPercentage)}%</span>`
          : ""}
                <div
                  class="battery-level"
                  style="width: ${isUnavailable ? "0" : levelWidth}; background-color: ${batteryColor};"
                ></div>
              </div>
              <div class="battery-tip"></div>
            </div>
          </div>
        </ha-card>
      `;
    }

    static getStubConfig() {
      return {
        entity: "sensor.battery_level",
        name: "",
        show_percentage_text: true,
      };
    }
  }

  if (!customElements.get("battery-level-card")) {
    customElements.define("battery-level-card", BatteryLevelCard);
    console.info("%c BATTERY-LEVEL-CARD %c Loaded ", "color: white; background: green; font-weight: bold;", "");
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
});
