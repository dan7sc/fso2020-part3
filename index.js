const express = require('express')
const morgan = require('morgan')
let persons = require('./db.json')

const app = express()
const PORT = 3001

morgan.token('type', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

app.get('/info', (req, res) => {
    const size = persons.length
    const date = new Date().toString()
    const response = `<p>Phonebook has info for ${size} people</p>` +
          `<p>${date}</p>`
    res.send(response)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number.parseInt(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) res.status(200).json(person)
    else res.status(404).end()
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
