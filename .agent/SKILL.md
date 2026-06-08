# Skill.md

## Engineering Philosophy

Code should prioritize:
1. Maintainability
2. Readability
3. Scalability
4. Reusability
5. Performance

---

# Tech Stack

## Frontend
- Next.js
- React 19 - (https://react.dev, https://react.dev/learn)
- TypeScript
- TailwindCSS v4
- Motion React
- TanStack Query
- shadcn/ui - (https://ui.shadcn.com/)
- Axios 
- Formik - (https://formik.org/docs/overview)
- Yup - (https://github.com/jquense/yup)
- 

Rules: 
- When building new features, prefer using shadcn/ui components and patterns for consistency and efficiency
- For custom UI, follow the design system and component patterns established in the design-system and component-patterns skills
- For data fetching and state management, use TanStack Query to handle server state
- When using shadcn/ui components, ensure that if the radix ui component is installed for that particular shadcn ui component
---

# Folder Structure

Feature-based organization:

```
src/
├── app/                          (Next.js app router)
├── features/                     (Feature modules)
│   ├── feature-name/
│   │   ├── components/           (Feature-specific components)
│   │   ├── hooks/                (Feature-specific hooks)
│   │   ├── services/             (Feature business logic)
│   │   ├── types/                (Feature types)
│   │   ├── utils/                (Feature utilities)
│   │   ├── constants.ts
│   │   └── index.ts              (Public exports)
│   └── another-feature/
├── shared/                       (Shared across features)
│   ├── components/
│   │   ├── ui/                   (shadcn/ui components)
│   │   └── sections/             (Reusable sections)
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── services/
│   └── constants.ts
├── config/                       (App configuration)
└── lib/                          (Utilities & helpers)
```

Rules:
- Each feature is self-contained with its own components, hooks, types, services
- Shared components, utilities, and types go in `shared/`
- Feature exports via `index.ts` to control public API
- Business logic in services/hooks, never in components
- UI components remain presentation-focused
- Minimize cross-feature dependencies
- for design reference the design-system skill
- for component patterns reference the component-patterns skill
- for business logic reference the business-logic skill
- for frontend reference the frontend skill
- for motion reference the motion skill
- for tailwind reference the tailwind skill
- for seo reference the seo skill
- for accessibility reference the accessibility skill
- for performance reference the performance skill

---

# React Standards

- Functional components only
- TypeScript required
- Prefer composition over inheritance
- Avoid prop drilling
- Keep components focused

Avoid:
- giant components
- deeply nested JSX
- duplicated logic

---

# TypeScript Standards

- Never use any
- Prefer type over interface
- Export reusable types
- Validate external data

---

# AI Workflow Rules

Before generating code:
1. Analyze existing architecture
2. Reuse existing patterns
3. Reuse components
4. Reuse motion variants
5. Preserve consistency

Code priorities:
1. Reusability
2. Maintainability
3. Performance
4. Accessibility

## Required output format

### Naming Conventions:
- PascalCase for components
- camelCase for functions
- kebab-case for files
- UPPER_SNAKE_CASE for constants
- snake_case for variables

rules:
- Always follow the established naming conventions
- Ensure names are descriptive and meaningful
- Avoid abbreviations unless widely understood
- Consistency is key; follow the patterns used in existing codebase
- Use the same naming conventions for new code to maintain uniformity across the project
- Avoid using var to create variables; always use const or let based on the context of the variable's usage and mutability

## What NOT to do
- Don't use !important
- prevent common AI UI mistakes 



