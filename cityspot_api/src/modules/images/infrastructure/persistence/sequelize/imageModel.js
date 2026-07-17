const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../shared/database/postgresql/sequelize");

const ImageModel = sequelize.define(
  "Image",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_imagen"
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_actividad"
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "url_imagen"
    },
    description: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "descripcion"
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "es_principal"
    }
  },
  {
    tableName: "imagenes_actividad",
    timestamps: false
  }
);

module.exports = ImageModel;
