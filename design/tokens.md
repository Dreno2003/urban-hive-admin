# Design Tokens — Urban Hive

This file documents the CSS custom properties (design tokens) exposed in `app/globals.css` and the recommended usage without changing `tailwind.config.ts`.

## Colors (CSS variables)

- `--color-primary` — primary brand color (Tailwind: `bg-primary`, `text-primary`)
- `--color-primary-foreground` — foreground color for primary backgrounds (`text-primary-foreground`)
- `--color-muted` — secondary/muted color used for captions and less prominent text (`text-muted`)
- `--color-muted-foreground` — text color used on muted backgrounds
- `--color-border` — border color (`border-border`)
- `--color-ring` — ring / focus color
- `--color-success`, `--color-danger`, `--color-warning` — semantic tokens for feedback

Usage examples (utilities are defined in `app/globals.css` under `@layer utilities`):

- `bg-primary` → background primary
- `text-primary-foreground` → text color when on a primary background
- `border-border` → border color utility

## Radii

- `--radius-sm` — small radius (mapped to `rounded-sm` via CSS utility)
- `--radius-md` — medium radius (mapped to `rounded-md` via CSS utility)
- `--radius-lg` — large radius (mapped to `rounded-lg` via CSS utility)

Note: we map these radii to utility classes in `app/globals.css` under `@layer utilities`, so you don't need to modify `tailwind.config.ts`.

## Shadows

- `--shadow-sm`, `--shadow-md`, `--shadow-lg` — shadow tokens; available as `shadow-sm`, `shadow-md`, `shadow-lg` via CSS utilities.

## Typography

- `--font-family-sans` — primary sans font stack used across the site.
- Typography tokens are defined in `app/globals.css` inside `@theme inline` so Tailwind can expose them to IntelliSense.
- `--text-heading-1` … `--text-heading-6` and their `--line-height` pairs — heading sizes.
 - `--text-display-xl`, `--text-display-lg`, `--text-display-md` and their `--line-height` pairs — display scale for hero and large headings.
 - `--text-heading-1` … `--text-heading-6` and their `--line-height` pairs — heading sizes.
- `--text-body-lg`, `--text-body-base`, `--text-body-sm` and their `--line-height` pairs — body copy sizes.
- `--text-label-lg`, `--text-label-base`, `--text-caption` and their `--line-height` pairs — label and caption text.

Usage examples:

- `text-[var(--text-heading-1)]` → hero/display headings
- `text-[var(--text-heading-2)]` → section headings
- `text-[var(--text-body-base)]` → body copy
- `text-[var(--text-body-sm)]` → captions and helper text
- `text-[var(--text-label-base)]` → labels and small UI text

See `design/typography.md` for the font scale and recommended usage.

## Dark mode

- Tokens have dark-mode overrides in `app/globals.css` inside `prefers-color-scheme: dark`.

## Adding tokens

To add a new token:

1. For non-typography tokens, add a CSS variable to `:root` in `app/globals.css` (and a dark-mode override if needed).
2. For typography tokens, define the values in `@theme inline` and use the CSS variables directly in Tailwind bracket syntax or component styles.
3. Use the token variable in components.

This approach avoids modifying `tailwind.config.ts` and keeps tokens editable by designers/developers directly in CSS.
