const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../shared/database/postgresql/sequelize");

const UserModel = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_usuario"
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "nombre"
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      field: "correo"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "contrasena"
    },
    role: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "tipo_usuario"
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "telefono"
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "ACTIVO",
      field: "estado"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "fecha_registro"
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "fecha_actualizacion"
    }
  },
  {
    tableName: "usuarios",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
);

module.exports = UserModel;
