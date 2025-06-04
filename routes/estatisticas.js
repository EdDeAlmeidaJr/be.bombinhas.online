const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Clique, Video, Campanha, Cliente } = require("../models");

const { authenticateToken } = require("../middlewares/auth");

router.get("/cliques-por-video", authenticateToken, async (req, res) => {
  try {
    const resultados = await Clique.findAll({
      attributes: [
        "videoId",
        [
          Clique.sequelize.fn("COUNT", Clique.sequelize.col("id")),
          "totalCliques",
        ],
      ],
      group: ["videoId"],
      include: [{ model: Video, attributes: ["titulo"] }],
    });

    res.json(resultados);
  } catch (err) {
    res.status(500).json({
      erro: "Erro ao buscar estatísticas por vídeo",
      detalhes: err.message,
    });
  }
});

// Número de cliques por campanha
router.get("/cliques-por-campanha", authenticateToken, async (req, res) => {
  try {
    const resultados = await Clique.findAll({
      attributes: [
        "campanhaId",
        [
          Clique.sequelize.fn("COUNT", Clique.sequelize.col("id")),
          "totalCliques",
        ],
      ],
      group: ["campanhaId"],
      include: [{ model: Campanha, attributes: ["nome"] }],
    });

    res.json(resultados);
  } catch (err) {
    res.status(500).json({
      erro: "Erro ao buscar estatísticas por campanha",
      detalhes: err.message,
    });
  }
});

// Número de cliques por rede social
router.get("/cliques-por-rede", authenticateToken, async (req, res) => {
  try {
    const resultados = await Clique.findAll({
      attributes: [
        "redeSocialId",
        [
          Clique.sequelize.fn("COUNT", Clique.sequelize.col("id")),
          "totalCliques",
        ],
      ],
      group: ["redeSocialId"],
    });

    res.json(resultados);
  } catch (err) {
    res.status(500).json({
      erro: "Erro ao buscar estatísticas por rede social",
      detalhes: err.message,
    });
  }
});

// Número de cliques por cliente
router.get("/cliques-por-cliente", authenticateToken, async (req, res) => {
  try {
    const resultados = await Clique.findAll({
      attributes: [
        "clienteId",
        [
          Clique.sequelize.fn("COUNT", Clique.sequelize.col("id")),
          "totalCliques",
        ],
      ],
      group: ["clienteId"],
      include: [{ model: Cliente, attributes: ["nome", "empresa"] }],
    });

    res.json(resultados);
  } catch (err) {
    res.status(500).json({
      erro: "Erro ao buscar estatísticas por cliente",
      detalhes: err.message,
    });
  }
});

module.exports = router;
