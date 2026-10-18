## Qué cambia y por qué

<!-- Una o dos frases. Enlaza el issue si existe. -->

## Definition of Done (antes de pedir revisión)

- [ ] `pnpm check` pasa en local (el hook `pre-push` lo ejecuta).
- [ ] Si toca flujos de navegador: `pnpm test:e2e` pasa en local.
- [ ] Los archivos están en la capa dueña (`app`, `modules`, `shared`, `server`) según `AGENTS.md`.
- [ ] Sin secretos, `.env` reales ni datos de clientes en el diff.
- [ ] Documentación actualizada si cambia una convención, script o configuración.
- [ ] Checks omitidos y su motivo:
