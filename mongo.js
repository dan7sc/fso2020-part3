const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
      `mongodb+srv://fshelyui:${password}@cluster0-rvapt.mongodb.net/phonebook-app?retryWrites=true&w=majority`

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect(url, dbOptions)

const personSchema = mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person
    .find({})
    .then(persons => {
      persons.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person
    .save()
    .then(result => {
      console.log(`added ${result.name} ${result.number} to phonebook`)
      mongoose.connection.close()
    })
}
