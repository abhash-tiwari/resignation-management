import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

const employees = [
  {
    username: 'john.cena',
    password: 'password123',
    role: 'employee'
  },
  {
    username: 'randy.orton',
    password: 'password123',
    role: 'employee'
  },
  {
    username: 'roman.reigns',
    password: 'password123',
    role: 'employee'
  },
  {
    username: 'cm.punk',
    password: 'password123',
    role: 'employee'
  },
  {
    username: 'aj.styles',
    password: 'password123',
    role: 'employee'
  }
]

const seedEmployees = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    await User.deleteMany({ role: 'employee' })
    console.log('Cleared existing employees')

    for (const employee of employees) {
      const user = new User(employee)
      await user.save()
      console.log(`Created employee: ${employee.username}`)
    }

    console.log('Seeding completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seedEmployees() 