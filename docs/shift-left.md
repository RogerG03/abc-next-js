---
eyebrow: "Guía · calidad"
description: "Cada control se mueve al punto más temprano y barato donde puede ejecutarse. Un único comando, pnpm check, define “listo”."
meta:
  - "8 etapas"
  - "3 hooks de Git"
  - "3 jobs de CI"
---

# Flujo shift-left

_Shift-left_ significa mover cada control al punto más temprano y barato donde puede ejecutarse. En ABC el principio es concreto: **un único comando, `pnpm check`, define "listo"**, y se ejecuta igual en la máquina del developer y en CI. Un PR rojo en CI indica que se saltó un paso local, no que CI encontró algo que el developer no podía ver.

## Etapas y controles

| Etapa                    | Cuándo                  | Qué se valida                                                                                    | Herramienta                            | Coste típico |
| ------------------------ | ----------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------- | ------------ |
| 0. Instalación           | `pnpm install`          | Node 24.20.0 exacto (se descarga si falta), dependencias con al menos 24 h publicadas, hooks Git | pnpm `devEngines`, `minimumReleaseAge` | una vez      |
| 1. Editor                | Al guardar              | Formato, lint, tipos                                                                             | Extensiones Oxc y TypeScript           | instantáneo  |
| 2. `pre-commit`          | `git commit`            | Formato de archivos staged (se corrige y re-stagea), lint de staged, secretos                    | Lefthook + Oxfmt + Oxlint + gitleaks   | < 2 s        |
| 3. `commit-msg`          | `git commit`            | Conventional Commits: `tipo(alcance): resumen`                                                   | Lefthook                               | instantáneo  |
| 4. `pre-push`            | `git push`              | `pnpm check`: formato, lint, tipos, unit tests, Knip                                             | Lefthook                               | ~10–20 s     |
| 5. Pull request          | Al abrir el PR          | Checklist de Definition of Done                                                                  | `.github/pull_request_template.md`     | —            |
| 6. CI (red de seguridad) | Cada PR y push a `main` | `pnpm check`, build de producción + E2E, `pnpm audit`, gitleaks del historial, dependency review | GitHub Actions                         | 2–4 min      |
| 7. Mantenimiento         | Semanal                 | Actualizaciones de dependencias y acciones agrupadas                                             | Dependabot                             | —            |

```text
editor ──▶ pre-commit ──▶ commit-msg ──▶ pre-push (pnpm check) ──▶ PR ──▶ CI (mismo pnpm check + build + E2E + seguridad) ──▶ main
  │            │                                │                                 │
  └── segundos ┴────── el 95 % de los errores se detiene aquí ───────────────────┘── CI sólo confirma
```

## Qué hace cada pieza

### Runtime fijado por pnpm

`package.json` declara `devEngines.runtime` con Node `24.20.0` y `onFail: "download"`. pnpm descarga ese Node, lo registra en `pnpm-lock.yaml` y lo usa para los scripts. Ya no depende de que cada persona recuerde `nvm use`: antes, Node 24.16 instalaba y ejecutaba todo sin aviso aunque `engines` pedía `>=24.20.0`.

### Cadena de suministro

`pnpm-workspace.yaml` define:

- `minimumReleaseAge: 1440`: no se instala una versión publicada hace menos de 24 horas. La mayoría de paquetes comprometidos se retiran dentro de ese plazo.
- `engineStrict: true`: una dependencia incompatible con el Node del proyecto falla en la instalación, no en producción.
- `allowBuilds`: lista explícita de paquetes que pueden ejecutar scripts de instalación. Lefthook está denegado porque sus hooks se instalan con el script `prepare`.

### Hooks de Git con Lefthook

Lefthook es un binario único, sin dependencias, que corre en paralelo y sólo sobre archivos staged. Reemplaza a Husky + lint-staged + commitlint con un archivo, `lefthook.yml`, y dos scripts en `.lefthook/`. Se instala solo con `pnpm install`.

- **gitleaks** es opcional en local. Si no está instalado, el hook avisa y continúa; CI lo ejecuta siempre. Instalación: `winget install gitleaks`, `brew install gitleaks` o el binario de la [página de releases](https://github.com/gitleaks/gitleaks/releases).
- `git commit --no-verify` existe, pero sólo retrasa el error hasta CI.

### Límites de arquitectura como reglas de lint

La skill `next-modular-architecture` ya no es sólo texto: `.oxlintrc.json` hace fallar el lint si

- `src/shared/**` importa `@/app`, `@/modules` o `@/server`;
- `src/modules/**` importa `@/app`;
- un módulo importa rutas internas `@/modules/<otro>/...` en lugar de la API pública `@/modules/<otro>` (o imports relativos dentro del propio módulo).

Además, las categorías `correctness` y `suspicious` de Oxlint son errores, y `--deny-warnings` no deja advertencias pendientes.

### Typecheck reproducible

`pnpm typecheck` ejecuta `next typegen && tsc --noEmit`. `next-env.d.ts` ya no se versiona (estaba en `.gitignore` y en Git a la vez, lo que generaba diffs en cada `next dev`), siguiendo la recomendación de Next 16.

### CI: misma barrera, más profunda

`.github/workflows/ci.yml` ejecuta tres jobs en paralelo con permisos mínimos (`contents: read`) y cancela ejecuciones obsoletas:

1. **Calidad**: `pnpm check`, exactamente lo mismo que el `pre-push`.
2. **Build + E2E**: `next build` y Playwright contra el servidor de producción (`next start`), con `forbidOnly`, un reintento y el reporte HTML como artefacto si falla.
3. **Seguridad**: `pnpm audit --prod --audit-level high`, gitleaks sobre todo el historial y `dependency-review-action` en PRs.

## Configuración en GitHub (una vez por repositorio)

Estas protecciones son ajustes del repositorio, no archivos, así que hay que activarlas a mano:

1. **Settings → Branches → `main`**: exige PR, exige los checks `Calidad (pnpm check)`, `Build + E2E` y `Seguridad`, y bloquea pushes directos.
2. **Settings → Code security**: activa _Secret scanning_ con _Push protection_, _Dependabot alerts_ y _CodeQL default setup_.
3. **Settings → Pages → Source: GitHub Actions**, para publicar `docs/` con `.github/workflows/pages.yml`.
4. **Settings → General → Template repository**, para crear productos con _Use this template_.

## Cómo añadir un control nuevo

1. Añádelo como script en `package.json`.
2. Si es rápido (menos de ~20 s), inclúyelo en `check`: correrá en `pre-push` y en CI sin tocar nada más.
3. Si es lento o necesita red o navegador, añádelo sólo como job de CI y documéntalo en esta tabla.

No dupliques la lista de comandos en varios sitios: `check` es la fuente de verdad.
