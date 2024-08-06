import express from 'express'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

const mongodb_host = process.env.MONGODB_HOST
const mongodb_user = process.env.MONGODB_USER
const mongodb_password = process.env.MONGODB_PASSWORD
const atlasURI = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}`
const database = new MongoClient(`${atlasURI}/?retryWrites=true`)
const months = database.db('calendar').collection('2024')

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

app.get('/', (req, res) => {
  res.send('Hello Vite + Vue!')
})

app.get('/months', async (req, res) => {
  const data = await months.find({}).toArray()
  console.log('request for /months')
  res.json(data[0].months)
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000...')
})
