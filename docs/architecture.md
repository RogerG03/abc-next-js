---
eyebrow: "Referencia · arquitectura"
description: "Límites entre app, modules, shared y server, y cómo escalar a varios repositorios."
---

# Arquitectura de ABC

## Límites

```text
app       → modules, shared, server (sólo desde el servidor)
modules   → código propio, shared y APIs públicas de otros módulos
shared    → shared únicamente
server    → contratos de dominio y shared; nunca UI de módulos
```

`src/app` contiene rutas, layouts y composición. `src/modules` agrupa una capacidad de negocio completa. `src/shared` sólo contiene código reutilizable que no conoce el negocio. La infraestructura privada se incorpora bajo `src/server` cuando realmente exista.

## Varios repositorios

Una plataforma con aplicaciones separadas usa un repositorio orquestador para ADRs, contratos versionados, composición local y CI reutilizable. Cada app sigue siendo clonable, testeable y desplegable de forma independiente. El código compartido se distribuye como paquetes versionados; los APIs se comparten mediante contratos, no rutas relativas entre repositorios.

Las convenciones completas y las instrucciones para agentes están en `.codex/skills/next-modular-architecture/`.

## Configuración de vista

Redux Toolkit y React Redux comparten estado de UI dentro de la vista propietaria. Slice y fábrica viven en el módulo dueño, junto a la UI. Provider cliente con instancia propia y reinicio al cambiar entidad; no singleton entre peticiones. Los formularios pueden conservar borradores locales; DOM y callbacks no entran al store. El backend conserva autoridad sobre permisos y reglas de negocio. Ver la política de estado de interfaz en README y AGENTS.md.

La [guía futura de Permix y permisos persistidos](permix-adaptation.md) propone el encaje por módulos y servidor; la plantilla aún no lo implementa.
