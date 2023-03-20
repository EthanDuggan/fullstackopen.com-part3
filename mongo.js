const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://eduggan1997:${password}@mycluster.uyxvzww.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {

    let consoleOutput = 'phonebook:\n'

    Person.find({}).then(result => {
        result.forEach(person => {
            consoleOutput += `${person.name} ${person.number}\n`
        })
        console.log(consoleOutput)   
        mongoose.connection.close()     
    })

} else if (process.argv.length == 5) {

    const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    newPerson.save().then(result => {
        console.log(`added ${newPerson.name} number ${newPerson.number} to phonebook`)
        mongoose.connection.close()
    })
    
}

