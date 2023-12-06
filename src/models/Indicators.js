import mongoose from "mongoose";

const IndicatorsSchema = new mongoose.Schema(
  {
    machine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
    },
    ph: String,
    concentration: String,
    conductivity: String,
    bacteriaAmount: String,
    fungi: String,
    fungicide: String,
    smell: String,
    reason: String,
    presenceImpurities: String,
    antiFoamAdditive: String,
    batchNumberDate: String,
    notesRecommendations: String,
    creatorName: String,
    addedOilAmount: String,
    foreignOil: String,
    biocide: String,
    serviceAdditives: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Indicators ||
  mongoose.model("Indicators", IndicatorsSchema);
