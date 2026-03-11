/**
 * Battery Level Card
 * Lovelace card that displays battery level as a visual battery indicator.
 * Color ranges from red (empty) to green (full).
 * Uses native HTMLElement without build tooling.
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

    const orientation = BatteryLevelCard._normalizeOrientation(config.orientation);
    const titlePosition = BatteryLevelCard._normalizeTitlePosition(config.title_position);

    this._config = {
      entity: config.entity,
      name: config.name || null,
      show_percentage_text: config.show_percentage_text !== false,
      show_name: config.show_name !== false,
      orientation,
      title_position: titlePosition,
    };
    this._render();
  }

  getCardSize() {
    return 1;
  }

  static _normalizeOrientation(value) {
    const normalized = String(value || "horizontal").toLowerCase();
    if (normalized === "vertical" || normalized === "vertikal") {
      return "vertical";
    }
    return "horizontal";
  }

  static _normalizeTitlePosition(value) {
    const normalized = String(value || "side").toLowerCase();
    if (normalized === "top" || normalized === "oben" || normalized === "above") {
      return "top";
    }
    return "side";
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
    const isVertical = this._config.orientation === "vertical";
    const titleClass = this._config.title_position === "top" ? "title-top" : "title-side";
    const orientationClass = isVertical ? "orientation-vertical" : "orientation-horizontal";

    let name, percentText, levelStyle, batteryColor, isUnavailable;

    if (!stateObj) {
      name = "Entity nicht gefunden: " + entityId;
      percentText = "";
      levelStyle = isVertical ? "height:0;" : "width:0;";
      batteryColor = "gray";
      isUnavailable = true;
    } else {
      const state = stateObj.state;
      isUnavailable = state === "unavailable" || state === "unknown";
      const percentage = isUnavailable ? 0 : parseFloat(state) || 0;
      const clamped = Math.max(0, Math.min(100, percentage));
      name = this._config.name || stateObj.attributes.friendly_name || entityId;
      percentText = isUnavailable ? "Nicht verfügbar" : Math.round(clamped) + "%";
      if (isUnavailable) {
        levelStyle = isVertical ? "height:0;" : "width:0;";
      } else if (isVertical) {
        levelStyle = "height:calc(" + clamped + "% - 4px);";
      } else {
        levelStyle = "width:calc(" + clamped + "% - 4px);";
      }
      batteryColor = this._getBatteryColor(clamped);
    }

    const showText = this._config.show_percentage_text && !isUnavailable;
    const batteryTextHtml = showText ? '<span class="battery-text">' + percentText + "</span>" : "";
    const nameHtml = this._config.show_name ? '<span class="battery-name">' + name + "</span>" : "";
    const batteryHtml = isVertical
      ? `
          <div class="battery-wrapper ${orientationClass}">
            <div class="battery-tip ${orientationClass}"></div>
            <div class="battery ${orientationClass}">
              ${batteryTextHtml}
              <div class="battery-level ${orientationClass}" style="${levelStyle}background-color:${batteryColor};"></div>
            </div>
          </div>
        `
      : `
          <div class="battery-wrapper ${orientationClass}">
            <div class="battery ${orientationClass}">
              ${batteryTextHtml}
              <div class="battery-level ${orientationClass}" style="${levelStyle}background-color:${batteryColor};"></div>
            </div>
            <div class="battery-tip ${orientationClass}"></div>
          </div>
        `;

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
          gap: 16px;
        }
        /* Orientation controls whether name and battery are laid out horizontally or vertically */
        .battery-container.orientation-horizontal {
          flex-direction: row;
          align-items: center;
        }
        .battery-container.orientation-vertical {
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .battery-container.title-side {
          align-items: center;
          justify-content: space-between;
        }
        .battery-container.title-top {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }
        .battery-container.no-name {
          justify-content: center;
          align-items: center;
        }
        .battery-name {
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.3;
          color: var(--primary-text-color);
        }
        .battery-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .battery-wrapper.orientation-vertical {
          flex-direction: column;
        }
        .battery {
          position: relative;
          border: 2px solid var(--primary-text-color);
          border-radius: 4px;
          background: var(--card-background-color, #fff);
          overflow: hidden;
        }
        .battery.orientation-horizontal {
          width: 50px;
          height: 24px;
        }
        .battery.orientation-vertical {
          width: 24px;
          height: 50px;
        }
        .battery-tip {
          background: var(--primary-text-color);
        }
        .battery-tip.orientation-horizontal {
          width: 4px;
          height: 12px;
          border-radius: 0 2px 2px 0;
          margin-left: 2px;
        }
        .battery-tip.orientation-vertical {
          width: 12px;
          height: 4px;
          border-radius: 2px 2px 0 0;
          margin-bottom: 2px;
        }
        .battery-level {
          position: absolute;
          border-radius: 2px;
          transition: width 0.3s ease, height 0.3s ease, background-color 0.3s ease;
        }
        .battery-level.orientation-horizontal {
          top: 2px;
          left: 2px;
          bottom: 2px;
        }
        .battery-level.orientation-vertical {
          left: 2px;
          right: 2px;
          bottom: 2px;
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
        <div class="battery-container ${titleClass} ${orientationClass}${this._config.show_name ? "" : " no-name"}${isUnavailable ? " unavailable" : ""}">
          ${nameHtml}
          ${batteryHtml}
        </div>
      </ha-card>
    `;
  }

  static getStubConfig() {
    return {
      entity: "sensor.battery_level",
      name: "",
      show_percentage_text: true,
      show_name: true,
      orientation: "horizontal",
      title_position: "side",
    };
  }

  static getConfigForm() {
    return {
      schema: [
        {
          name: "entity",
          required: true,
          selector: { entity: {} },
        },
        {
          name: "name",
          selector: { text: {} },
        },
        {
          name: "show_name",
          selector: { boolean: {} },
        },
        {
          name: "show_percentage_text",
          selector: { boolean: {} },
        },
        {
          name: "orientation",
          required: true,
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "horizontal", label: "Horizontal" },
                { value: "vertical", label: "Vertikal" },
              ],
            },
          },
        },
        {
          name: "title_position",
          required: true,
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "side", label: "Neben dem Batteriesymbol" },
                { value: "top", label: "Über dem Batteriesymbol" },
              ],
            },
          },
        },
      ],
      computeLabel: (schema) => {
        switch (schema.name) {
          case "name":
            return "Titel";
          case "show_name":
            return "Sensorbezeichnung anzeigen";
          case "show_percentage_text":
            return "Prozentzahl in der Batterie anzeigen";
          case "orientation":
            return "Anordnung von Name und Batterie";
          case "title_position":
            return "Position des Titels";
          default:
            return undefined;
        }
      },
      computeHelper: (schema) => {
        switch (schema.name) {
          case "name":
            return "Leer lassen, um den Friendly Name der Entity zu verwenden.";
          case "orientation":
            return "Legt fest, ob Name und Batteriesymbol horizontal (nebeneinander) oder vertikal (übereinander) angeordnet werden.";
          case "title_position":
            return "Legt fest, ob der Titel neben oder über dem Batteriesymbol steht.";
          default:
            return undefined;
        }
      },
      assertConfig: (config) => {
        if (!config.entity || typeof config.entity !== "string") {
          throw new Error("Bitte eine gültige Entity angeben.");
        }
      },
    };
  }
}

customElements.define("battery-level-card", BatteryLevelCard);

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "battery-level-card")) {
  window.customCards.push({
    type: "battery-level-card",
    name: "Battery Level Card",
    preview: false,
    description: "Zeigt den Batteriestand als visuelle Batterie-Anzeige mit Farbverlauf an",
    documentationURL: "https://github.com/gsnhf/battery-level-card",
  });
}

console.info(
  "%c BATTERY-LEVEL-CARD %c v2026.03.10.1 ",
  "color:white;background:#16a34a;font-weight:bold;padding:2px 6px;border-radius:4px 0 0 4px;",
  "color:#16a34a;background:#e5e7eb;font-weight:bold;padding:2px 6px;border-radius:0 4px 4px 0;"
);
