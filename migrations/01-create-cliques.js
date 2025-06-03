// migrations/04-create-cliques.js
("use strict");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("cliques", {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false,
      },
      video_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: "videos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      rede_social: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      ip: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      criado_em: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("cliques");
  },
};
