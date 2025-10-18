# Battery Level Card

# CURRENTTLY UNDER DEVELOPMENT AND COMPLETELY UNTESTED!!!!

Minimal custom Lovelace card for Home Assistant that simply renders the configured name. This version acts as the foundation for future functionality.

## Features

- Displays the configured name centered inside an `ha-card`
- Depends only on the Lit helpers bundled with Home Assistant
- Provides a lightweight starting point for upcoming battery visuals

## Installation

### Manual
1. Copy `battery-level-card.js` into your Home Assistant `config/www/community/battery-level-card/` folder.
2. Add the resource to your Lovelace dashboards (`Settings → Dashboards → Resources`):
   ```yaml
   url: /hacsfiles/battery-level-card/battery-level-card.js
   type: module
   ```
3. Clear the browser cache if the card does not appear right away.

### HACS
1. Add this repository as a custom repository in the `Frontend` section.
2. Install **Battery Level Card** and wait for the files to be downloaded.
3. HACS places the file under `config/www/community/battery-level-card/`. Ensure the Lovelace resource exists (see manual step 2).

## Lovelace Configuration

```yaml
type: custom:battery-level-card
name: Wohnzimmer Sensor
```

Only the `name` field is currently used. The card renders the provided text.

## Development

The card is authored in JavaScript to avoid build tooling while the feature set is small. Lit ships with Home Assistant, so no additional dependencies are required.

## License

Released under the MIT License. See `LICENSE` for details.
