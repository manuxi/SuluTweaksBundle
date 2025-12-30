# SuluTweaksBundle

[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/manuxi/SuluTweaksBundle/LICENSE)
![GitHub Tag](https://img.shields.io/github/v/tag/manuxi/SuluTweaksBundle)
[![Sulu Version](https://img.shields.io/badge/Sulu->=2.6-blue)](https://sulu.io/)
![Supports Sulu 2.6 or later](https://img.shields.io/badge/%20Sulu->=3.0-0088cc?color=00b2df)
[![PHP Version](https://img.shields.io/badge/PHP-%5E8.1-purple)](https://php.net/)

**English** | [Deutsche Version](README.de.md)

I made this bundle to tweak some aspects of Sulu.

Please feel comfortable submitting feature requests.

This bundle is still in development. Use at own risk 🤞🏻

---

## Features

### 🔴 Publish State Indicator

I don't like stairs in lists, so I created another listTransformer. For me it's better scannable now.

The included SCSS hides the current publish indicators and adds new ones (also with a green one for published elements).

| Status | Color |
|--------|-------|
| Published | 🟢 Green |
| Draft | 🟢🟡 Green + Yellow |
| Not published | 🟡 Yellow |

![Publish Dots](docs/img/publish-dots.de.png)

### 🌐 Ghost Locale Indicator

Sulu's built-in ghost locale indicator (showing the fallback language) is automatically added to cells and cannot be repositioned. This bundle provides a separate column for the ghost locale, allowing you to place it anywhere in your list.

The styling matches Sulu's original design.

![Ghost Locale](docs/img/ghost-locale.de.png)

### ⭐ Star Rating

Display numeric ratings as visual stars. Supports both 5-point and 10-point scales (with half-stars).

| Rating | Display |
|--------|---------|
| 3/5 | ★★★☆☆ |
| 7/10 | ★★★⯪☆ (half-star) |

The numeric value is shown in a tooltip on hover. Optionally, the value can be displayed next to the stars.

---

## 👩🏻‍🏭 Installation

### Step 1: Install the package

```console
composer require manuxi/sulu-tweaks-bundle
```

### Step 2: Register Admin Assets

Add the resources to your `assets/admin/package.json`:

```json
{
    "dependencies": {
        "sulu-tweaks-bundle": "file:../../vendor/manuxi/sulu-tweaks-bundle/src/Resources"
    }
}
```

### Step 3: Import the Bundle

Import the bundle in `assets/admin/app.js`:

```javascript
import 'sulu-tweaks-bundle';
```

### Step 4: Rebuild Admin Assets

```bash
cd assets/admin
npm install
npm run build
```

---

## 🔧 How It Works

When you import the bundle via `import 'sulu-tweaks-bundle';`, the following happens automatically:

1. **Configuration Hook**: The bundle registers an update config hook for `sulu_tweaks`
2. **Transformer Registration**: All list field transformers are registered in Sulu's `listFieldTransformerRegistry`
3. **Styles Applied**: The included SCSS hides Sulu's default indicators and applies custom styling

### Available Transformers

| Transformer | Type Name | Description |
|-------------|-----------|-------------|
| `PublishStateFieldTransformer` | `publish_state_indicator` | Colored dots for publish status |
| `GhostLocaleFieldTransformer` | `ghost_locale_indicator` | Separate column for fallback language |
| `StarRatingFieldTransformer` | `star_rating` | Star rating display |

You only need to add the transformers you want to use to your list XML configurations.

---

## 📋 Usage

### Publish State Indicator

Add to your list XML (e.g., `config/lists/events.xml`):

```xml
<property name="publishedState" translation="sulu_tweaks.published" visibility="always">
    <field-name>publishedState</field-name>
    <entity-name>%sulu.model.event_translation.class%</entity-name>
    <joins ref="translation"/>

    <transformer type="publish_state_indicator"/>
</property>
```

**Tip:** Place this property at the beginning of your list for better visibility.

### Ghost Locale Indicator

Add to your list XML:

```xml
<property name="ghostLocale" translation="sulu_tweaks.ghost_locale" visibility="always">
    <field-name>ghostLocale</field-name>

    <transformer type="ghost_locale_indicator"/>
</property>
```

**Note:** The `ghostLocale` field must be available in your list data. If you're using Sulu's DimensionContent architecture, this field is typically provided automatically.

### Star Rating

Add to your list XML:

```xml
<property name="rating" translation="app.rating" visibility="always">
    <field-name>rating</field-name>

    <transformer type="star_rating"/>
</property>
```

The transformer automatically detects the scale:
- Values 0-5: 5-point scale with full stars
- Values 6-10: 10-point scale with half-stars

---

## 🧶 Configuration

Create `config/packages/sulu_tweaks.yaml` in your project:

```yaml
sulu_tweaks:
    publish_state_indicator:
        # Disable offset for single-language projects or when using ghost_locale_indicator
        enable_offset: false

        # Or adjust width if GhostIndicator has different size
        # enable_offset: true
        # offset_width: 28

    star_rating:
        # Show numeric value next to stars (e.g. "★★★☆☆ (3/5)")
        # Set to false to show only stars (tooltip still shows value)
        show_value: true
```

### Publish State Indicator Offset

As you can see in the screenshot above, the dots are also in line when the ghost indicator is visible.

To achieve this, an offset is set (default 28px).

**Note:** If you use the `ghost_locale_indicator` transformer as a separate column, you should disable the offset since the ghost indicator is no longer in the same cell.

### Star Rating Value Display

By default, the numeric value is displayed next to the stars: `★★★☆☆ (3/5)`

Set `show_value: false` to hide it. The tooltip on hover will still show the value.

---

## 🗣️ Translations

The bundle provides translations for English and German. You can override them in your project:

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

## 📁 Bundle Structure

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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This bundle is under the MIT license.