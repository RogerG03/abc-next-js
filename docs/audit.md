# Auditoría de la plantilla

Fecha: octubre de 2026. Alcance: herramientas, configuración, flujo de calidad y documentación de ABC como punto de partida para productos Next.js, evaluados con criterio _shift-left_: ¿puede un developer cumplir todos los estándares antes de llegar a CI/CD?

## Resumen

La base técnica era sólida (Next 16, React 19, TypeScript estricto, Oxc, Vitest, Playwright, Knip) y la arquitectura estaba bien documentada. El problema era que **casi nada se hacía cumplir**: CI estaba comentado, Husky era un ejemplo sin instalar, los límites de arquitectura sólo vivían en Markdown y la versión de Node no se verificaba. Un developer podía saltarse todos los estándares sin que nada lo detuviera.

## Hallazgos

| #   | Severidad | Hallazgo                                                                                                                                            | Acción                                                                                   |
| --- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | Alta      | CI comentado: ningún control se ejecutaba en remoto.                                                                                                | Activado con 3 jobs: calidad, build + E2E y seguridad.                                   |
| 2   | Alta      | Sin hooks de Git: la calidad local dependía de la memoria de cada persona.                                                                          | Lefthook con `pre-commit`, `commit-msg` y `pre-push`, instalado por `pnpm install`.      |
| 3   | Alta      | Sin escaneo de secretos ni auditoría de dependencias.                                                                                               | gitleaks (local opcional, CI obligatorio), `pnpm audit`, dependency review y Dependabot. |
| 4   | Media     | Node no se verificaba: con Node 24.16 todo funcionaba aunque `engines` pedía `>=24.20.0`.                                                           | `devEngines.runtime` con descarga automática de Node 24.20.0, fijado en el lockfile.     |
| 5   | Media     | Los límites `shared → modules`, `modules → app` y los imports internos entre módulos sólo estaban documentados.                                     | Reglas `no-restricted-imports` por carpeta en `.oxlintrc.json`.                          |
| 6   | Media     | `next-env.d.ts` estaba en `.gitignore` y versionado a la vez; `next dev` lo reescribía y dejaba diffs.                                              | Eliminado de Git; `typecheck` lo regenera con `next typegen`.                            |
| 7   | Media     | Sin `.gitattributes`: en Windows Git convertía a CRLF y avisaba en cada archivo, con riesgo de que `format:check` falle según el sistema operativo. | `* text=auto eol=lf`.                                                                    |
| 8   | Media     | La lista de checks se repetía en README, guía, hook de ejemplo y CI, con riesgo de que se desincronizaran.                                          | Un solo script `pnpm check` que usan `pre-push` y CI.                                    |
| 9   | Media     | E2E en CI se ejecutaría contra `next dev`, no contra el build real.                                                                                 | En CI Playwright usa `next start` tras `next build`, `forbidOnly` y un reintento.        |
| 10  | Baja      | Oxlint sólo usaba la categoría por defecto.                                                                                                         | `correctness` + `suspicious` como errores y plugin `import`.                             |
| 11  | Baja      | Sin convención de commits verificada (el historial ya la seguía de forma implícita).                                                                | Hook `commit-msg` con Conventional Commits.                                              |
| 12  | Baja      | Sin plantilla de PR ni Definition of Done.                                                                                                          | `.github/pull_request_template.md`.                                                      |
| 13  | Baja      | Cabecera `X-Powered-By: Next.js` expuesta.                                                                                                          | `poweredByHeader: false`.                                                                |
| 14  | Baja      | Supply chain: cualquier versión recién publicada se instalaba al momento.                                                                           | `minimumReleaseAge: 1440` (24 h) en `pnpm-workspace.yaml`.                               |
| 15  | Info      | La documentación sólo existía como Markdown en el repositorio.                                                                                      | Sitio en GitHub Pages desde `docs/` con este informe, la guía y la comparativa.          |

## Valoración de librerías

Cada dependencia se mantiene sólo si cubre una etapa del flujo sin solaparse con otra.

| Librería                                              | Etapa shift-left                 | Veredicto | Motivo                                                                                                     |
| ----------------------------------------------------- | -------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------- |
| `next`, `react`, `react-dom`                          | Producto                         | Mantener  | Núcleo. `next` fijado a versión exacta; `next typegen` alimenta el typecheck.                              |
| `typescript`                                          | Editor, pre-push, CI             | Mantener  | Oxc no comprueba tipos; `tsc --noEmit` sigue siendo necesario.                                             |
| `oxlint`                                              | Editor, pre-commit, CI           | Mantener  | 50–100× más rápido que ESLint, por eso cabe en `pre-commit`. Ahora también aplica límites de arquitectura. |
| `oxfmt`                                               | Editor, pre-commit, CI           | Mantener  | Formato y orden de clases Tailwind sin Prettier.                                                           |
| `tailwindcss`, `@tailwindcss/postcss`, `postcss`      | Producto                         | Mantener  | Tailwind v4 requiere el plugin PostCSS.                                                                    |
| `tailwind-variants`                                   | Producto                         | Mantener  | Variantes tipadas; evita clases dinámicas que Tailwind no detecta.                                         |
| `vitest`, `@vitejs/plugin-react`, `jsdom`             | pre-push, CI                     | Mantener  | Tests unitarios y de componentes rápidos.                                                                  |
| `@testing-library/react`, `@testing-library/jest-dom` | pre-push, CI                     | Mantener  | Tests centrados en accesibilidad (`getByRole`).                                                            |
| `@playwright/test`                                    | CI (y local bajo demanda)        | Mantener  | Recorridos de navegador; demasiado lento para hooks, por eso sólo corre en CI y con `pnpm test:e2e`.       |
| `knip`                                                | pre-push, CI                     | Mantener  | Detecta exports, archivos y dependencias sin uso antes de que se acumulen.                                 |
| `@types/*`                                            | Editor                           | Mantener  | Tipos de Node y React.                                                                                     |
| **`lefthook`** (nuevo)                                | pre-commit, commit-msg, pre-push | Añadir    | Un binario sustituye a Husky + lint-staged + commitlint.                                                   |
| `husky` (ejemplo)                                     | —                                | Retirar   | Nunca se instaló; Lefthook cubre su función con menos piezas.                                              |

## Pospuesto a propósito

Se dejan fuera para no cargar la plantilla con piezas sin uso real. Cada una indica cuándo incorporarla.

| Mejora                                       | Incorpórala cuando                                                      |
| -------------------------------------------- | ----------------------------------------------------------------------- |
| Umbral de cobertura (`@vitest/coverage-v8`)  | Exista lógica de dominio real; el demo no aporta una cifra útil.        |
| Validación de entorno en `src/server/env.ts` | Aparezca la primera variable de entorno.                                |
| Paquete `server-only` en `src/server/**`     | Se cree `src/server/`; evita importarlo desde Client Components.        |
| CODEOWNERS                                   | Haya más de un equipo o área responsable en el repositorio de producto. |
| Lighthouse CI / presupuestos de bundle       | Exista UI real con objetivos de rendimiento.                            |
| Observabilidad (Sentry, OpenTelemetry)       | Haya un despliegue con usuarios.                                        |
| Changesets                                   | Se publique una librería versionada (no en la app).                     |
| commitlint, lint-staged, Husky               | No hace falta: Lefthook y su script de `commit-msg` lo cubren.          |

Ajustes de GitHub que no se pueden versionar (branch protection, push protection, CodeQL, Pages) están en [Flujo shift-left](shift-left.md#configuración-en-github-una-vez-por-repositorio).
