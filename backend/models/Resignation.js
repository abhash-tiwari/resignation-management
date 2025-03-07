import mongoose from 'mongoose'

const resignationSchema = new mongoose.Schema({
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

export default mongoose.model('Resignation', resignationSchema) 