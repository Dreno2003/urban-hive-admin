<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.


for rules or skill, check this folder

./agent

## Before writing any code:
1. Read `.agent/SKILL.md` for the tech stack, folder structure, and conventions
2. Read ALL skill files in `.agent/skills/` that are relevant to the task:
   - `frontend/SKILL.md` — React/Next.js patterns, design fidelity rules
   - `design-system/SKILL.md` + `colors.md` + `typography.md` — tokens, colors, type scale
   - `component-patterns/SKILL.md` — button, card, navbar, section patterns
   - `forms/SKILL.md` — Formik + Yup patterns
   - `business-logic/SKILL.md` — services, query hooks, mutation hooks
   - `overview/SKILL.md` — product context and goals
3. Review existing feature implementations for consistency before writing new code
<!-- END:nextjs-agent-rules -->
