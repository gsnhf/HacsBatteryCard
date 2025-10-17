import { LitElement, html, css } from "lit";

/**
 * Battery Level Card
 * A simple Lovelace card visualising the fill level of a battery sensor.
 */
class BatteryLevelCard extends LitElement {
  static properties = {
    hass: {},
    _config: { state: false },
  };

  static styles = css`
    ha-card {
      padding: 16px;
      box-sizing: border-box;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.1rem;
    }

    .title {
      font-weight: 600;
    }

    .value {
      font-family: var(--font-code, var(--primary-font-family));
      font-size: 1rem;
    }

    .battery {
      --battery-height: 120px;
      width: 56px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .cap {
      width: 26px;
      height: 10px;
      background: var(--battery-cap-color, var(--primary-text-color));
      border-radius: 4px 4px 0 0;
    }

    .body {
      width: 100%;
      height: var(--battery-height);
      border: 2px solid var(--battery-border-color, var(--primary-text-color));
      border-radius: 8px;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.05) 0%,
        rgba(255, 255, 255, 0) 40%
      );
      display: flex;
      align-items: flex-end;
    }

    .fill {
      width: 100%;
      background: var(--battery-normal-color, var(--success-color, #43a047));
      transition: height 0.6s ease;
    }

    .wrapper.warning .fill {
      background: var(--battery-warning-color, var(--warning-color, #ffa726));
    }

    .wrapper.critical .fill {
      background: var(--battery-critical-color, var(--error-color, #ef5350));
    }

    .charging {
      color: var(--battery-charging-color, var(--info-color, #1e88e5));
      font-size: 0.9rem;
      text-align: center;
    }

    .status {
      font-size: 0.85rem;
      color: var(--secondary-text-color);
      text-align: center;
    }

    .message {
      color: var(--error-color, #ef5350);
      font-weight: 500;
    }
  `;

  setConfig(config) {
    if (!config || !config.entity) {
      throw new Error("You need to define an entity for battery-level-card");
    }

    this._config = {
      name: config.name,
      entity: config.entity,
      charging_entity: config.charging_entity,
      charging_label: config.charging_label,
      warning_level: config.warning_level ?? 30,
      critical_level: config.critical_level ?? 10,
      show_percentage: config.show_percentage ?? true,
      precision: Number.isFinite(config.precision) ? config.precision : 0,
    };
  }

  getCardSize() {
    return 2;
  }

  render() {
    if (!this._config) {
      return html``;
    }

    const stateObj = this.hass?.states?.[this._config.entity];
    if (!stateObj) {
      return this._renderMessage(`Entity ${this._config.entity} not found`);
    }

    if (stateObj.state === "unavailable" || stateObj.state === "unknown") {
      return this._renderMessage("Sensor state is currently unavailable");
    }

    const rawValue = Number(stateObj.state);
    if (Number.isNaN(rawValue)) {
      return this._renderMessage("Sensor state is not a number");
    }

    const level = this._clamp(rawValue, 0, 100);
    const displayLevel = level.toFixed(this._config.precision);
    const charging = this._computeCharging(stateObj);

    let severity = "normal";
    if (level <= this._config.critical_level) {
      severity = "critical";
    } else if (level <= this._config.warning_level) {
      severity = "warning";
    }

    const fillHeight = level === 0 ? 3 : level;

    return html`
      <ha-card>
        <div class="wrapper ${severity}">
          <div class="header">
            <div class="title">${this._config.name || stateObj.attributes.friendly_name || this._config.entity}</div>
            ${this._config.show_percentage
        ? html`<div class="value">${displayLevel}%</div>`
        : html``}
          </div>
          <div class="battery">
            <div class="cap"></div>
            <div class="body">
              <div class="fill" style="height: ${fillHeight}%;"></div>
            </div>
          </div>
          ${charging
        ? html`<div class="charging">${this._chargingLabel()}</div>`
        : html``}
          <div class="status">${stateObj.state} ${stateObj.attributes.unit_of_measurement || "%"}</div>
        </div>
      </ha-card>
    `;
  }

  _renderMessage(message) {
    return html`
      <ha-card>
        <div class="wrapper">
          <div class="message">${message}</div>
        </div>
      </ha-card>
    `;
  }

  _clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  _computeCharging(stateObj) {
    if (this._config.charging_entity) {
      const chargingState = this.hass?.states?.[this._config.charging_entity];
      if (chargingState) {
        return chargingState.state === "on" || chargingState.state === "charging";
      }
    }

    const attr = stateObj.attributes;
    if (attr.charging !== undefined) {
      return attr.charging === true || attr.charging === "on" || attr.charging === "charging";
    }

    if (attr.is_charging !== undefined) {
      return attr.is_charging === true || attr.is_charging === "on";
    }

    return false;
  }

  _chargingLabel() {
    if (typeof this._config.charging_label === "string") {
      return this._config.charging_label;
    }
    return "Charging";
  }

  static getStubConfig() {
    return {
      entity: "sensor.example_battery",
      warning_level: 30,
      critical_level: 10,
      show_percentage: true,
    };
  }
}

customElements.define("battery-level-card", BatteryLevelCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "battery-level-card",
  name: "Battery Level Card",
  description: "Visualise a battery sensor as a battery icon",
});
