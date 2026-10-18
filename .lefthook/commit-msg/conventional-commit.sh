#!/bin/sh
pattern='^((build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-z0-9-]+\))?!?: .{1,72}|Merge .+|Revert .+)$'

if ! head -n1 "$1" | grep -qE "$pattern"; then
  echo "El mensaje no sigue Conventional Commits. Formato: tipo(alcance): resumen, 72 caracteres o menos."
  echo "Ejemplo: feat(projects): permitir archivar proyectos"
  exit 1
fi
