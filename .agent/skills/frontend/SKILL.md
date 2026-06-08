---
name: frontend
description: Authoritative guide for frontend development at Urban Hive. Focuses on high-fidelity design replication, React 19 / Next.js patterns, and senior engineering practices.
---

# Frontend Engineering — Senior Dev Skill

## Purpose

- This skill establishes the authoritative standards for building the Urban Hive user interface. It focuses on pixel-perfect design replication, leveraging modern React 19 and Next.js features, and maintaining a premium, performance-first codebase.

## Core Principles

- **Precision-First**: Replicate designs with 100% fidelity. Pay attention to micro-spacing, typography (optical sizing, kerning), and subtle gradients/shadows.
- **Modern React (19+)**: Utilize the latest React features such as `use`, `Action` state, and optimized Server/Client component boundaries.
- **Next.js 15/16+ Navigation**: Follow the new App Router conventions, optimized metadata, and enhanced caching strategies.
- **Tailwind v4 Mastery**: Use the new `@theme` blocks, CSS variables as first-class citizens, and declarative variant systems.
- **Motion & Polish**: Every interaction should feel intentional. Use smooth transitions and respect `prefers-reduced-motion`.

## Design Replication Workflow

When building from a mockup or image:

1.  **Analyze the Grid & Layout**: Identify the underlying container system (e.g., `.container-wrapper`) and spacing scales.
2.  **Color Extraction**: Use the established semantic tokens (`--primary`, `--accent`) instead of hardcoding hex values. If a color is missing, follow the [Design System Skill](file:///.agent/skills/design-system/SKILL.md) to add it.
3.  **Typography Matching**: Match the exact weight, line-height, and letter-spacing from the design. Urban Hive uses **Urbanist**.
4.  **Micro-Interactions**: Apply hover, focus, and active states that feel premium (subtle scale transforms, gradual color shifts).
5.  **Visual Audit**: Compare the implementation side-by-side with the mockup. Check alignment, padding, and corner radii (`--radius`).

## Component Architecture

- **Server Components (RSC) by Default**: Keep logic on the server to minimize bundle size.
- **Client Islands**: Only use `'use client'` for interactive elements (forms, carousels, maps).
- **Composition over Props**: Use the `children` pattern or slots to keep components flexible.
- **Type Safety**: Use TypeScript interfaces for all props. Avoid `any` at all costs.

## React 19 & Next.js Patterns

- **Form Actions**: Favor native Next.js Form Actions for better progressive enhancement and simpler state management.
- **Optimistic UI**: Use `useOptimistic` for instant feedback on user actions (like liking a property or updating a profile).
- **Suspense Boundaries**: Wrap heavy components or data-fetching islands in `<Suspense>` with a high-fidelity shimmer/skeleton loader.
- **SEO & Metadata**: Every page must have a descriptive title and meta description using the `generateMetadata` API.

## Code Quality & Performance

- **Zero Layout Shift (CLS)**: Always specify dimensions for images and placeholders. Use `next/image` for automatic optimization.
- **Tree-Shaking**: Ensure icons are imported individually from the [Icon Library](file:///.agent/skills/icons/SKILL.md).
- **Accessibility (A11y)**: Use semantic HTML (`<main>`, `<nav>`, `<article>`). Ensure all interactive elements are keyboard reachable and have ARIA labels where necessary.
- **Clean Code**: Follow the "Rule of Three" for refactoring. Don't over-engineer early, but generalize when a pattern repeats.

## Helpful Links

- [Design System Standards](file:///.agent/skills/design-system/SKILL.md)
- [Component Patterns](file:///.agent/skills/component-patterns/SKILL.md)
- [Icon Usage](file:///.agent/skills/icons/SKILL.md)
- [I18n Architecture](file:///.agent/skills/i18n/SKILL.md)

## UI Component Strategy

- **Shadcn UI First**: Always check for an existing Shadcn component before building from scratch. Use `npx shadcn@latest add <component>` if missing.
- **Tailwind v4 Logic**: Leverage the `@theme` block in `globals.css` for custom animations and transitions. Avoid complex arbitrary values in class names; prefer defining a theme variable if the value is reused.
- **Composition over Inheritance**: Build complex UIs by composing smaller, well-tested components.

## Visual Excellence & "Wow" Factor

- **Gradients & Depth**: Use the brand's primary and secondary colors in subtle gradients (e.g., `bg-gradient-to-b from-white to-gray-50`).
- **Glassmorphism**: When appropriate for overlays, use `backdrop-blur-md` with a semi-transparent background (e.g., `bg-white/80`).
- **Layout Sophistication**: Use `grid` for complex layouts. Ensure proper "white space" to give the content room to breathe.
- **Dynamic Feedback**: Add hover transforms (e.g., `hover:-translate-y-1 transition-transform`) to interactive cards.

## Senior Implementation Checklist

### 1. Design Fidelity
- [ ] **Spacing**: Are margins/padding multiples of the 4px/8px scale?
- [ ] **Colors**: Any hardcoded hex values? (Should be 0).
- [ ] **Radius**: Do cards and buttons use the `--radius` variables?
- [ ] **Shadows**: Are shadows using the brand's soft elevation style?
- [ ] **Active States**: Does the component respond to click/touch appropriately?

### 2. React 19 Patterns
- [ ] **Server Components**: Is it RSC where possible?
- [ ] **Hooks**: Are we using the new `use` hook for data/context instead of `useEffect` where applicable?
- [ ] **Actions**: Are form submissions using Server Actions?
- [ ] **Transitions**: Are heavy state changes wrapped in `startTransition`?

rules:
For api fetched use tanstack query reference the business-logic skill

### 3. Next.js Polish
- [ ] **Image Optimization**: Are all images using `next/image` with proper `sizes`?
- [ ] **Loading States**: Is there a meaningful `<Suspense>` fallback?
- [ ] **Metadata**: Are `title` and `openGraph` tags defined for the page?
- [ ] **Local Docs**: Did you verify any breaking changes in `node_modules/next/dist/docs/`?

### 4. Code Quality
- [ ] **Tailwind**: Are we using `@apply` sparingly and favoring utility classes?
- [ ] **Accessibility**: Is the tab order logical? Are aria-labels descriptive?
- [ ] **Error Boundaries**: Is there a fallback for component-level failures?
