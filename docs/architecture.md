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

