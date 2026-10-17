# Convenciones de arquitectura

## Nombres

| Elemento                          | Regla                                     | Ejemplo                                  |
| --------------------------------- | ----------------------------------------- | ---------------------------------------- |
| Directorio o archivo              | `kebab-case`                              | `project-form.tsx`, `project-members/`   |
| Archivo especial Next             | Nombre exacto                             | `page.tsx`, `layout.tsx`, `route.ts`     |
| Componente, tipo, interfaz, clase | `PascalCase`                              | `ProjectForm`, `ProjectRepository`       |
| Variable o función                | `camelCase`                               | `createProject`, `selectedProjectId`     |
| Booleano                          | `is`, `has`, `can`, `should`              | `isSubmitting`, `canEdit`                |
| Handler local / callback prop     | `handle` / `on`                           | `handleSubmit`, `onSubmit`               |
| Hook                              | `use`                                     | `useProjectFilters`                      |
| Props / input / DTO / esquema     | Sufijos `Props`, `Input`, `Dto`, `Schema` | `ProjectFormProps`, `CreateProjectInput` |
| Constante global inmutable        | `UPPER_SNAKE_CASE`                        | `MAX_PROJECT_NAME_LENGTH`                |

No uses `components`, `services`, `utils` o `types` globales para esconder código de un módulo. Los tests usan `archivo.test.ts`.

## Assets y UI

- Usa `public/images`, `public/icons` y `public/fonts`; assets y directorios en `kebab-case` descriptivo.
- Prefiere SVG para iconos/logos y WebP o AVIF optimizado para imagen raster. Usa `next/image` cuando aplique y un `alt` correcto.
- Un componente de librería se envuelve en `shared/ui` sólo cuando su API o estilo es transversal. El vocabulario del negocio se mantiene en `modules/<dominio>/ui`.

## Arquitectura y repositorios

`app → modules/shared/server`, `modules → propio/shared/API pública`, `shared → shared`, `server → contratos/shared`.

Para varios repositorios: el orquestador conserva ADRs, contratos, composición local y CI; no contiene fuentes de las apps. Cada app se construye y despliega sola. Comparte paquetes publicados versionados (`@organizacion/ui`, `@organizacion/contracts`) o contratos API versionados, nunca imports relativos entre repositorios ni submódulos como dependencia normal.

