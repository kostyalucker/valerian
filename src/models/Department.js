import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
  {
    departmentNumber: String,
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
