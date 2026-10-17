# Reglas para agentes

Antes de crear, mover o reorganizar código, lee `.codex/skills/next-modular-architecture/SKILL.md` y la referencia que enlaza.

- Respeta primero las convenciones existentes del repositorio.
- Mantén las rutas de Next en `src/app`, el producto en `src/modules` y el código transversal en `src/shared`.
- No crees carpetas genéricas como `src/components`, `src/services`, `src/utils`, `src/features` o `src/store`; la skill indica los únicos destinos permitidos y cuándo crearlos.
- No crees directorios vacíos ni capas “para el futuro”. Un directorio aparece junto con el primer archivo real que necesita esa responsabilidad.
- No importes desde `src/server` en componentes cliente ni hagas imports internos de otro módulo.
- No hagas refactors masivos sólo para uniformar nombres.
- Ejecuta los chequeos relevantes antes de finalizar un cambio y comunica los que no hayan podido ejecutarse.

