import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
  {
    name: String,
    contactName: String,
    contactPhone: String,
    contactEmail: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Department ||
  mongoose.model("Department", DepartmentSchema);
