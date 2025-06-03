// models/clique.js
"use strict";
module.exports = (sequelize, DataTypes) => {
  const Clique = sequelize.define(
    "Clique",
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        allowNull: false,
      },
      video_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      rede_social: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      ip: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      criado_em: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "cliques",
      timestamps: false,
    },
  );

  Clique.associate = function (models) {
    Clique.belongsTo(models.Video, {
      foreignKey: "video_id",
      as: "video",
    });
  };

  return Clique;
};
