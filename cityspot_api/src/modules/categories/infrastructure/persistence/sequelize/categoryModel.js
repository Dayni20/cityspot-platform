const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../shared/database/postgresql/sequelize");

const CategoryModel = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_categoria"
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "nombre"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "descripcion"
    }
  },
  {
    tableName: "categorias",
    timestamps: false
  }
);

module.exports = CategoryModel;
