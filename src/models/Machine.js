import mongoose from "mongoose";

const MachineSchema = new mongoose.Schema(
  {
    machineNumber: String,
    model: String,
    machineCapacity: String,
    emulsionFillingDate: String,
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
