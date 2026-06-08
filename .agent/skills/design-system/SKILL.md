---
name: design-system
description: Senior-engineer design-system guide for Urban Hive. Authoritative rules, workflows, and conventions for colors, typography, tokens, components, accessibility, and QA.
argument-hint: "How should the design system be used or extended?"
---

# Design System — Senior Dev Skill

Purpose

- This skill documents the authoritative engineering guidance for the design system used across Urban Hive. It is written for senior engineers and maintainers who implement, extend, and enforce design tokens, component patterns, accessibility, and release workflows.

Primary references

- Colors: `.agent/skills/design-system/colors.md`
- Typography: `.agent/skills/design-system/typography.md`

Core principles

- Single source of truth: all tokens live in `app/globals.css` CSS custom properties.
- CSS-first tokens: use the `--color-{family}-{shade}` pattern for brand palettes.
- Tailwind v4 Integration: brand colors are exposed in the `@theme inline` block as `--color-*` variables, automatically creating `bg-`, `text-`, etc. utilities.
- Semantic usage: use semantic token names (`bg-primary`, `border-border`, `text-muted-foreground`) in components instead of raw brand shades where possible.
- Componentization: UI surface is implemented as composable React components in `src/shared/components` that consume tokens.
- Accessibility-first: every color addition must be checked for contrast (WCAG AA).

Token workflow (how to add or update a token)

1. Propose token addition based on the style guide (`✅ Colours.png`).
2. Add token CSS variable to `:root` in `app/globals.css` using the `--color-{family}-{shade}` pattern.
3. Update the semantic mapping in `:root` and `.dark` if the token should be part of the core UI theme.
4. Expose the variable in the `@theme inline` block to enable Tailwind utilities.
5. Update `.agent/skills/design-system/colors.md` documenting the new color.
5. Add component-level usage examples and unit/visual tests (Storybook story or static preview route).
6. Run automated contrast checks and a quick manual review.

Typography workflow

- Add new font/scale adjustments to `app/globals.css` (follow the existing `text-*` utilities pattern).
- Document usage in `.agent/skills/design-system/typography.md` with recommended class patterns and where to use them.
- Prefer token classes (e.g. `text-heading-lg`) over inline font-size styles.

Component patterns

- Small, focused components: keep components single-purpose and styled via tokens.
- Expose `className` and style hooks only; avoid internal style overrides that bypass tokens.
- Provide `size` / `variant` props that map to token classes (e.g. `size="lg"` -> `text-heading-lg`).
- Use semantic HTML and ARIA for interactive components.

Accessibility and QA

- Contrast: aim for WCAG AA for normal text and WCAG AAA for critical UI where practical. Use automated tools in CI to check contrast for new tokens.
- Focus states: ensure keyboard focus is visible. Use `--ring` token for focus rings and `ring-brand` utility.
- Reduced motion: respect `prefers-reduced-motion` in CSS and animation libraries.
- Color blindness: avoid conveying critical state with color alone; add icons/labels for destructive/success states.

Testing and visual review

- Add Storybook stories or a preview route for any new token or component.
- Add visual regression snapshots for critical components (buttons, forms, cards).
- CI should run Lint, unit tests, and visual tests before merging major design changes.

Release and changelog for tokens

- Group token changes into a single PR per design change with clear changelog entries.
- When removing or renaming a token, provide migration notes and a deprecation period (soft remove by aliasing first).

Developer ergonomics

- Keep `brand-` utility names minimal and searchable.
- Provide small usage examples in component docs or MD files next to the token docs.
- Encourage designers to supply OKLCH values when possible; record both OKLCH and hex in docs.

Enforcement and reviews

- PR reviewers must verify:
	- tokens are added to `app/globals.css` and documented under `.agent/skills/design-system/`
	- components use token utilities and do not hardcode colors/sizes
	- accessibility checks pass (contrast/focus/keyboard)

Where to find things

- Tokens and utilities: `app/globals.css`
- Color spec: `.agent/skills/design-system/colors.md`
- Typography spec: `.agent/skills/design-system/typography.md`
- Design-system skill files and guidelines: `.agent/skills/design-system/`

## Core Utilities

- `.container-wrapper`: Standard page container with responsive max-widths and horizontal padding. Use this for all main content sections.
  ```html
  <section class="container-wrapper py-24"> ... </section>
  ```

If you want, I can:

- scaffold example components in `src/shared/components` that demonstrate `brand-` color utilities and `text-*` typography classes, or
- add CI checks (contrast testing scripts) to the repo and a Storybook preview route.

