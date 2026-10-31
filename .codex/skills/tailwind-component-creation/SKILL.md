---
name: tailwind-component-creation
description: Create or modify accessible Next.js UI components with Tailwind CSS v4 and tailwind-variants while preserving the modular architecture.
---

# Tailwind Component Creation

Use this skill for React UI work in this repository. Read `AGENTS.md` and `.codex/skills/next-modular-architecture/SKILL.md` first; they decide ownership and dependency direction.

## Place the component before writing it

- Route, layout, metadata, or handler: `src/app/`.
- Product vocabulary or a component used by one product capability: `src/modules/<module>/ui/`.
- Stable, domain-free UI reused across product capabilities: `src/shared/ui/`.
- If it has no clear owner, keep it next to its caller. Do not create `src/components`, Atomic Design folders, or a new generic directory.

Do not promote a module component to `shared/ui` because it is merely similar to another component. Promote it only after its API, accessibility behavior, and styling are demonstrably stable across domains.

## Tailwind and variants

- Use Tailwind v4 utility classes as complete, static strings. Never construct class names dynamically, such as `bg-${color}-500`; map known semantic values to complete classes instead.
- Keep a component's utility classes beside that component. Add global CSS only for application-wide tokens or base behavior that cannot be expressed locally.
- Use native semantic elements first (`button`, `a`, `input`, headings). Do not make interactive `div`s. Preserve keyboard, focus, label, disabled, and error behavior when editing an existing component.
- Use `tv` from `tailwind-variants` only for a stable semantic axis or repeated state. Define the recipe at module scope, use names such as `size`, `tone`, `intent`, `isLoading`, and derive its public variant type with `VariantProps` when callers receive those props.
- Prefer one `tv` recipe for a component. Use `slots` only when its separately styled parts need coordinated variants. Do not add a wrapper or a design-system primitive for a one-off call site.
- `tailwind-variants` already merges Tailwind conflicts; do not add `tailwind-merge` just to merge its classes.

## Minimum component shape

```tsx
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: "inline-flex items-center rounded-md font-medium",
  variants: {
    intent: { primary: "bg-blue-600 text-white", secondary: "bg-slate-100 text-slate-900" },
  },
  defaultVariants: { intent: "primary" },
});

type ButtonProps = VariantProps<typeof button> & React.ComponentProps<"button">;
```

Keep variants semantic and finite. Callers should not supply raw Tailwind color fragments or layout recipes as component props.

## Validate the real behavior

- Update or add a React Testing Library test in a `tests/` subfolder of the component’s owning folder when behavior, variants, events, or accessibility changes (for example, `ui/tests/project-form.test.tsx`). Never mix test files with production files.
- Add an E2E test only for a browser flow, route, cookie, navigation, or server/client interaction; keep it in `tests/e2e`.
- Run the narrow relevant tests, then `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, and `pnpm build` when the change warrants it. Run `pnpm knip` as a report and investigate its findings; it never authorizes blind deletion.
