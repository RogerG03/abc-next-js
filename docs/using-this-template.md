# Usar ABC como plantilla de proyecto

ABC es una **referencia de inicio**, no el repositorio de tus aplicaciones. No subas producto, clientes, secretos ni funcionalidades reales a `RogerG03/abc-next-js`. Cada producto nace en su propio repositorio y toma estas reglas como punto de partida.

## Crear una aplicación nueva

En GitHub, marca este repositorio como _template repository_ una sola vez. Después usa **Use this template → Create a new repository** para crear, por ejemplo, `acme-portal`. GitHub genera un repositorio nuevo con historial independiente; no es un fork y los cambios del producto no vuelven a ABC automáticamente.

Si no se usa la interfaz de GitHub, crea un repositorio nuevo vacío y copia esta estructura sólo como primer commit. Nunca configures el repositorio de producto con `abc-next-js` como `origin`.

```text
abc-next-js                 # plantilla: reglas, ejemplo y mejoras reutilizables
acme-portal                 # app real: producto, datos y despliegue propios
acme-design-system          # futuro paquete UI versionado, sólo si llega a existir
code-memory                 # decisiones, skills y notas compartidas; no código de producto
```

## Primeros 15 minutos en el repositorio nuevo

1. Cambia `name`, `version`, la descripción y los metadatos de Next por los del producto.
2. Conserva `.nvmrc`, `packageManager`, `devEngines`, `pnpm-lock.yaml`, `lefthook.yml`, `.github/`, `AGENTS.md` y `.codex/skills/`.
3. Borra o reemplaza la pantalla demostrativa `modules/home` junto con su prueba; no dejes una UI ficticia en producción.
4. Crea sólo el primer módulo real en `src/modules/<modulo>/`.
5. Configura `.env.example` con nombres de variables sin valores secretos. Los valores reales nunca se versionan.
6. Ejecuta `pnpm install` (instala los hooks), `pnpm check` y `pnpm build`.
7. Activa en GitHub los ajustes de [Flujo shift-left](shift-left.md#configuración-en-github-una-vez-por-repositorio): branch protection con los checks de CI, push protection y CodeQL.

No renombres `src/app`, `src/modules` o `src/shared` durante el arranque. Si el producto todavía sólo tiene una página, `modules/<modulo>/ui` es suficiente: no crees `domain`, `data`, `server` ni carpetas vacías hasta que exista esa responsabilidad.

## Instrucción para agentes

Al comenzar una tarea, da al agente el repositorio nuevo y esta instrucción mínima:

```text
Lee AGENTS.md, la skill next-modular-architecture y, si hay UI,
tailwind-component-creation. Implementa sólo lo necesario en la capa que
posee el cambio. No crees carpetas genéricas ni directorios vacíos. Ejecuta
los checks relevantes y reporta los que no se hayan podido ejecutar.
```

Las reglas viven dentro del repositorio derivado, así que funcionan con Codex, Claude Code, Cursor u otro agente que pueda leer Markdown. Para conocimiento durable entre equipos o computadoras, consulta y actualiza `RogerG03/code-memory`; no copies el código de la app allí.

## Decidir dónde vive cada cosa

| Si estás creando…                                         | Destino                     |
| --------------------------------------------------------- | --------------------------- |
| URL, layout, metadata, handler o carga de ruta            | `src/app/`                  |
| Pantalla, flujo o regla con vocabulario del producto      | `src/modules/<modulo>/`     |
| Utilidad o UI estable sin vocabulario de negocio          | `src/shared/`               |
| Base de datos, secreto, SDK privado o integración externa | `src/server/` cuando exista |
| Recorrido de navegador                                    | `tests/e2e/`                |

No crees `src/components`, `src/services`, `src/utils`, `src/features`, `src/hooks` ni `src/types`. Si no hay dueño claro, mantenlo junto a quien lo usa hasta que el patrón se vuelva evidente.

## UI, Figma y Tailwind

La llegada de un diseño de Figma no convierte automáticamente la app en una librería. Primero implementa el componente dentro del módulo que lo necesita. Usa Tailwind con clases completas y estáticas; no construyas nombres como `bg-${color}-500`.

Usa `tailwind-variants` cuando un componente tenga variantes semánticas y estables, como `intent`, `size` o `tone`. La receta `tv` vive a nivel de módulo y sus props se tipan con `VariantProps`. Un componente pasa a `src/shared/ui` sólo cuando ya se reutiliza entre dominios y su API, accesibilidad y estilo son estables.

## Cuándo separar una librería de componentes

Crea un repositorio como `acme-design-system` cuando al menos dos aplicaciones necesiten los mismos componentes, tokens o contratos de UI. La app y la librería permanecen independientes:

```text
acme-design-system/
└─ packages/
   └─ ui/                 # @acme/ui

acme-portal/
└─ src/modules/           # consume @acme/ui; conserva su UI de producto
```

El paquete se publica o distribuye con versiones semánticas y la app instala una versión concreta; nunca importa `../../acme-design-system` ni copia el código de componentes. Changesets pertenece a esa librería cuando se necesiten changelog, versiones o publicación. Para una app privada normal no es obligatorio.

No crees todavía paquetes de tokens, Storybook o un monorepo sólo por anticipación. El primer paquete `@acme/ui` y un componente real extraído de Figma bastan para validar la necesidad.

## Opcionales de la plantilla

| Pieza        | Actívala cuando                                         | Acción                                                               |
| ------------ | ------------------------------------------------------- | -------------------------------------------------------------------- |
| GitHub Pages | Quieras publicar la documentación de `docs/`            | Settings → Pages → Source: GitHub Actions.                           |
| Playwright   | Existan flujos críticos de navegador                    | Conserva `tests/e2e`, la dependencia y el paso CI.                   |
| Vitest       | Haya lógica o componentes que requieran feedback rápido | Conserva pruebas junto a la fuente.                                  |
| Changesets   | Se publique una librería o paquete versionado           | Configúralo en el repositorio de librería, no por defecto en la app. |

## Mantener la relación con ABC

Un repositorio creado desde una plantilla tiene historial separado. Las mejoras futuras de ABC no llegan solas a las apps. Cuando ABC publique una mejora útil, revísala, aplica manualmente la parte compatible al proyecto y ejecútale sus checks. Registra decisiones relevantes en `code-memory`.

No intentes fusionar `main` de la plantilla con una aplicación ni usarla como submódulo. La plantilla evoluciona por mejoras reutilizables; cada app evoluciona por necesidades de producto.

## Antes de terminar una tarea

Ejecuta lo que corresponda al cambio:

```bash
pnpm check      # format:check, lint, typecheck, test, knip; también corre en pre-push
pnpm test:e2e   # si el cambio toca un flujo de navegador
pnpm build
```

No todos los cambios requieren E2E, pero cualquier check omitido debe declararse explícitamente. Knip es un informe: investiga cada hallazgo antes de borrar archivos, exports o dependencias.
