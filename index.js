import express from 'express'
import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userEmails } from './users.js'
import { newMonths } from './2025.js'
dotenv.config()

const app = express()

const mongodb_host = process.env.MONGODB_HOST
const mongodb_user = process.env.MONGODB_USER
const mongodb_password = process.env.MONGODB_PASSWORD
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET
const atlasURI = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}`

const node_session_secret = process.env.NODE_SESSION_SECRET

const jwt_secret = process.env.JWT_SECRET

const database = new MongoClient(`${atlasURI}/?retryWrites=true`)
const months = database.db('calender').collection('2025')
const events = database.db('calender').collection('events')

const monthString = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

var mongoStore = MongoStore.create({
  mongoUrl: `${atlasURI}/sessions`,
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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send('This is the calender api')
})

app.get('/months', async (req, res) => {
  const data = await months.find().sort({ _id: 1 }).toArray()
  res.json(data)
})

app.get('/api/viewEvents', async (req, res) => {
  const data = await events.find().toArray()
  res.render('events', { events: data })
})

app.get('/api/events', async (req, res) => {
  const data = await events.find().toArray()
  res.json(data)
})

app.post('/api/addevent', async (req, res) => {
  const { name, description, country, month, dayNumber, dayIndex, source, userId, holiday } = req.body
  console.log('request for /api/addEvent', name, description, country, month, dayNumber, dayIndex, source, userId, holiday)

  const eventResult = await events.insertOne({ name, description, country, month, dayNumber, dayIndex, userId, holiday, source: source || '' })

  const eventId = eventResult.insertedId.toHexString()

  await months.updateOne({ name: monthString[month] }, { $push: { [`dates.${dayIndex}.events`]: eventId } })

  const userUpdate = await database
    .db('calender')
    .collection('users')
    .updateOne({ _id: new ObjectId(userId) }, { $push: { events: eventId } })
  console.log(userUpdate)

  res.status(200).send(eventId)
})

app.post('/api/removeevent', async (req, res) => {
  const { id } = req.body
  console.log('request for /api/removeEvent', id)

  const event = await events.findOneAndDelete({ _id: new ObjectId(id) })

  await months.updateOne({ name: monthString[event.month] }, { $pull: { [`dates.${event.dayIndex}.events`]: id } })

  await database
    .db('calender')
    .collection('users')
    .updateOne({ _id: new ObjectId(event.userId) }, { $pull: { events: id } })

  res.status(200).send(id)
})

app.post('/api/updateevent', async (req, res) => {
  const { id, name, description, country, month, dayNumber, dayIndex, source, userId, holiday } = req.body
  console.log('request for /api/updateEvent', id, name, description, country, month, dayNumber, dayIndex, source, userId, holiday)

  const event = await events.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { name, description, country, month, dayNumber, dayIndex, source, userId, holiday } }
  )

  await months.updateOne({ name: monthString[month] }, { $pull: { [`dates.${event.value.dayIndex}.events`]: id } })
  await months.updateOne({ name: monthString[month] }, { $push: { [`dates.${dayIndex}.events`]: id } })

  res.status(200).send(id)
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

app.post('/user/updatefromserver', async (req, res) => {
  try {
    const token = req.headers.authorization.substring(7)

    const { id } = jwt.verify(token, jwt_secret)
    const user = await database
      .db('calender')
      .collection('users')
      .findOne({ _id: new ObjectId(id) })
    const { email, username, type, events } = user
    res.status(200).send({ result: { id, email, username, type, events }, error: false })
  } catch (error) {
    console.log(error)
    res.status(401).send({ error: 'Unauthorized' })
  }
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

  if (!userEmails.includes(email)) {
    res.send({
      result: false,
      error: { code: 401, message: 'You are not permited to create an account', location: 'email' },
    })
    return
  }

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

  const user = await database.db('calender').collection('users').insertOne({ email, username, password, type, events: [] })
  const id = user.insertedId

  const token = jwt.sign({ id, email }, jwt_secret, { expiresIn: '14d' })

  res.status(200)
  res.send({ result: { id, token }, error: false })
})

app.post('/users/login', async (req, res) => {
  const { email } = req.body
  console.log('request for /users/login', email)

  //TODO: add a way that it searches for the email or username
  const user = await database.db('calender').collection('users').findOne({ email })

  if (!user) {
    res.send({
      result: false,
      error: { code: 401, message: 'Invalid email', location: 'email' },
    })
    return
  }
  const token = jwt.sign({ id: user._id.toHexString(), email }, jwt_secret, { expiresIn: '14d' })

  res.status(200).send({
    result: {
      id: user._id.toHexString(),
      username: user.username,
      email: user.email,
      type: user.type,
      password: user.password,
      events: user.events,
      token,
    },
    error: false,
  })
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000...')
})
