# Reglas para agentes

Antes de crear, mover o reorganizar código, lee `.codex/skills/next-modular-architecture/SKILL.md` y la referencia que enlaza.

Antes de crear o modificar un componente, lee también `.codex/skills/tailwind-component-creation/SKILL.md`.

Si la tarea consiste en iniciar un producto a partir de ABC o decidir una librería de componentes, lee `docs/using-this-template.md`.

- Respeta primero las convenciones existentes del repositorio.
- Mantén las rutas de Next en `src/app`, el producto en `src/modules` y el código transversal en `src/shared`.
- No crees carpetas genéricas como `src/components`, `src/services`, `src/utils`, `src/features` o `src/store`; la skill indica los únicos destinos permitidos y cuándo crearlos.
- No crees directorios vacíos ni capas “para el futuro”. Un directorio aparece junto con el primer archivo real que necesita esa responsabilidad.
- No importes desde `src/server` en componentes cliente ni hagas imports internos de otro módulo.
- No hagas refactors masivos sólo para uniformar nombres.
- Coloca pruebas unitarias o de componente en una subcarpeta `tests/` dentro de la carpeta del código que cubren, como `ui/tests/<archivo>.test.tsx` o `data/tests/<archivo>.test.ts`. Nunca mezcles archivos de prueba con archivos de producción. Crea `tests/` sólo cuando tenga pruebas. Conserva `tests/setup.ts` para la preparación compartida y `tests/e2e/` para recorridos de navegador.
- Usa `pnpm`; no generes ni modifiques `package-lock.json`.
- Usa Oxfmt y Oxlint mediante los scripts de `package.json`; conserva `pnpm typecheck` porque Oxc no sustituye la comprobación de tipos de TypeScript.
- Usa `tailwind-variants` sólo para variantes semánticas y estables. No construyas clases Tailwind dinámicamente ni agregues `tailwind-merge`.
- Ejecuta `pnpm knip` como informe de mantenimiento; sus hallazgos se revisan antes de eliminar código o dependencias.
- `pnpm check` es la definición de "listo": lo ejecutan el hook `pre-push` y CI. Añade un control nuevo como script dentro de `check`, no como paso suelto en CI. Ver `docs/shift-left.md`.
- No uses `git commit --no-verify` ni desactives reglas de Oxlint para pasar un hook; corrige la causa.
- Los commits siguen Conventional Commits (`tipo(alcance): resumen`); el hook `commit-msg` lo verifica.
- Ejecuta los chequeos relevantes antes de finalizar un cambio y comunica los que no hayan podido ejecutarse.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Configuración de UI con Redux

- Usa Redux Toolkit y React Redux para estado de interfaz compartido por una vista: pestañas, filtros, modos y apertura de modales. Ubica slice, fábrica y pruebas en el módulo dueño (UI y su subcarpeta tests), sin `src/store` global.
- Crea el store por instancia en un Provider cliente, nunca como singleton de módulo compartido por peticiones. Conserva el Provider entre pestañas de esa vista; reinícialo al cambiar de entidad o salir. No añadas persistencia sin petición.
- Mantén inputs/borradores locales cuando solo pertenecen al formulario. No almacenes DOM, promesas ni callbacks en Redux. El estado debe ser serializable.
- Redux configura la interfaz; el backend debe resolver y validar autenticación, permisos y reglas de negocio. No implementar autorización con banderas cliente.
- La adaptación futura de Permix y permisos en BD está documentada en `docs/permix-adaptation.md`; no crear su estructura hasta que un producto la necesite.

## Feedback al guardar

En formularios de producto, no uses un botón de guardado bloqueado como única explicación de requisitos pendientes. Permite solicitar el guardado y muestra feedback específico que lleve el foco al campo faltante, manteniendo la validación del formulario y del servidor. Conserva el bloqueo necesario durante un envío para evitar duplicados.

## Idioma técnico y TSDoc

- Usa inglés consistente para carpetas, archivos, variables, funciones, tipos, propiedades y códigos internos. Separa códigos de etiquetas traducidas; el texto visible y los datos clínicos de la interfaz pueden conservar español. No traduzcas nombres oficiales de dependencias ni datos históricos para cambiar su significado.
- Documenta en inglés mediante TSDoc (`/** ... */`) las APIs públicas, contratos y reglas de negocio no triviales que agregues o modifiques. Explica propósito, invariantes, efectos, errores y límites reales; usa `@param name - description`, `@returns`, `@remarks`, `@throws` o `{@link ...}` cuando aporten información. No repitas los tipos de TypeScript ni inventes garantías.
- Mantén la documentación junto al símbolo y actualízala al cambiar el comportamiento. No agregues comentarios vacíos que solo repitan el nombre ni documentes cada variable local. Un cambio solo de documentación no autoriza dependencias, generadores o refactors ajenos.

- Evita ternarios anidados; usa guard clauses, `if/else`, `switch` o mapas de valores legibles, conservando prioridad y comportamiento. Mantén `no-nested-ternary` como error en Oxlint; no suprimas reglas para pasar los controles. Corrige hallazgos verificables de Sonar y distingue su análisis de los chequeos locales.
