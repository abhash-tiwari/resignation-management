import Resignation from '../models/Resignation.js'
import ExitResponse from '../models/ExitResponse.js'
import nodemailer from 'nodemailer'

export const getResignations = async (req, res) => {
  try {
    const resignations = await Resignation.find()
      .populate('employeeId', 'username')
      .sort('-createdAt')

    res.json({
      data: resignations.map(r => ({
        _id: r._id,
        employeeId: r.employeeId._id,
        employeeName: r.employeeId.username,
        lwd: r.lwd,
        status: r.status
      }))
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const concludeResignation = async (req, res) => {
  try {
    const { resignationId, approved, lwd } = req.body

    const resignation = await Resignation.findById(resignationId)
      .populate('employeeId', 'username')

    if (!resignation) {
      return res.status(404).json({ message: 'Resignation not found' })
    }

    resignation.status = approved ? 'approved' : 'rejected'
    if (approved) {
      resignation.exitDate = new Date(lwd)
    }
    await resignation.save()

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      })

      await transporter.sendMail({
        from: `"Resignation System" <${process.env.EMAIL_USER}>`,
        to: resignation.employeeId.username,
        subject: `Resignation Request ${approved ? 'Approved' : 'Rejected'}`,
        html: `
          <h2>Resignation Update</h2>
          <p>Your resignation request has been <strong>${approved ? 'approved' : 'rejected'}</strong>.</p>
          ${approved ? `<p>Your exit date is set to: <strong>${new Date(lwd).toLocaleDateString()}</strong></p>` : ''}
          <p>Thank you for your service.</p>
        `
      })
      
      console.log('Email sent successfully')
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
    }

    res.json({ message: 'Resignation request updated successfully' })
  } catch (error) {
    console.error('Resignation update error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getExitResponses = async (req, res) => {
  try {
    const responses = await ExitResponse.find()
      .populate('employeeId', 'username')
      .sort('-createdAt')

    res.json({
      data: responses.map(r => ({
        employeeId: r.employeeId._id,
        employeeName: r.employeeId.username,
        responses: r.responses
      }))
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
} 