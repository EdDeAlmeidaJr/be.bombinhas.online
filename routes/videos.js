const express = require("express");
const router = express.Router();
const { Video } = require("../models");
const { v4: uuidv4 } = require("uuid");
const authMiddleware = require("../middlewares/auth");

// Criar novo vídeo
router.post("/", authMiddleware, async (req, res) => {
  const { campanha_id, titulo, url } = req.body;

  if (!campanha_id || !titulo || !url) {
    return res
      .status(400)
      .json({ erro: "camapnha_id, titulo e url são obrigatórios." });
  }

  try {
    const novoVideo = await Video.create({
      id: uuidv4(),
      campanha_id,
      titulo,
      url,
    });

    res
      .status(201)
      .json({ mensagem: "Vídeo criado com sucesso.", id: novoVideo.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar vídeo." });
  }
});

// Listar todos os vídeos
router.get("/", authMiddleware, async (req, res) => {
  try {
    const videos = await Video.findAll();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar vídeos." });
  }
});

// Obter um vídeo específico
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);

    if (!video) {
      return res.status(404).json({ erro: "Vídeo não encontrado." });
    }

    res.json(video);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar vídeo." });
  }
});

// Atualizar um vídeo
router.put("/:id", authMiddleware, async (req, res) => {
  const { titulo, url } = req.body;

  try {
    const video = await Video.findByPk(req.params.id);

    if (!video) {
      return res.status(404).json({ erro: "Vídeo não encontrado." });
    }

    if (titulo) video.titulo = titulo;
    if (url) video.url = url;

    await video.save();
    res.json({ mensagem: "Vídeo atualizado com sucesso." });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar vídeo." });
  }
});

// Deletar um vídeo
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);

    if (!video) {
      return res.status(404).json({ erro: "Vídeo não encontrado." });
    }

    await video.destroy();
    res.json({ mensagem: "Vídeo removido com sucesso." });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover vídeo." });
  }
});

module.exports = router;
