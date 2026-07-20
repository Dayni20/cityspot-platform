const { mongoose } = require("../../../../../shared/database/mongodb/mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      index: true,
      alias: "usuarioId"
    },
    city: {
      type: String,
      default: null,
      alias: "ciudad"
    },
    company: {
      type: String,
      default: null,
      alias: "compania"
    },
    budget: {
      type: Number,
      default: null,
      alias: "presupuesto"
    },
    activityType: {
      type: String,
      default: null,
      alias: "tipoActividad"
    },
    searchedAt: {
      type: Date,
      default: Date.now,
      alias: "fechaBusqueda"
    }
  },
  {
    collection: "historial_busquedas",
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model("SearchHistory", searchHistorySchema);
