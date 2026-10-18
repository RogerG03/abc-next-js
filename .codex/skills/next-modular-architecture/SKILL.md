---
name: next-modular-architecture
description: "Build or change this Next.js template while enforcing its module boundaries, naming rules, and single- or multi-repository topology."
---

# Arquitectura modular de Next.js

Aplica estas reglas a cualquier cambio de estructura, nueva funcionalidad, componente, integración o refactor. La arquitectura definida aquí es obligatoria; no inventes carpetas, capas o paquetes fuera de las permitidas sin una decisión explícita documentada.

## 1. Antes de cambiar código

1. Lee `AGENTS.md`, este archivo, `README.md` y `docs/architecture.md`.
2. Inspecciona el módulo y las convenciones ya presentes antes de crear archivos.
3. Conserva las convenciones existentes salvo que contradigan este documento o una decisión de arquitectura posterior.
4. No realices una reorganización masiva sólo para hacer coincidir nombres.

## 2. Árbol permitido para una aplicación

```text
src/
├─ app/                              # Rutas, layouts, metadata y handlers de Next
│  ├─ (grupo-de-rutas)/              # Opcional: route group de Next
│  ├─ api/<recurso>/route.ts         # Opcional: HTTP boundary
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ loading.tsx                    # Sólo cuando la ruta lo necesita
│  ├─ error.tsx                      # Sólo cuando la ruta lo necesita
│  └─ not-found.tsx                  # Sólo cuando la ruta lo necesita
│
├─ modules/                          # Capacidades de negocio
│  └─ <modulo>/                      # projects/, auth/, billing/, etc.
│     ├─ ui/                         # UI exclusiva del módulo
│     ├─ application/                # Casos de uso/orquestación, si existen
│     ├─ domain/                     # Entidades, contratos y reglas puras, si existen
│     ├─ data/                       # DTOs, mappers o queries propios, si existen
│     ├─ hooks/                      # Hooks de cliente del módulo, si existen
│     ├─ schemas/                    # Validación del módulo, si existe
│     ├─ actions.ts                  # Server Actions, si existen
│     └─ index.ts                    # API pública, sólo si otro módulo la consume
│
├─ shared/                           # Sólo código sin vocabulario de negocio
│  ├─ ui/                            # Componentes de diseño reutilizables
│  ├─ lib/                           # Funciones puras transversales
│  ├─ hooks/                         # Hooks transversales
│  ├─ types/                         # Tipos transversales
│  └─ config/                        # Configuración transversal sin secretos
│
├─ server/                           # Sólo código privado de servidor; créalo al necesitarlo
│  ├─ env.ts                         # Validación de variables de entorno
│  ├─ db/
│  │  ├─ client.ts
│  │  └─ repositories/
│  ├─ auth/
│  └─ integrations/
│     ├─ ai/
│     ├─ payments/
│     └─ <proveedor>/
│
└─ middleware.ts                     # Sólo middleware transversal real

public/
├─ images/<dominio>/                 # Assets URL públicos cuando existan
├─ icons/
└─ fonts/

tests/
├─ integration/                      # Sólo al existir tests de integración
└─ e2e/                              # Sólo al existir tests end-to-end
```

Los directorios mostrados son **permitidos**, no obligatorios. No crees un directorio vacío, un `.gitkeep`, ni una capa preparada “para el futuro”. Créalo al mismo tiempo que su primer archivo real. Si una funcionalidad sólo tiene una pantalla y un formulario, basta con `modules/<modulo>/ui/` y los archivos necesarios.

## 3. Carpetas que no se crean en `src/`

No crees carpetas raíz genéricas como estas:

```text
src/components/
src/services/
src/utils/
src/hooks/
src/types/
src/helpers/
src/common/
src/core/
src/features/                         # Usa modules/
src/infrastructure/                   # Usa server/
src/store/                            # El estado vive en el módulo dueño
```

Tampoco crees `atoms/`, `molecules/` u `organisms/` globales. Si hay un sistema de diseño, sus componentes viven en `shared/ui/`; su composición de negocio vive en `modules/<modulo>/ui/`.

## 4. Regla para decidir dónde vive un archivo

1. ¿Define URL, layout, metadata, loading/error o límite HTTP? → `app/`.
2. ¿Tiene vocabulario o una regla de un dominio de producto? → `modules/<modulo>/`.
3. ¿No conoce ningún dominio y se reutiliza de forma estable? → `shared/`.
4. ¿Accede a base de datos, secreto, SDK privado o proveedor externo? → `server/`.
5. Si no encaja en ninguno, no crees una carpeta nueva: ubícalo junto al código que lo posee y pide una decisión arquitectónica si persiste la ambigüedad.

Una ruta no es un módulo. `app/(dashboard)/projects/page.tsx` compone la pantalla de `modules/projects`; no debe contener casos de uso, consultas ni validaciones de negocio.

## 5. Dependencias permitidas y prohibidas

