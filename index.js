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

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.json(persons.map(person => person.toJSON()))
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id)
        .then(person => {
            res.json(person.toJSON())
        })
        .catch(error => next(error))
})

app.post('/api/persons', async (req, res, next) => {
    const body = req.body
    const existPerson = await Person.findOne({name: body.name})
    if (existPerson)
        return res.status(400).json({error: 'name must be unique'})
    if (body.name === '' || body.number === '')
        return res.status(400).json({error: 'name or number is missing'})
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save()
        .then(savedPerson => {
            res.status(201).json(savedPerson.toJSON())
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const id = req.params.id
    Person.findByIdAndRemove(id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({error: 'invalid id'})
    }
    next(error)
}
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
