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

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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
    
    newPerson.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))

})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


//custom error handler middleware

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }

    next(error)
}

app.use(errorHandler) //this has to be the last loaded middleware


//helper functions

const generatePersonID = () => Math.floor(Math.random() * 10000)