const express = require('express')
const PERSONS = require('./db.json')

const app = express()
const PORT = 3001

app.get('/api/persons', (req, res) => {
    res.json(PERSONS)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
