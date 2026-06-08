---
name: icons
description: Authoritative guide for icon management and usage at Urban Hive. All icons must come from the personal icon library.
argument-hint: "How to add or use icons from the personal library?"
---

# Icon System — Urban Hive

## Overview

Urban Hive uses a **Personal Icon Library** to ensure a unique and consistent brand identity. We avoid using generic icon libraries (like Lucide, FontAwesome) directly in feature code. All icons are centralized in a registry and consumed through a single `Icon` component.

## Core Registry

- **Location**: `shared/components/ui/icon.tsx`
- **Registry Object**: `Icons`
- **Primary Component**: `Icon`

## Usage Patterns

### 1. Using an Icon
Always use the `Icon` component with the `name` prop. Do not import SVG files or Lucide components directly into your features.

```tsx
import { Icon } from "@/shared/components/ui/icon";

// Standard usage
<Icon name="user" size={18} className="text-gray-400" />

// Custom size
<Icon name="google" size={24} />
```

### 2. Adding a New Icon
When you receive a new icon (e.g., from Figma):

1.  Open `shared/components/ui/icon.tsx`.
2.  Add a new entry to the `Icons` object.
3.  Clean the SVG:
    *   Remove hardcoded `width` and `height`.
    *   Replace hardcoded colors (like `#000000`) with `currentColor` to allow styling via Tailwind `text-*` classes.
    *   Ensure `fill="none"` is on the SVG if it's a stroke-based icon, or adjust accordingly.
    *   Preserve `viewBox`.

**Example:**
```tsx
export const Icons = {
  // ... existing icons
  chevronRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/arg/2000/svg" 
      {...props}
    >
      <path 
        d="..." 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  ),
};
```

## Best Practices

- **Centralization**: If an icon is used more than once, or is a brand-critical icon, it MUST be in the `Icons` registry.
- **Stylability**: Always use `currentColor` for fills or strokes unless the icon is multi-colored (like the Google logo).
- **Naming**: Use camelCase for icon names (e.g., `userProfile`, `arrowRight`).
- **Optimization**: Use SVGO or similar tools to optimize SVG paths before adding them to the registry.

## Prohibited Actions 🚫

- **No Direct Lucide Imports**: Do not do `import { User } from "lucide-react"`. If you need a "User" icon, use `name="user"` from our library (add it if missing).
- **No Inline SVGs**: Avoid pasting `<svg>...</svg>` directly in feature components.
- **No Hardcoded Colors**: Avoid `fill="#25292F"` inside the registry unless it is a fixed brand color that should never change.
