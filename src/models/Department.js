import mongoose from 'mongoose'

const DepartmentSchema = new mongoose.Schema({
  departmentNumber: String,
  factory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Factory'
  },
  machines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Machine'}],
}, {
  timestamps: true,
})

export default mongoose.models.Department || mongoose.model('Department', DepartmentSchema);