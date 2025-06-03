const jwt = require("jsonwebtoken");

// Chave secreta do JWT (em produção, isso deve vir de variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, cliente) => {
    if (err) {
      return res.status(403).json({ erro: "Token inválido ou expirado." });
    }

    req.cliente = cliente; // cliente_id e outros dados vêm do payload do JWT
    next();
  });
}

module.exports = autenticarToken;
