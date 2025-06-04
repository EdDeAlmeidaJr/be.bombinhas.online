const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Cliente } = require("../models");
const { generateToken } = require("../middlewares/auth");

// Rota de login
router.post("/", async (req, res) => {
  console.log(req.body);
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios" });
  }

  try {
    const cliente = await Cliente.findOne({ where: { email } });

    if (!cliente) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(senha, cliente.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = generateToken({ id: cliente.id, email: cliente.email });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao realizar login" });
  }
});

module.exports = router;
