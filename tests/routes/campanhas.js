#!/bin/bash

URL_BASE="http://localhost:3000/api/camp"
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # Sem cor

function testar() {
  local descricao="$1"
  local esperado="$2"
  local metodo="$3"
  local rota="$4"
  local dados="$5"

  echo -e "\n🧪 $descricao"
  if [ "$metodo" = "GET" ]; then
    status=$(curl -s -o /dev/null -w "%{http_code}" "$URL_BASE$rota")
  else
    status=$(curl -s -o /dev/null -w "%{http_code}" -X $metodo "$URL_BASE$rota" \
      -H "Content-Type: application/json" \
      -d "$dados")
  fi

  if [ "$status" -eq "$esperado" ]; then
    echo -e "${GREEN}✔ Passou [Esperado $esperado, Recebido $status]${NC}"
  else
    echo -e "${RED}✖ Falhou [Esperado $esperado, Recebido $status]${NC}"
  fi
}

# =====================
# TESTES
# =====================

# 1. GET em rota de listagem de campanhas (deve retornar 200 mesmo se vazio)
testar "Listar todas campanhas" 200 GET "/"

# 2. POST com dados válidos
testar "Criar campanha válida" 201 POST "/" '{
  "nome": "Campanha de Teste",
  "clienteId": 1
}'

# 3. POST sem nome
testar "Criar campanha sem nome" 400 POST "/" '{
  "clienteId": 1
}'

# 4. POST sem clienteId
testar "Criar campanha sem clienteId" 400 POST "/" '{
  "nome": "Teste"
}'

# 5. GET com ID inexistente
testar "Buscar campanha inexistente" 404 GET "/999999"

# 6. GET com ID existente (vamos assumir que a campanha com ID 1 existe após o POST acima)
testar "Buscar campanha existente (ID 1)" 200 GET "/1"

# 7. PUT para atualizar campanha válida
testar "Atualizar campanha válida" 200 PUT "/1" '{
  "nome": "Campanha Atualizada",
  "clienteId": 1
}'

# 8. PUT com dados inválidos
testar "Atualizar campanha sem nome" 400 PUT "/1" '{
  "clienteId": 1
}'

# 9. DELETE com ID existente
testar "Remover campanha existente" 204 DELETE "/1"

# 10. DELETE com ID inexistente
testar "Remover campanha inexistente" 404 DELETE "/999999"
