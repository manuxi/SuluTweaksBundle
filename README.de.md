# SuluTweaksBundle

[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/manuxi/SuluTweaksBundle/LICENSE)
![GitHub Tag](https://img.shields.io/github/v/tag/manuxi/SuluTweaksBundle)
[![Sulu Version](https://img.shields.io/badge/Sulu->=2.6-blue)](https://sulu.io/)
![Supports Sulu 2.6 or later](https://img.shields.io/badge/%20Sulu->=3.0-0088cc?color=00b2df)
[![PHP Version](https://img.shields.io/badge/PHP-%5E8.1-purple)](https://php.net/)

**Deutsche Version** | [English Version](README.md)

Dieses Bundle habe ich erstellt, um einige Aspekte der Listendarstellung von Sulu anzupassen.

Feature-Requests sind jederzeit willkommen.

Dieses Bundle funktioniert für Sulu 2.6 (wahrscheinlich auch früher) und 3.0. Benutzung auf eigene Gefahr 🤞🏻

---

## Features

### 🔴 Publish State Indicator

Ich mag keine Treppeneffekte, und die Standard-Darstellung hat eben diese produziert. 

Dieses Bundle räumt damit auf: Das enthaltene SCSS blendet die aktuellen Publish-Indikatoren und Ghost-Locale aus und fügt neue in eigenen Spalten hinzu. Dabei hat der PublishIndicator bei einem publizierten Element auch einen grünen Punkt.

| Status               | Farbe            |
|----------------------|------------------|
| Veröffentlicht       | 🟢 Grün          |
| Entwurf              | 🟢🟡 Grün + Gelb |
| Nicht veröffentlicht | 🟡 Gelb          |

![Publish Dots](docs/img/publish-dots.de.png)

### 🌐 Ghost Locale Indicator

Sulus eingebauter Ghost-Locale-Indikator (zeigt die Fallback-Sprache) wird automatisch zu Zellen hinzugefügt und kann nicht verschoben werden. Dieses Bundle bietet eine separate Spalte für die Ghost-Locale, sie beliebig in Listen platziert werden kann.

Das Styling entspricht dem Original-Design von Sulu.

![Ghost Locale](docs/img/ghost-locale.de.png)

### ⭐ Star Rating

Zeigt numerische Bewertungen als visuelle Sterne an. Unterstützt sowohl 5-Punkte- als auch 10-Punkte-Skalen (mit halben Sternen).

| Bewertung | Anzeige              |
|-----------|----------------------|
| 3/5       | ★★★☆☆                |
| 7/10      | ★★★⯪☆ (halber Stern) |

Der numerische Wert wird beim Hovern im Tooltip angezeigt. Optional kann der Wert auch neben den Sternen angezeigt werden.

![Star Rating](docs/img/star-rating.de.png)

---

## 👩🏻‍🏭 Installation

### Schritt 1: Paket installieren

```console
composer require manuxi/sulu-tweaks-bundle
```

### Schritt 2: Admin-Assets registrieren

Füge die Ressourcen zu deiner `assets/admin/package.json` hinzu:

```json
{
    "dependencies": {
        "sulu-tweaks-bundle": "file:../../vendor/manuxi/sulu-tweaks-bundle/src/Resources"
    }
}
```

### Schritt 3: Bundle importieren

Importiere das Bundle in `assets/admin/app.js`:

```javascript
import 'sulu-tweaks-bundle';
```

### Schritt 4: Admin-Assets neu bauen

```bash
cd assets/admin
npm install
npm run build
```

---

## 🔧 Wie es funktioniert

Wenn du das Bundle über `import 'sulu-tweaks-bundle';` importierst, passiert automatisch folgendes:

1. **Configuration Hook**: Das Bundle registriert einen Update-Config-Hook für `sulu_tweaks`
2. **Transformer-Registrierung**: Alle List-Field-Transformer werden in Sulus `listFieldTransformerRegistry` registriert
3. **Styles angewendet**: Das enthaltene SCSS blendet Sulus Standard-Indikatoren/Ghost-Locales aus und wendet eigenes Styling an

### Verfügbare Transformer

| Transformer                    | Type-Name                 | Beschreibung                               |
|--------------------------------|---------------------------|--------------------------------------------|
| `PublishStateFieldTransformer` | `publish_state_indicator` | Farbige Punkte für Veröffentlichungsstatus |
| `GhostLocaleFieldTransformer`  | `ghost_locale_indicator`  | Separate Spalte für Fallback-Sprache       |
| `StarRatingFieldTransformer`   | `star_rating`             | Sternebewertungs-Anzeige                   |

Du musst nur die Transformer, die du verwenden möchtest, zu deinen Listen-XML-Konfigurationen hinzufügen.

---

## 📋 Verwendung

### Publish State Indicator

Füge zu deiner Listen-XML hinzu (z.B. `config/lists/events.xml`):

```xml
<property name="publishedState" translation="sulu_tweaks.published" visibility="always">
    <field-name>publishedState</field-name>
    <entity-name>%sulu.model.event_translation.class%</entity-name>
    <joins ref="translation"/>

    <transformer type="publish_state_indicator"/>
</property>
```

**Tipp:** Platziere diese Property am Anfang deiner Liste für bessere Sichtbarkeit.

### Ghost Locale Indicator

Füge zu deiner Listen-XML hinzu:

```xml
<property name="ghostLocale" translation="sulu_tweaks.ghost_locale" visibility="always">
    <field-name>ghostLocale</field-name>

    <transformer type="ghost_locale_indicator"/>
</property>
```

**Hinweis:** Das Feld `ghostLocale` muss in deinen Listendaten verfügbar sein. Wenn du Sulu 3.0 DimensionContent-Architektur verwendest, wird dieses Feld normalerweise automatisch bereitgestellt.

### Star Rating

Füge zu deiner Listen-XML hinzu:

```xml
<property name="rating" translation="app.rating" visibility="always">
    <field-name>rating</field-name>

    <transformer type="star_rating"/>
</property>
```

Der Transformer erkennt automatisch die Skala:
- Werte 0-5: 5-Punkte-Skala mit vollen Sternen
- Werte 0-10: 10-Punkte-Skala mit halben Sternen

---

## 🧶 Konfiguration

Erstelle `config/packages/sulu_tweaks.yaml` in deinem Projekt:

```yaml
sulu_tweaks:
    publish_state_indicator:
        # Offset deaktivieren für einsprachige Projekte oder bei Verwendung von ghost_locale_indicator
        enable_offset: false

        # Oder Breite anpassen, wenn GhostIndicator andere Größe hat
        # enable_offset: true
        # offset_width: 28

    star_rating:
        # Numerischen Wert neben Sternen anzeigen (z.B. "★★★☆☆ (3/5)")
        # Auf false setzen, um nur Sterne anzuzeigen (Tooltip zeigt weiterhin den Wert)
        show_value: true
```

### Publish State Indicator Offset

Falls die hier enthaltenen GhostLocale nicht benutzt werden, muss vor den Publish-Indikatoren Platz geschafft werden.

Um dies zu erreichen, wird ein Offset gesetzt (Standard 28px).

**Hinweis:** Wenn der `ghost_locale_indicator`-Transformer als separate Spalte verwendet wird, wird kein Offset benötigt und kann deaktiviert werden.

### Star Rating Wertanzeige

Standardmäßig wird der numerische Wert neben den Sternen angezeigt: `★★★☆☆ (3/5)`

Setze `show_value: false` um ihn auszublenden. Der Tooltip bei Mouseover zeigt den Wert als Title an.

---

## 🗣️ Übersetzungen

Das Bundle liefert Übersetzungen für Englisch und Deutsch. Sie können im Projekt überschrieben werden:

```yaml
# translations/admin.en.yaml
sulu_tweaks:
    draft: "Draft"
    published: "Published"
    not_published: "Not published"
    ghost_locale: "Language"
```

```yaml
# translations/admin.de.yaml
sulu_tweaks:
    draft: "Entwurf"
    published: "Veröffentlicht"
    not_published: "Nicht veröffentlicht"
    ghost_locale: "Sprache"
```

---

## 📁 Bundle-Struktur

```
SuluTweaksBundle/
├── src/
│   ├── Admin/
│   │   └── TweaksAdmin.php
│   ├── DependencyInjection/
│   │   ├── Configuration.php
│   │   └── SuluTweaksBundleExtension.php
│   ├── Resources/
│   │   ├── config/
│   │   │   ├── packages/sulu_tweaks.yaml
│   │   │   └── services.xml
│   │   ├── js/
│   │   │   ├── FieldTransformers/
│   │   │   │   ├── PublishStateFieldTransformer.js
│   │   │   │   ├── PublishStateFieldTransformer.scss
│   │   │   │   ├── GhostLocaleFieldTransformer.js
│   │   │   │   ├── GhostLocaleFieldTransformer.scss
│   │   │   │   ├── StarRatingFieldTransformer.js
│   │   │   │   └── StarRatingFieldTransformer.scss
│   │   │   └── index.js
│   │   ├── translations/
│   │   │   ├── admin.de.yaml
│   │   │   └── admin.en.yaml
│   │   └── package.json
│   └── SuluTweaksBundle.php
└── README.md
```

---

## 🤝 Mitwirken

Beiträge sind willkommen! Du kannst gerne einen Pull Request einreichen.

---

## 📄 Lizenz

Dieses Bundle steht unter der MIT-Lizenz.