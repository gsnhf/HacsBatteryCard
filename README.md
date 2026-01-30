# Battery Level Card

# CURRENTTLY UNDER DEVELOPMENT AND COMPLETELY UNTESTED!!!!

Eine benutzerdefinierte Lovelace-Karte für Home Assistant, die den Batteriestand von Geräten als visuelle Batterie-Anzeige darstellt.

![Battery Level Card Preview](docs/preview.png)

## Features

- 🔋 **Visuelle Batterie-Anzeige** - Der Batteriestand wird als gefüllte Batterie dargestellt
- 🎨 **Farbverlauf** - Automatischer Farbwechsel von Rot (leer) über Gelb zu Grün (voll)
- 📊 **Prozentanzeige** - Der aktuelle Stand wird in Prozent angezeigt
- ⚙️ **Visueller Editor** - Einfache Konfiguration über die Lovelace UI
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
   url: /hacsfiles/battery-level-card/battery-level-card.js
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
```

### Konfigurationsoptionen

| Option                 | Typ     | Standard    | Beschreibung                             |
| ---------------------- | ------- | ----------- | ---------------------------------------- |
| `entity`               | string  | **Pflicht** | Die Entity-ID des Batterie-Sensors       |
| `name`                 | string  | Entity-Name | Benutzerdefinierter Name für die Anzeige |
| `show_percentage_text` | boolean | `true`      | Zeigt die Prozentzahl in der Batterie an |

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

## Farbschema

Die Farbe der Batterie-Füllung ändert sich automatisch basierend auf dem Ladestand:

| Bereich | Farbe           |
| ------- | --------------- |
| 0-25%   | Rot → Orange    |
| 25-50%  | Orange → Gelb   |
| 50-75%  | Gelb → Hellgrün |
| 75-100% | Hellgrün → Grün |

## Entwicklung

Die Karte ist in JavaScript geschrieben und nutzt Lit, das mit Home Assistant mitgeliefert wird. Keine zusätzlichen Build-Tools oder Abhängigkeiten erforderlich.

## Lizenz

Veröffentlicht unter der MIT-Lizenz. Siehe `LICENSE` für Details.
