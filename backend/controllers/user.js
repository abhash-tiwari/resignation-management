import Resignation from '../models/Resignation.js'
import ExitResponse from '../models/ExitResponse.js'
import axios from 'axios'

export const submitResignation = async (req, res) => {
  try {
    const { lwd } = req.body
    const lastWorkingDate = new Date(lwd)

    const dayOfWeek = lastWorkingDate.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(400).json({ message: 'Last working day cannot be weekend' })
    }

    try {
      const year = lastWorkingDate.getFullYear()
      const month = lastWorkingDate.getMonth() + 1
      const day = lastWorkingDate.getDate()
      
      const calendarificUrl = `https://calendarific.com/api/v2/holidays?api_key=${process.env.CALENDARIFIC_API_KEY}&country=IN&year=${year}&month=${month}&day=${day}`
      
      const calendarificResponse = await axios.get(calendarificUrl)
      console.log(calendarificResponse.data)

      if (calendarificResponse.data.response.holidays?.length > 0) {
        return res.status(400).json({ message: 'Last working day cannot be a holiday' })
      }
    } catch (Error) {
      console.error(Error)
    }

    const resignation = new Resignation({
      employeeId: req.user._id,
      lwd: lastWorkingDate
    })
    await resignation.save()

    res.json({
      data: {
        resignation: {
          _id: resignation._id
        }
      }
    })
  } catch (error) {
    console.error('Resignation submission error:', error)
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    })
  }
}

export const submitExitResponses = async (req, res) => {
  try {
    const { responses } = req.body

    const resignation = await Resignation.findOne({
      employeeId: req.user._id,
      status: 'approved'
    })

    if (!resignation) {
      return res.status(400).json({ message: 'No approved resignation found' })
    }

    const exitResponse = new ExitResponse({
      employeeId: req.user._id,
      responses
    })
    await exitResponse.save()

    res.json({ message: 'Exit interview Response submitted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
} 