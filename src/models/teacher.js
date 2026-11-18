const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teacher = sequelize.define(
  'Teacher',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Geral',
    },
    registration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'teachers',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Teacher;
