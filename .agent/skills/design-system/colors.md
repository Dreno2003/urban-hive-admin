# Colors — Urban Hive Brand System

This document documents the authoritative color system for Urban Hive. The system is built on a structured palette of brand and semantic tokens, defined in `app/globals.css`.

## Core Principle
- **Single Source of Truth**: All hex values are defined in `:root` inside `app/globals.css`.
- **Naming Convention**: Variables use the `--color-{family}-{shade}` pattern.
- **Tailwind Integration**: These variables are exposed via the `@theme` block in CSS, making them available as standard Tailwind classes (e.g., `text-primary-500`, `bg-navy-900`).

---

## Brand Palettes

### 1. Primary Families
Used for main branding, calls to action, and core UI elements.

| Family | Key Shades | Usage |
| :--- | :--- | :--- |
| **Maroon (Primary)** | `primary-50` to `primary-900` | The core brand identity color (Wine/Maroon). |
| **Gold (Yellow)** | `yellow-50` to `yellow-900` | Secondary brand color / Accent. |

### 2. Secondary Families
Used for supporting content, backgrounds, and visual depth.

| Family | Description | Examples |
| :--- | :--- | :--- |
| **Navy (Dark Blue)** | Dark, professional navy for headers/sidebars. | `navy-500`, `navy-900` |
| **Blue (Light Blue)** | Standard blue for links and informative UI. | `blue-500` |
| **Purple** | Deep purple for special sections or states. | `purple-500` |
| **Orange** | Vibrant orange for warnings or high-energy UI. | `orange-500` |

### 3. Neutral & Base
| Family | Description |
| :--- | :--- |
| **gray** | 10-step neutral scale for text, borders, and backgrounds. |
| **Base** | Absolute `black` (#000000) and `white` (#FFFFFF). |

### 4. Supporting (Status)
| Family | Mapping | Usage |
| :--- | :--- | :--- |
| **Red** | `red-500` | Error states, destructive actions. |
| **Warning** | `warning-500` | Warnings, pending states. |
| **Green** | `green-500` | Success states, confirmation. |

---

## Semantic Mappings

These tokens abstract the brand palette for specific UI roles, ensuring consistency and making dark mode implementation easier.

| Token | Light Mode Value | Dark Mode Value |
| :--- | :--- | :--- |
| `--background` | `base-white` | `gray-900` |
| `--foreground` | `gray-900` | `base-white` |
| `--primary` | `primary-500` | `primary-400` |
| `--secondary` | `gray-50` | `gray-700` |
| `--muted` | `gray-100` | `gray-700` |
| `--accent` | `yellow-500` | `yellow-500` |
| `--destructive` | `red-500` | `red-400` |
| `--border` | `gray-200` | `rgba(255,255,255,0.1)` |

---

## Usage Guide

### Using Brand Colors
Prefer using the semantic tokens first (`bg-primary`, `text-foreground`). Use specific shades only when the semantic token is too broad.

```html
<!-- Semantic usage (Recommended) -->
<button class="bg-primary text-primary-foreground">
  Book Now
</button>

<!-- Brand shade usage (For specific designs) -->
<div class="bg-navy-900 text-white p-8">
  Enterprise Dashboard
</div>
```

### Dark Mode
The system uses the `.dark` class strategy. Semantic tokens automatically flip based on this class.

```html
<div class="bg-card text-card-foreground">
  <!-- This background will be White in light mode, gray-800 in dark mode -->
</div>
```

---

## Color Reference Tables

> [!NOTE]
> For exact hex values, always refer to the `:root` block in `app/globals.css`.

| Shade | Primary (Maroon) | Navy | Yellow | gray |
| :--- | :--- | :--- | :--- | :--- |
| **50** | #F5E8EE | #E8EDF5 | #FFFDE7 | #F5F5F5 |
| **500** | #8B1A4A | #1A3A6B | #FFC107 | #999999 |
| **900** | #2B0717 | #050C1C | #3D2D02 | #141414 |
