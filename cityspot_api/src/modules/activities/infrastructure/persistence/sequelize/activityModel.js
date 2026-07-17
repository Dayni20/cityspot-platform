const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../shared/database/postgresql/sequelize");

const ActivityModel = sequelize.define(
  "Activity",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_actividad"
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_propietario"
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_categoria"
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "nombre"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "descripcion"
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "ciudad"
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: "direccion"
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      field: "latitud"
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      field: "longitud"
    },
    referencePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: "precio_referencial"
    },
    schedule: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "horario"
    },
    contactPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "telefono_contacto"
    },
    contactEmail: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "correo_contacto"
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
      field: "fecha_creacion"
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "fecha_actualizacion"
    }
  },
  {
    tableName: "actividades",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
);

module.exports = ActivityModel;
