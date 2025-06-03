const express = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const db = require("../models");

const router = express.Router();

// Cadastrar novo cliente
router.post("/clientes", async (req, res) => {
  const { nome, email, empresa, senha } = req.body;

  if (!nome || !email || !empresa || !senha) {
    return res
      .status(400)
      .json({ erro: "Campos obrigatórios: nome, email, empresa, senha." });
  }

  try {
    const existente = await db.Cliente.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ erro: "Email já cadastrado." });
    }

    const senha_hash = await bcrypt.hash(senha, 10);
    const novoCliente = await db.Cliente.create({
      id: uuidv4(),
      nome,
      email,
      empresa,
      senha_hash,
    });

    return res.status(201).json({ sucesso: true, id: novoCliente.id });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro ao cadastrar cliente." });
  }
});

// GET /api/cliques?cliente_id=...&campanha_id=...&video_id=...&rede_social=...
router.get("/cliques", async (req, res) => {
  try {
    const { cliente_id, campanha_id, video_id, rede_social } = req.query;

    // Validação básica
    if (!cliente_id || !campanha_id || !video_id || !rede_social) {
      return res
        .status(400)
        .json({ erro: "Parâmetros obrigatórios ausentes." });
    }

    // Busca o vídeo para pegar a URL de destino
    const video = await Video.findOne({
      where: {
        id: video_id,
        cliente_id,
        campanha_id,
      },
    });

    if (!video) {
      return res.status(404).json({ erro: "Vídeo não encontrado." });
    }

    // Pega IP e localização aproximada
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip) || {};

    // Registra o clique
    await Clique.create({
      id: uuidv4(),
      cliente_id,
      campanha_id,
      video_id,
      rede_social,
      ip,
      cidade: geo.city || null,
      estado: geo.region || null,
      pais: geo.country || null,
    });

    // Redireciona para a URL do vídeo
    return res.redirect(video.url_destino);
  } catch (err) {
    console.error("Erro ao processar clique:", err);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
});

module.exports = router;
