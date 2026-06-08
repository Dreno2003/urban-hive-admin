# Typography — Urban Hive

This document describes the typography scale implemented in Tailwind and the recommended classes to use across the app. The styles are based on the provided type spec (Inter as the primary family).

## Fonts

- Primary: Inter (imported via Google Fonts)

## Theme typography tokens (added in `global.css`)

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

- Body:
  - `--text-body-lg` — 1.125rem
  - `--text-body-lg--line-height` — 1.6
  - `--text-body-base` — 1rem
  - `--text-body-base--line-height` — 1.5
  - `--text-body-sm` — 0.875rem
  - `--text-body-sm--line-height` — 1.4

- Label:
  - `--text-label-lg` — 1.125rem
  - `--text-label-lg--line-height` — 1.2
  - `--text-label-base` — 1rem
  - `--text-label-base--line-height` — 1.2
  - `--text-caption` — 0.75rem
  - `--text-caption--line-height` — 1.3

## Recommended patterns

- Hero / product name
  - `text-[var(--text-heading-1)] leading-[var(--text-heading-1--line-height)] font-semibold`

- Section title
  - `text-[var(--text-heading-2)] leading-[var(--text-heading-2--line-height)] font-medium`

- Card / modal title
  - `text-[var(--text-heading-3)] leading-[var(--text-heading-3--line-height)] font-medium`

- Body copy (default)
  - `text-[var(--text-body-base)] leading-[var(--text-body-base--line-height)]`

- Small helper text / captions
  - `text-[var(--text-body-sm)] leading-[var(--text-body-sm--line-height)] text-muted`

- Labels / form captions
  - `text-[var(--text-label-base)] leading-[var(--text-label-base--line-height)] uppercase`

## Implementation notes

- Fonts are imported in `app/globals.css` and the `--font-sans` variable is used as the primary stack.
- Typography values are defined in `app/globals.css` inside the `@theme inline` block, not as standalone utility classes.
- Use Tailwind bracket syntax with these CSS variables for consistent sizing.

## Where to use which style (quick map)

- Page hero: `text-[var(--text-heading-1)]`
- Section headings: `text-[var(--text-heading-2)]`
- Card titles: `text-[var(--text-heading-3)]`
- Body copy: `text-[var(--text-body-base)]`
- Forms / labels: `text-[var(--text-label-base)]`

---

If you want, I can:

- add example React/TSX components in `src/shared/components` showcasing each style, or
- generate a Storybook page or static preview route that renders the type scale.
