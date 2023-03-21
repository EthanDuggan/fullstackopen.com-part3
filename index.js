//import environment variables
require('dotenv').config()

//import modules
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

//import mongoose models
const Person = require('./models/person')


//server initialization
const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan((tokens, req, res) => {
    const returnTokens = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ]
    if (tokens.method(req, res) == 'POST') {
        returnTokens.push('- ' + JSON.stringify(req.body))
    }
    
    return returnTokens.join(' ')
}))

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


//routes

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        response.status(400).json({
            error: 'Request body must contain name and number'
        })
        return
    }
    /*if (persons.find(person => person.name === body.name)) {
        response.status(400).json({
            error: `Person with name ${body.name} already exists`
        })
        return
    }*/
    
    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })
    
    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


//helper functions

const generatePersonID = () => Math.floor(Math.random() * 10000)