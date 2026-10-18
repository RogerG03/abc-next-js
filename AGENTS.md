# Reglas para agentes

Antes de crear, mover o reorganizar código, lee `.codex/skills/next-modular-architecture/SKILL.md` y la referencia que enlaza.

- Respeta primero las convenciones existentes del repositorio.
- Mantén las rutas de Next en `src/app`, el producto en `src/modules` y el código transversal en `src/shared`.
- No crees carpetas genéricas como `src/components`, `src/services`, `src/utils`, `src/features` o `src/store`; la skill indica los únicos destinos permitidos y cuándo crearlos.
- No crees directorios vacíos ni capas “para el futuro”. Un directorio aparece junto con el primer archivo real que necesita esa responsabilidad.
- No importes desde `src/server` en componentes cliente ni hagas imports internos de otro módulo.
- No hagas refactors masivos sólo para uniformar nombres.
- Coloca pruebas unitarias o de componente junto al archivo que cubren como `<archivo>.test.tsx`; reserva `tests/e2e` para recorridos de navegador.
- Usa `pnpm`; no generes ni modifiques `package-lock.json`.
- Ejecuta los chequeos relevantes antes de finalizar un cambio y comunica los que no hayan podido ejecutarse.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
