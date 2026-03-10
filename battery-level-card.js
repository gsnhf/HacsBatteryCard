/**
 * Battery Level Card
 * Lovelace card that displays battery level as a visual battery indicator.
 * Color ranges from red (empty) to green (full).
 * Uses native HTMLElement — no LitElement dependency.
 */

class BatteryLevelCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = null;
    this._hass = null;
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
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
    this._render();
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
    return `rgb(${r},${g},0)`;
  }

  _render() {
    if (!this._config || !this._hass) return;

    const entityId = this._config.entity;
    const stateObj = this._hass.states[entityId];

    let name, percentText, levelWidth, batteryColor, isUnavailable;

    if (!stateObj) {
      name = "Entity nicht gefunden: " + entityId;
      percentText = "";
      levelWidth = "0";
      batteryColor = "gray";
      isUnavailable = true;
    } else {
      const state = stateObj.state;
      isUnavailable = state === "unavailable" || state === "unknown";
      const percentage = isUnavailable ? 0 : parseFloat(state) || 0;
      const clamped = Math.max(0, Math.min(100, percentage));
      name = this._config.name || stateObj.attributes.friendly_name || entityId;
      percentText = isUnavailable ? "Nicht verfügbar" : Math.round(clamped) + "%";
      levelWidth = isUnavailable ? "0" : "calc(" + clamped + "% - 4px)";
      batteryColor = this._getBatteryColor(clamped);
    }

    const showText = this._config.show_percentage_text && !isUnavailable;
    const batteryTextHtml = showText ? '<span class="battery-text">' + percentText + "</span>" : "";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
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
          text-shadow: 0 0 3px var(--card-background-color, #fff),
                       0 0 3px var(--card-background-color, #fff);
          z-index: 1;
        }
        .unavailable {
          opacity: 0.5;
          font-style: italic;
        }
      </style>
      <ha-card>
        <div class="battery-container${isUnavailable ? " unavailable" : ""}">
          <div class="battery-info">
            <span class="battery-name">${name}</span>
            <span class="battery-percentage">${percentText}</span>
          </div>
          <div class="battery-wrapper">
            <div class="battery">
              ${batteryTextHtml}
              <div class="battery-level" style="width:${levelWidth};background-color:${batteryColor};"></div>
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

customElements.define("battery-level-card", BatteryLevelCard);

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "battery-level-card")) {
  window.customCards.push({
    type: "battery-level-card",
    name: "Battery Level Card",
    description: "Zeigt den Batteriestand als visuelle Batterie-Anzeige mit Farbverlauf an",
  });
}

console.info(
  "%c BATTERY-LEVEL-CARD %c v1.0.0 ",
  "color:white;background:#16a34a;font-weight:bold;padding:2px 6px;border-radius:4px 0 0 4px;",
  "color:#16a34a;background:#e5e7eb;font-weight:bold;padding:2px 6px;border-radius:0 4px 4px 0;"
);
