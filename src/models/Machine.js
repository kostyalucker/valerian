import mongoose from "mongoose";

const MachineSchema = new mongoose.Schema(
  {
    machineNumber: String,
    model: String,
    type: String,
    machineCapacity: String,
    nameOil: String,
    coefficientRefraction: String,
    emulsionFillingDate: String,
    phMin: String,
    phMax: String,
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Machine ||
  mongoose.model("Machine", MachineSchema);
