import mongoose from 'mongoose'

const MachineTypeSchema = new mongoose.Schema({
  name: String,
  operations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MachineOperation'}],
}, {
  timestamps: true,
})

export default mongoose.models.MachineType || mongoose.model('MachineType', MachineTypeSchema);