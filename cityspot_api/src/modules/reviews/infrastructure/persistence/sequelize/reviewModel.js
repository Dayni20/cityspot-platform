const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../shared/database/postgresql/sequelize");

const ReviewModel = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_resena"
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "calificacion"
    },
    comment: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: "comentario"
    },
    ownerRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "leida_propietario"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "fecha_creacion"
    }
  },
  {
    tableName: "resenas_actividad",
    timestamps: false
  }
);

module.exports = ReviewModel;
