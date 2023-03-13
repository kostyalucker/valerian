import mongoose from 'mongoose'

const FactorySchema = new mongoose.Schema({
  name: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  departments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department'}],
}, {
  timestamps: true,
})

export default mongoose.models.Factory || mongoose.model('Factory', FactorySchema);