import mongoose from 'mongoose'

const IndicatorsSchema = new mongoose.Schema({
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine'
  },
  ph: Number,
  concentration: Number,
  capacity: Number,
  creatorInfo: {
    firstName: String,
    lastName: String,
    patronymic: String,
  }
}, {
  timestamps: true,
})

export default mongoose.models.Indicators || mongoose.model('Indicators', IndicatorsSchema);