import mongoose from 'mongoose'

const MachineOperationSchema = new mongoose.Schema({
  name: String,
  machineType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MachineType'
  },
  standards: {
    ph: {
      min: String,
      max: String,
    },
    bacteriaAmount: {
      min: String,
      max: String,
    },
    fungi: {
      min: String,
      max: String,
    },
    conductivity: {
      min: String,
      max: String,
    },
    concentration: {
      min: String,
      max: String,
    }
  },
}, {
  timestamps: true,
})

export default mongoose.models.MachineOperation || mongoose.model('MachineOperation', MachineOperationSchema);