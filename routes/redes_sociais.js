const express = require("express");
const router = express.Router();
const { RedesSociais } = require("../models");
const { authMiddleware } = require("../middlewares/auth");

// Criar uma nova rede social
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ erro: "Nome é obrigatório." });

    const novaRede = await RedesSociais.create({ nome });
    res.status(201).json(novaRede);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao criar rede social.", detalhes: err.message });
  }
});

// Listar todas as redes sociais
router.get("/", authMiddleware, async (req, res) => {
  try {
    const redes = await RedesSociais.findAll();
    res.json(redes);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar redes sociais.", detalhes: err.message });
  }
});

// Buscar uma rede social por ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const rede = await RedesSociais.findByPk(req.params.id);
    if (!rede)
      return res.status(404).json({ erro: "Rede social não encontrada." });

    res.json(rede);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar rede social.", detalhes: err.message });
  }
});

// Atualizar uma rede social
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { nome } = req.body;
    const rede = await RedesSociais.findByPk(req.params.id);
    if (!rede)
      return res.status(404).json({ erro: "Rede social não encontrada." });

    rede.nome = nome || rede.nome;
    await rede.save();
    res.json(rede);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao atualizar rede social.", detalhes: err.message });
  }
});

// Deletar uma rede social
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const rede = await RedesSociais.findByPk(req.params.id);
    if (!rede)
      return res.status(404).json({ erro: "Rede social não encontrada." });

    await rede.destroy();
    res.json({ mensagem: "Rede social removida com sucesso." });
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao deletar rede social.", detalhes: err.message });
  }
});

module.exports = router;
