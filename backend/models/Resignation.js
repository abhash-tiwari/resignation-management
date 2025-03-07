import mongoose from 'mongoose'

const resignSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lwd: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  exitDate: {
    type: Date
  }
}, { timestamps: true })

export default mongoose.model('Resignation', resignSchema) 