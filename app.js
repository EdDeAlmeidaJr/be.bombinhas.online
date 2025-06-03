const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();

const app = express();

// Middleware padrão do Express
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Rotas públicas
app.use("/api/auth", require("./routes/auth"));
// Rotas privadas (requerem token)
app.use("/api/camp", require("./routes/campanhas"));
app.use("/api/clie", require("./routes/clientes"));
app.use("/api/cliq", require("./routes/cliques"));
app.use("/api/esta", require("./routes/estatisticas"));
app.use("/api/rede", require("./routes/redes_sociais"));
app.use("/api/vide", require("./routes/videos"));

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ erro: err.message });
});

module.exports = app;
