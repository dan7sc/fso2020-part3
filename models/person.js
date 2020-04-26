const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(url, dbOptions)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connection to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

mongoose.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
