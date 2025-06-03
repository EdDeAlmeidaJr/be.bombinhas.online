"use strict";
module.exports = (sequelize, DataTypes) => {
  const Campanha = sequelize.define(
    "Campanha",
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        allowNull: false,
      },
      cliente_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      criado_em: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "campanhas",
      timestamps: false,
    },
  );

  Campanha.associate = function (models) {
    Campanha.belongsTo(models.Cliente, {
      foreignKey: "cliente_id",
      as: "cliente",
    });

    Campanha.hasMany(models.Video, {
      foreignKey: "campanha_id",
      as: "videos",
    });
  };

  return Campanha;
};
