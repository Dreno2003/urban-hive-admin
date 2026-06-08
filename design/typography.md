# Typography — Urban Hive

This document defines the typography tokens and recommended classes for the Urban Hive design system.

## Fonts

- Primary: `Inter` (imported via Google Fonts in `app/globals.css`)
- Base font stack: `var(--font-sans)`

## Theme values

Typography token values are defined in `app/globals.css` inside the `@theme inline` block. Tailwind IntelliSense can pick up these token names, and helper utility classes are not required for the typography scale.

 - Display:
  - `--text-display-xl` — 4rem (64px)
  - `--text-display-xl--line-height` — 4.5rem (72px)
  - `--text-display-lg` — 3rem (48px)
  - `--text-display-lg--line-height` — 3.5rem (56px)
  - `--text-display-md` — 2.25rem (36px)
  - `--text-display-md--line-height` — 2.75rem (44px)

 - Headings:
  - `--text-heading-1` — 4.5rem
  - `--text-heading-1--line-height` — 1.1
  - `--text-heading-2` — 3.75rem
  - `--text-heading-2--line-height` — 1.1
  - `--text-heading-3` — 3rem
  - `--text-heading-3--line-height` — 1.2
  - `--text-heading-4` — 2.25rem
  - `--text-heading-4--line-height` — 1.25
  - `--text-heading-5` — 1.875rem
  - `--text-heading-5--line-height` — 1.3
  - `--text-heading-6` — 1.5rem
  - `--text-heading-6--line-height` — 1.35


- Body copy:
  - `--text-body-lg` — 1.125rem
  - `--text-body-lg--line-height` — 1.6
  - `--text-body-base` — 1rem
  - `--text-body-base--line-height` — 1.5
  - `--text-body-sm` — 0.875rem
  - `--text-body-sm--line-height` — 1.4

- Labels / captions:
  - `--text-label-lg` — 1.125rem
  - `--text-label-lg--line-height` — 1.2
  - `--text-label-base` — 1rem
  - `--text-label-base--line-height` — 1.2
  - `--text-caption` — 0.75rem
  - `--text-caption--line-height` — 1.3

## Recommended usage

- Hero / product name
  - `text-[var(--text-heading-1)] leading-[var(--text-heading-1--line-height)] font-semibold`

- Section heading
  - `text-[var(--text-heading-2)] leading-[var(--text-heading-2--line-height)] font-medium`

- Card title
  - `text-[var(--text-heading-3)] leading-[var(--text-heading-3--line-height)] font-medium`

- Body copy
  - `text-[var(--text-body-base)] leading-[var(--text-body-base--line-height)]`

- Small helper text / caption
  - `text-[var(--text-body-sm)] leading-[var(--text-body-sm--line-height)] text-muted`

- Label / form caption
  - `text-[var(--text-label-base)] leading-[var(--text-label-base--line-height)] uppercase`

## Notes

- Use the theme tokens directly instead of custom text utility classes.
- Use `font-medium` and `font-semibold` for weight, and `uppercase` when needed.
- The typography scale is implemented in `app/globals.css` using CSS custom properties in the `@theme inline` block.
