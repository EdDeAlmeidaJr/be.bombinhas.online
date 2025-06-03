"use strict";
module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define(
    "Cliente",
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      empresa: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      senha_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      criado_em: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "clientes",
      timestamps: false,
    },
  );

  Cliente.associate = function (models) {
    Cliente.hasMany(models.Campanha, {
      foreignKey: "cliente_id",
      as: "campanhas",
    });
  };

  return Cliente;
};
