const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Cliente } = require("../models");
const { v4: uuidv4 } = require("uuid");

const { authenticateToken } = require("../middlewares/auth");

// Criar cliente (sem autenticação)
router.post("/", async (req, res) => {
  const { nome, email, empresa, senha } = req.body;

  if (!nome || !email || !empresa || !senha) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
  }

  try {
    const existente = await Cliente.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ erro: "Email já cadastrado." });
    }

    const senha_hash = await bcrypt.hash(senha, 10);
    const novoCliente = await Cliente.create({
      id: uuidv4(),
      nome,
      email,
      empresa,
      senha_hash,
    });

    res.status(201).json({
      mensagem: "Cliente cadastrado com sucesso.",
      id: novoCliente.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao cadastrar cliente." });
  }
});

// Listar todos os clientes (protegido)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      attributes: { exclude: ["senha_hash"] },
    });
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar clientes." });
  }
});

// Obter um cliente específico (protegido)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      attributes: { exclude: ["senha_hash"] },
    });

    if (!cliente)
      return res.status(404).json({ erro: "Cliente não encontrado." });

    res.json(cliente);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar cliente." });
  }
});

// Atualizar um cliente (protegido)
router.put("/:id", authenticateToken, async (req, res) => {
  const { nome, email, empresa, senha } = req.body;

  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente)
      return res.status(404).json({ erro: "Cliente não encontrado." });

    cliente.nome = nome || cliente.nome;
    cliente.email = email || cliente.email;
    cliente.empresa = empresa || cliente.empresa;

    if (senha) {
      cliente.senha_hash = await bcrypt.hash(senha, 10);
    }

    await cliente.save();
    res.json({ mensagem: "Cliente atualizado com sucesso." });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar cliente." });
  }
});

// Deletar um cliente (protegido)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente)
      return res.status(404).json({ erro: "Cliente não encontrado." });

    await cliente.destroy();
    res.json({ mensagem: "Cliente removido com sucesso." });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover cliente." });
  }
});

module.exports = router;
