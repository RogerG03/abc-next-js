#!/bin/sh
# ponytail: gitleaks es un binario externo; si falta, el hook avisa y CI lo exige igualmente.
if command -v gitleaks >/dev/null 2>&1; then
  exec gitleaks git --staged --redact --no-banner
fi

echo "gitleaks no está instalado: el escaneo de secretos se hará en CI."
echo "Instálalo para detectarlo antes: https://github.com/gitleaks/gitleaks#installing"
