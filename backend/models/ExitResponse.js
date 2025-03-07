import mongoose from 'mongoose'

const exitResponseSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responses: [{
    questionText: String,
    response: String
  }]
}, { timestamps: true })

export default mongoose.model('ExitResponse', exitResponseSchema) 