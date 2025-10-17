# Battery Level Card

Custom Lovelace card for Home Assistant that visualises the state of charge of any battery sensor. The card shows a simple battery icon whose fill level follows the configured sensor value and highlights critical thresholds.

## Features

- Visual battery representation with dynamic fill level
- Optional colour thresholds for warning and critical levels
- Configurable label, charging indicator and decimal precision
- Responsive layout that works in panel or grid views

## Installation

### Manual
1. Copy `battery-level-card.js` into your Home Assistant `config/www` folder.
2. Add the resource to your Lovelace Dashboards (`Settings → Dashboards → Resources`):
   ```yaml
   url: /local/battery-level-card.js
   type: module
   ```
3. Restart your browser (clear cache if required).

### HACS
1. Add this repository as a custom repository from the `Frontend` category.
2. Install **Battery Level Card**.
3. Make sure the resource `/hacsfiles/battery-level-card.js` is added automatically, or add it manually.

## Lovelace Configuration

```yaml
type: custom:battery-level-card
entity: sensor.phone_battery
name: Phone
charging_entity: binary_sensor.phone_charging # optional
charging_label: Lädt # optional, default "Charging"
warning_level: 30 # optional, default 30
critical_level: 10 # optional, default 10
show_percentage: true # optional, default true
precision: 0 # optional, default 0
``` 

### Options

| Option            | Type    | Default              | Description                                            |
| ----------------- | ------- | -------------------- | ------------------------------------------------------ |
| `entity`          | string  | required             | Battery sensor entity (0-100%).                        |
| `name`            | string  | entity friendly name | Optional custom title.                                 |
| `charging_entity` | string  | –                    | Binary sensor that indicates charging (on = charging). |
| `charging_label`  | string  | "Charging"           | Custom text shown when the battery is charging.        |
| `warning_level`   | number  | 30                   | Value threshold for warning colour.                    |
| `critical_level`  | number  | 10                   | Value threshold for critical colour.                   |
| `show_percentage` | boolean | true                 | Toggle percentage text.                                |
| `precision`       | number  | 0                    | Decimal places used for the percentage label.          |

## Development

The card is written as a single JavaScript module built on top of Lit. For adjustments you can edit `battery-level-card.js` directly. No additional tooling is required.

## License

Released under the MIT License. See `LICENSE` for details.
