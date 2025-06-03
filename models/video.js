"use strict";
module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define(
    "Video",
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        allowNull: false,
      },
      campanha_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url_destino: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      criado_em: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "videos",
      timestamps: false,
    },
  );

  Video.associate = function (models) {
    Video.belongsTo(models.Campanha, {
      foreignKey: "campanha_id",
      as: "campanha",
    });

    Video.hasMany(models.RegistroClique, {
      foreignKey: "video_id",
      as: "cliques",
    });
  };

  return Video;
};
