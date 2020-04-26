require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
const PORT = process.env.PORT || 3001

morgan.token('type', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(cors())

app.get('/info', (req, res) => {
    const size = persons.length
    const date = new Date().toString()
    const response = `<p>Phonebook has info for ${size} people</p>` +
          `<p>${date}</p>`
    res.send(response)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.findById(id).then(person => {
        res.json(person.toJSON())
    })
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const existPerson = persons.map(person => person.name === body.name).includes(true)
    if (existPerson)
        return res.status(400).json({error: 'name must be unique'})
    if (body.name === '' || body.number === '')
        return res.status(400).json({error: 'name or number is missing'})
    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(newPerson)
    res.status(201).json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number.parseInt(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const generateId = () => {
    const min = 999999
    const max = 9999999999999999
    const id = Math.floor(Math.random() * (max - min)) + min
    return id
}
