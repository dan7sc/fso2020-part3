const express = require('express')
let persons = require('./db.json')

const app = express()
const PORT = 3001

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

app.delete('/api/persons/:id', (req, res) => {
    const id = Number.parseInt(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
