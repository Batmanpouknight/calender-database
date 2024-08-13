import express from 'express'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import crypto from 'crypto'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import bcrypt from 'bcrypt'
dotenv.config()

const app = express()

const mongodb_host = process.env.MONGODB_HOST
const mongodb_user = process.env.MONGODB_USER
const mongodb_password = process.env.MONGODB_PASSWORD
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET
const atlasURI = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}`

const node_session_secret = process.env.NODE_SESSION_SECRET

const database = new MongoClient(`${atlasURI}/?retryWrites=true`)
const months = database.db('calender').collection('2024')

const monthString = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

var mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
  crypto: {
    secret: mongodb_session_secret,
  },
})

app.use(
  session({
    secret: node_session_secret,
    store: mongoStore,
    saveUninitialized: false,
    resave: true,
  })
)

// Middleware to parse JSON bodies
app.use(express.json())

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }))
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})
app.set('view engine', 'ejs')

function generateRandomId() {
  return crypto.randomBytes(16).toString('hex') // Generates a 32-character random ID
}

app.get('/', (req, res) => {
  res.send('This is the calender api')
})

app.get('/months', async (req, res) => {
  const data = await months.find().sort({ _id: 1 }).toArray()
  res.json(data)
})

app.post('/api/addevent', async (req, res) => {
  const { name, description, country, month, dayIndex } = req.body
  const id = generateRandomId()
  console.log('request for /api/addEvent', name, description, country, month, dayIndex)
  let mongoResult

  switch (dayIndex) {
    case 0:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.0.events': { id, name, description, country } } })
      break
    case 1:
      console.log('we in here', month)
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.1.events': { id, name, description, country } } })
      break
    case 2:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.2.events': { id, name, description, country } } })
      break
    case 3:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.3.events': { id, name, description, country } } })
      break
    case 4:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.4.events': { id, name, description, country } } })
      break
    case 5:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.5.events': { id, name, description, country } } })
      break
    case 6:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.6.events': { id, name, description, country } } })
      break
    case 7:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.7.events': { id, name, description, country } } })
      break
    case 8:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.8.events': { id, name, description, country } } })
      break
    case 9:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.9.events': { id, name, description, country } } })
      break
    case 10:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.10.events': { id, name, description, country } } })
      break
    case 11:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.11.events': { id, name, description, country } } })
      break
    case 12:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.12.events': { id, name, description, country } } })
      break
    case 13:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.13.events': { id, name, description, country } } })
      break
    case 14:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.14.events': { id, name, description, country } } })
      break
    case 15:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.15.events': { id, name, description, country } } })
      break
    case 16:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.16.events': { id, name, description, country } } })
      break
    case 17:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.17.events': { id, name, description, country } } })
      break
    case 18:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.18.events': { id, name, description, country } } })
      break
    case 19:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.19.events': { id, name, description, country } } })
      break
    case 20:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.20.events': { id, name, description, country } } })
      break
    case 21:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.21.events': { id, name, description, country } } })
      break
    case 22:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.22.events': { id, name, description, country } } })
      break
    case 23:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.23.events': { id, name, description, country } } })
      break
    case 24:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.24.events': { id, name, description, country } } })
      break
    case 25:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.25.events': { id, name, description, country } } })
      break
    case 26:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.26.events': { id, name, description, country } } })
      break
    case 27:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.27.events': { id, name, description, country } } })
      break
    case 28:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.28.events': { id, name, description, country } } })
      break
    case 29:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.29.events': { id, name, description, country } } })
      break
    case 30:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.30.events': { id, name, description, country } } })
      break
    case 31:
      mongoResult = await months.updateOne({ name: monthString[month] }, { $push: { 'dates.31.events': { id, name, description, country } } })
      break
  }

  console.log(mongoResult)
  res.status(200)
  res.send(id)
})

app.get('/authenticate', async (req, res) => {
  res.render('login')
})

app.post('/authenticate', async (req, res) => {
  const { email, password } = req.body
  console.log('request for /authenticate', email, password)

  const user = await database.db('calender').collection('users').findOne({ email })
  console.log(user)
  if (!user) {
    res.status(401)
    res.redirect('/authenticate')
    return
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    res.status(401)
    res.redirect('/authenticate')
    return
  }

  req.session.authenticated = true
  req.session.user = user

  res.redirect('/users')
})

app.get('/users', async (req, res) => {
  if (!req.session.authenticated || req.session.user.type !== 'admin') {
    res.redirect('/authenticate')
    return
  }

  const data = await database.db('calender').collection('users').find().toArray()
  res.render('users', { users: data })
})

app.post('/logout', async (req, res) => {
  req.session.destroy()
  res.redirect('/authenticate')
})

app.post('/users/promote', async (req, res) => {
  const { email } = req.body
  const user = await database.db('calender').collection('users').findOne({ email })
  console.log(user)
  if (!user) {
    res.status(400)
    res.send({ error: 'User not found' })
    return
  }
  const result = await database
    .db('calender')
    .collection('users')
    .updateOne({ email }, { $set: { type: 'admin' } })
  res.status(200)
  res.send({ success: true, result })
})

app.post('/users/demote', async (req, res) => {
  const { email } = req.body

  const user = await database.db('calender').collection('users').findOne({ email })
  if (!user) {
    res.status(400)
    res.send({ error: 'User not found' })
    return
  }
  const result = await database
    .db('calender')
    .collection('users')
    .updateOne({ email }, { $set: { type: 'user' } })

  res.status(200)
  res.send({ success: true, result })
})

app.post('/users/signup', async (req, res) => {
  const { email, username, password, type } = req.body
  console.log('request for /users/signup', email, username, password, type)

  const emailExists = await database.db('calender').collection('users').findOne({ email })
  const usernameExists = await database.db('calender').collection('users').findOne({ username })
  if (emailExists) {
    res.send({
      result: false,
      error: { code: 409, message: 'Email already exists', location: 'email' },
    })
    return
  } else if (usernameExists) {
    res.send({
      result: false,
      error: { code: 409, message: 'Username already exists', location: 'username' },
    })
    return
  }

  const user = await database.db('calender').collection('users').insertOne({ email, username, password, type })
  const id = user.insertedId

  res.status(200)
  res.send({ result: { id }, error: false })
})

app.post('/users/login', async (req, res) => {
  const { email } = req.body
  console.log('request for /users/login', email)

  //TODO: add a way that it searches for the email or username
  const user = await database.db('calender').collection('users').findOne({ email })
  console.log(user)

  if (!user) {
    res.send({
      result: false,
      error: { code: 401, message: 'Invalid email', location: 'email' },
    })
    return
  }
  res.status(200)
  res.send({
    result: {
      id: user._id.toHexString(),
      username: user.username,
      email: user.email,
      password: user.password,
    },
    error: false,
  })
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000...')
})
