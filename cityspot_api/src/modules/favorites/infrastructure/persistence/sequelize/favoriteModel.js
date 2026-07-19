const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../shared/database/postgresql/sequelize");

const FavoriteModel = sequelize.define(
  "Favorite",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_favorito"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_usuario"
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_actividad"
    },
    savedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "fecha_guardado"
    }
  },
  {
    tableName: "favoritos",
    timestamps: false
  }
);

module.exports = FavoriteModel;
