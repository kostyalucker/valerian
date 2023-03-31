import mongoose from 'mongoose'

const IndicatorsSchema = new mongoose.Schema({
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine'
  },
  ph: String,
  concentration: String,
  conductivity: String,
  bacteriaAmount: String,
  fungi: String,
  reason: String,
  creatorName: String,
}, {
  timestamps: true,
})

export default mongoose.models.Indicators || mongoose.model('Indicators', IndicatorsSchema);