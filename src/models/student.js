const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define(
  'Student',
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
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Ensino Médio',
    },
    registration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'students',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Student;
