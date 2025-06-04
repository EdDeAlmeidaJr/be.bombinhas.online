#!/bin/bash

API_URL="http://localhost:3000/api/auth/"

# Cores e ícones
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'
OK="✔"
FAIL="✖"

# Função de teste
testar() {
  descricao="$1"
  esperado="$2"
  shift 2

  echo ""
  echo "🧪 $descricao"

  status=$(curl -s -o /dev/null -w "%{http_code}" "$@")

  if [ "$status" = "$esperado" ]; then
    echo -e "${GREEN}${OK} Passou [HTTP $status]${NC}"
  else
    echo -e "${RED}${FAIL} Falhou [Esperado $esperado, Recebido $status]${NC}"
  fi
}

# Testes
testar "Login com credenciais válidas" 200 \
  -X POST "$API_URL" -H "Content-Type: application/json" \
  -d '{"email":"usuario@email.com","senha":"senha123"}'

testar "Login com senha incorreta" 401 \
  -X POST "$API_URL" -H "Content-Type: application/json" \
  -d '{"email":"usuario@email.com","senha":"senha_errada"}'

testar "Login com email inexistente" 401 \
  -X POST "$API_URL" -H "Content-Type: application/json" \
  -d '{"email":"naoexiste@email.com","senha":"senha123"}'

testar "Login sem corpo na requisição" 400 \
  -X POST "$API_URL"

testar "Login sem campo de email" 400 \
  -X POST "$API_URL" -H "Content-Type: application/json" \
  -d '{"senha":"senha123"}'

testar "Login sem campo de senha" 400 \
  -X POST "$API_URL" -H "Content-Type: application/json" \
  -d '{"email":"usuario@email.com"}'

testar "Login com email e senha em branco" 400 \
  -X POST "$API_URL" -H "Content-Type: application/json" \
  -d '{"email":"","senha":""}'

testar "Login com JSON malformado" 400 \
  -X POST "$API_URL" -H "Content-Type: application/json" \
  -d '{"email":"falta aspas, "senha":"bug"}'
