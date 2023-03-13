import mongoose from 'mongoose'

const MachineSchema = new mongoose.Schema({
  machineNumber: String,
  model: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  indicators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Indicator'}],
}, {
  timestamps: true,
})

export default mongoose.models.Machine || mongoose.model('Machine', MachineSchema);