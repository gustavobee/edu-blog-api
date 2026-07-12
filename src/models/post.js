const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define(
  'Post',
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('rascunho', 'publicado', 'arquivado'),
        defaultValue: 'rascunho',
        allowNull: false,
    },
    subject: {
        type: DataTypes.ENUM('matematica', 'ciencias', 'filosofia', 'geografia', 'portugues', 'historia'),
        allowNull: false,
    },
    contentType: {
        type: DataTypes.ENUM('aviso', 'aula_teorica', 'tarefa', 'material_complementar'),
        allowNull: false,
    },
  },
  {
    tableName: 'posts',
    timestamps: true,
    underscored: true,
  },
);

console.log(Post === sequelize.models.Post);

module.exports = Post;