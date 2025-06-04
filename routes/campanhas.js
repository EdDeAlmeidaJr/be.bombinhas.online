const express = require("express");
const router = express.Router();
const { Campanha } = require("../models");
const { v4: uuidv4 } = require("uuid");

const { authenticateToken } = require("../middlewares/auth");

router.post("/", authenticateToken, async (req, res) => {
  const { cliente_id, nome } = req.body;

  if (!cliente_id || !nome) {
    return res
      .status(400)
      .json({ erro: "cliente_id e nome são obrigatórios." });
  }

  try {
    const novaCampanha = await Campanha.create({
      id: uuidv4(),
      cliente_id,
      nome,
    });

    res
      .status(201)
      .json({ mensagem: "Campanha criada com sucesso.", id: novaCampanha.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar campanha." });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const campanhas = await Campanha.findAll();
    res.json(campanhas);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar campanhas." });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const campanha = await Campanha.findByPk(req.params.id);

    if (!campanha) {
      return res.status(404).json({ erro: "Campanha não encontrada." });
    }

    res.json(campanha);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar campanha." });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { nome } = req.body;

  try {
    const campanha = await Campanha.findByPk(req.params.id);

    if (!campanha) {
      return res.status(404).json({ erro: "Campanha não encontrada." });
    }

    if (nome) campanha.nome = nome;

    await campanha.save();
    res.json({ mensagem: "Campanha atualizada com sucesso." });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar campanha." });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const campanha = await Campanha.findByPk(req.params.id);

    if (!campanha) {
      return res.status(404).json({ erro: "Campanha não encontrada." });
    }

    await campanha.destroy();
    res.json({ mensagem: "Campanha removida com sucesso." });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover campanha." });
  }
});

module.exports = router;
