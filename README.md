# Battery Level Card

# CURRENTTLY UNDER DEVELOPMENT AND COMPLETELY UNTESTED!!!!

Eine benutzerdefinierte Lovelace-Karte für Home Assistant, die den Batteriestand von Geräten als visuelle Batterie-Anzeige darstellt.

![Battery Level Card Preview](docs/preview.png)

## Features

- 🔋 **Visuelle Batterie-Anzeige** - Der Batteriestand wird als gefüllte Batterie dargestellt
- 🎨 **Farbverlauf** - Automatischer Farbwechsel von Rot (leer) über Gelb zu Grün (voll)
- 📊 **Optionale Prozentanzeige** - Die Prozentzahl kann direkt im Batteriesymbol angezeigt werden
- ⚙️ **Editor-Unterstützung** - Konfiguration über den Lovelace-Editor oder direkt im YAML-Code
- ↔️ **Flexible Ausrichtung** - Batteriesymbol horizontal oder vertikal darstellbar
- 🏷️ **Flexibler Titel** - Sensorbezeichnung optional, neben oder über dem Batteriesymbol
- 🏠 **HACS-kompatibel** - Einfache Installation über HACS

## Installation

### HACS (empfohlen)
1. Öffne HACS in Home Assistant
2. Gehe zu "Frontend"
3. Klicke auf die drei Punkte oben rechts und wähle "Benutzerdefinierte Repositories"
4. Füge dieses Repository hinzu mit Kategorie "Lovelace"
5. Suche nach "Battery Level Card" und installiere es
6. Starte Home Assistant neu

### Manuell
1. Kopiere `battery-level-card.js` in den Ordner `config/www/community/battery-level-card/`
2. Füge die Ressource zu deinen Lovelace-Dashboards hinzu (`Einstellungen → Dashboards → Ressourcen`):
   ```yaml
   url: /local/community/battery-level-card/battery-level-card.js
   type: module
   ```
3. Leere den Browser-Cache, falls die Karte nicht sofort erscheint

## Konfiguration

### Über den visuellen Editor
1. Füge eine neue Karte hinzu
2. Suche nach "Battery Level Card"
3. Wähle die gewünschte Battery-Entity aus
4. Konfiguriere optional den Namen und weitere Einstellungen

### YAML-Konfiguration

```yaml
type: custom:battery-level-card
entity: sensor.phone_battery_level
name: Handy Akku  # optional, überschreibt den Entity-Namen
show_percentage_text: true  # optional, zeigt % in der Batterie an (Standard: true)
show_name: true  # optional, zeigt die Sensorbezeichnung an (Standard: true)
orientation: horizontal  # optional: horizontal | vertical
title_position: side  # optional: side | top
```

### Konfigurationsoptionen

| Option                 | Typ     | Standard     | Beschreibung                                               |
| ---------------------- | ------- | ------------ | ---------------------------------------------------------- |
| `entity`               | string  | **Pflicht**  | Die Entity-ID des Batterie-Sensors                         |
| `name`                 | string  | Entity-Name  | Benutzerdefinierter Name für die Anzeige                   |
| `show_percentage_text` | boolean | `true`       | Zeigt die Prozentzahl im Batteriesymbol an                 |
| `show_name`            | boolean | `true`       | Blendet die Sensorbezeichnung ein oder aus                 |
| `orientation`          | string  | `horizontal` | Ausrichtung des Batteriesymbols (`horizontal`, `vertical`) |
| `title_position`       | string  | `side`       | Titel neben oder über dem Batteriesymbol (`side`, `top`)   |

## Beispiele

### Einfache Verwendung
```yaml
type: custom:battery-level-card
entity: sensor.smartphone_battery
```

### Mit benutzerdefiniertem Namen
```yaml
type: custom:battery-level-card
entity: sensor.tablet_battery_level
name: iPad Akku
```

### Ohne Prozenttext in der Batterie
```yaml
type: custom:battery-level-card
entity: sensor.remote_battery
name: Fernbedienung
show_percentage_text: false
```

### Vertikale Darstellung mit Titel darüber
```yaml
type: custom:battery-level-card
entity: sensor.window_sensor_battery
name: Fenstersensor
orientation: vertical
title_position: top
```

### Ohne Sensorbezeichnung
```yaml
type: custom:battery-level-card
entity: sensor.mouse_battery
show_name: false
```

## Farbschema

Die Farbe der Batterie-Füllung ändert sich automatisch basierend auf dem Ladestand:

| Bereich | Farbe           |
| ------- | --------------- |
| 0-25%   | Rot → Orange    |
| 25-50%  | Orange → Gelb   |
| 50-75%  | Gelb → Hellgrün |
| 75-100% | Hellgrün → Grün |

## Entwicklung

Die Karte ist in JavaScript geschrieben und nutzt native Web Components. Keine zusätzlichen Build-Tools oder Abhängigkeiten erforderlich.

### Entwicklungsumgebung starten

Für die lokale Entwicklung ist im Repository eine Docker-Compose-Datei für Home Assistant enthalten. Die Karte, eine Test-Entity und ein vorkonfiguriertes Dashboard werden automatisch eingerichtet.

1. Öffne das Repository in VS Code.
2. Starte Home Assistant:
   - über den Task `Home Assistant: Start` (Terminal → Task ausführen)
   - oder im Terminal mit `docker compose up -d`
3. Öffne Home Assistant:
   - über den Task `Home Assistant: Open`
   - oder im Browser unter `http://localhost:8123`
4. Richte Home Assistant beim ersten Start ein (Benutzer anlegen).
5. Fertig – das Dashboard mit Testkarten ist unter **Übersicht** verfügbar.

Die Lovelace-Ressource, eine Test-Battery-Entity (`sensor.test_battery_level`) und ein Dashboard mit verschiedenen Kartenvarianten werden automatisch über die Dateien in `ha-config/` bereitgestellt. Der Batteriestand kann über den Slider `input_number.test_battery` live verändert werden.

### Entwicklungs-Workflow

- Änderungen an `battery-level-card.js` werden durch den Bind-Mount sofort in Home Assistant sichtbar.
- Nach Änderungen reicht in der Regel ein harter Browser-Reload.
- Nützliche VS-Code-Tasks:
  - `Home Assistant: Start` – Container starten
  - `Home Assistant: Stop` – Container stoppen
  - `Home Assistant: Restart` – Container neu starten
  - `Home Assistant: Logs` – Container-Logs anzeigen
  - `Home Assistant: Open` – Home Assistant im Browser öffnen
- Die persistente Home-Assistant-Konfiguration liegt im lokalen Ordner `ha-config/`.

## Lizenz

Veröffentlicht unter der MIT-Lizenz. Siehe `LICENSE` für Details.
