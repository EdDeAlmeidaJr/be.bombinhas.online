const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "minha_chave_secreta";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensagem: "Token malformado" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ mensagem: "Token inválido" });
    }

    req.usuario = decoded;
    next();
  });
}

// Função adicionada para gerar token JWT
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

module.exports = {
  authenticateToken,
  generateToken,
};
