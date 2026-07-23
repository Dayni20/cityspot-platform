const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../shared/database/postgresql/sequelize");

const InquiryModel = sequelize.define(
  "Inquiry",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_consulta"
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_actividad"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_usuario"
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_propietario"
    },
    question: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: "pregunta"
    },
    answer: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "respuesta"
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "PENDIENTE",
      field: "estado"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "fecha_creacion"
    },
    answeredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "fecha_respuesta"
    },
    responseRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "respuesta_leida"
    }
  },
  {
    tableName: "consultas_actividad",
    timestamps: false
  }
);

module.exports = InquiryModel;