```text
app       → modules, shared, server (únicamente desde Server Components/handlers)
modules   → mismo módulo, shared, API pública declarada de otro módulo
shared    → shared únicamente
server    → domain de modules y shared; nunca ui de modules
```

- `shared/` no importa desde `modules/`, `app/` o `server/`.
- Un módulo no importa archivos internos de otro módulo. Sólo consume `@/modules/<modulo>` cuando ese módulo expone un `index.ts` deliberado.
- Componentes con `'use client'` no importan `server/`, clientes de base de datos, secretos ni SDKs privados.
- Route handlers y Server Actions son límites de transporte: llaman casos de uso; no concentran reglas de negocio extensas.
- Un contrato de repositorio o proveedor pertenece a `modules/<modulo>/domain/`; su implementación concreta vive en `server/`.

## 6. Convenciones de nombres obligatorias

| Elemento                          | Regla                        | Ejemplo                                                                       |
| --------------------------------- | ---------------------------- | ----------------------------------------------------------------------------- |
| Directorio y archivo              | `kebab-case`                 | `project-form.tsx`, `project-members/`                                        |
| Archivo especial Next             | Nombre literal de Next       | `page.tsx`, `layout.tsx`, `route.ts`                                          |
| Componente, tipo, interfaz, clase | `PascalCase`                 | `ProjectForm`, `ProjectRepository`                                            |
| Función y variable                | `camelCase`                  | `createProject`, `selectedProjectId`                                          |
| Booleano                          | `is`, `has`, `can`, `should` | `isSubmitting`, `canEdit`                                                     |
| Handler / callback prop           | `handle` / `on`              | `handleSubmit`, `onSubmit`                                                    |
| Hook                              | Prefijo `use`                | `useProjectFilters`                                                           |
| Props, input, DTO, esquema        | Sufijo semántico             | `ProjectFormProps`, `CreateProjectInput`, `ProjectDto`, `createProjectSchema` |
| Constante global inmutable        | `UPPER_SNAKE_CASE`           | `MAX_PROJECT_NAME_LENGTH`                                                     |
| Test                              | `<archivo>.test.ts(x)`       | `create-project.test.ts`                                                      |

Usa `camelCase` para un objeto declarado con `const`; `const` no justifica mayúsculas. No crees `types.ts` como contenedor genérico: un tipo se queda junto a su dueño.

## 7. UI y assets

- Un componente de una librería se usa directamente en el módulo si sólo lo necesita ese módulo.
- Sólo se adapta en `shared/ui/` cuando su API, estilo o comportamiento sea transversal y estable.
- Un componente de dominio no pasa a `shared/ui/`: `ProjectStatusBadge` vive en `modules/projects/ui/`.
- Los assets públicos usan `public/images`, `public/icons` o `public/fonts`, con nombres descriptivos en `kebab-case` (`empty-projects.svg`, no `image-1.svg`).
- Usa SVG para iconos/logos y WebP o AVIF optimizado para raster. Usa `next/image` cuando aplique y un `alt` significativo; `alt=""` sólo para imágenes decorativas.
- Nunca guardes secretos, cargas de usuarios, builds ni contenido remoto mutable en `public/`.

## 8. Topología de repositorios

### Aplicación independiente

Esta plantilla es una app autónoma. No crees `apps/` ni `packages/` dentro de ella mientras no exista un monorepo real.

### Monorepo

Sólo con varias apps que compartan código mantenido activamente:

```text
apps/web/                             # Conserva app/, modules/, shared/, server/
apps/admin/
packages/ui/                          # Sólo design system independiente
packages/contracts/                   # Sólo contratos estables compartidos
packages/config/                      # Configuración común
```

### Varios repositorios con orquestador

```text
platform-orchestrator/                # ADRs, contratos, compose local, CI reutilizable
web-app/                              # App autónoma con esta arquitectura
admin-app/                            # App autónoma con esta arquitectura
shared-packages/                      # Paquetes publicados/versionados, si hacen falta
```

El repositorio orquestador no contiene ni construye las fuentes de las apps. Cada app debe poder clonarse, instalarse, probarse y desplegarse sola. El intercambio se hace mediante paquetes publicados versionados (`@organizacion/ui`, `@organizacion/contracts`) o contratos API versionados. Están prohibidos imports `../../otro-repo`, rutas locales de cada desarrollador, copias manuales y submódulos Git como dependencia de producción.

## 9. Checklist antes de finalizar

- ¿Cada archivo está en la carpeta de su dueño y no en una carpeta genérica?
- ¿Se evitó crear directorios vacíos o capas sin código?
- ¿`shared` sigue sin conocer módulos, rutas ni infraestructura?
- ¿Se mantuvieron los secretos y adaptadores privados fuera del cliente?
- ¿Se expusieron sólo APIs públicas intencionales de módulos?
- ¿Se ejecutaron format, lint, typecheck y las pruebas/build relevantes, o se explicó qué impidió hacerlo?

La referencia en `references/conventions.md` contiene ejemplos cortos; este archivo es la fuente de verdad para las decisiones de estructura.
