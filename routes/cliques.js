const express = require("express");
const router = express.Router();
const { Clique } = require("../models");
const { v4: uuidv4 } = require("uuid");

const authMiddleware = require("../middlewares/auth");

// Criar novo clique (geralmente feito automaticamente pelo endpoint público)
router.post("/", async (req, res) => {
  const { cliente_id, campanha_id, video_id, rede_social, ip } = req.body;

  if (!cliente_id || !campanha_id || !video_id || !rede_social || !ip) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
  }

  try {
    const novoClique = await Clique.create({
      id: uuidv4(),
      cliente_id,
      campanha_id,
      video_id,
      rede_social,
      ip,
    });

    res
      .status(201)
      .json({ mensagem: "Clique registrado com sucesso.", id: novoClique.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao registrar clique." });
  }
});

// Listar todos os cliques (privado, requer token)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cliques = await Clique.findAll();
    res.json(cliques);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar cliques." });
  }
});

// Buscar um clique específico (privado, requer token)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const clique = await Clique.findByPk(req.params.id);

    if (!clique) {
      return res.status(404).json({ erro: "Clique não encontrado." });
    }

    res.json(clique);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar clique." });
  }
});

module.exports = router;
