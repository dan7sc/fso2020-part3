const express = require('express')
const PERSONS = require('./db.json')

const app = express()
const PORT = 3001

app.get('/info', (req, res) => {
    const persons = PERSONS.persons
    const size = persons.length
    const date = new Date().toString()
    const response = `<p>Phonebook has info for ${size} people</p>` +
          `<p>${date}</p>`
    res.send(response)
})

app.get('/api/persons', (req, res) => {
    res.json(PERSONS)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
