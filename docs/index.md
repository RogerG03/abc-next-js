# ABC · Next.js Modular Starter

Plantilla para iniciar productos Next.js donde **cada developer cumple los estándares internos antes de llegar a CI/CD**. Los mismos comandos corren en el editor, en los hooks de Git y en GitHub Actions: CI confirma lo que ya pasó en local, no descubre problemas nuevos.

## Documentación

| Documento                                         | Para qué sirve                                                              |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| [Comparativa antes / después](comparison.html)    | Artifact visual: qué tenía la plantilla y qué incorpora esta mejora.        |
| [Auditoría de la plantilla](audit.md)             | Hallazgos, valoración de cada librería y mejoras aplicadas o pospuestas.    |
| [Flujo shift-left](shift-left.md)                 | Qué se valida en cada etapa, cómo instalarlo y qué configurar en GitHub.    |
| [Usar ABC como plantilla](using-this-template.md) | Crear un repositorio de producto a partir de ABC y sus primeros 15 minutos. |
| [Arquitectura](architecture.md)                   | Límites entre `app`, `modules`, `shared` y `server`.                        |

## Arranque en 3 comandos

```bash
git clone https://github.com/RogerG03/abc-next-js.git && cd abc-next-js
pnpm install   # descarga Node 24.20.0 si hace falta e instala los hooks de Git
pnpm dev
```

Antes de abrir un PR, `pnpm check` debe pasar. El hook `pre-push` lo ejecuta automáticamente.
