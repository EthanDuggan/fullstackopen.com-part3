//data

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//server setup & initialization
const express = require('express')
const morgan = require('morgan')

const app = express()

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

const PORT = 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

//routes

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        response.status(400).json({
            error: 'Request body must contain name and number'
        })
        return
    }

    if (persons.find(person => person.name === body.name)) {
        response.status(400).json({
            error: `Person with name ${body.name} already exists`
        })
        return
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generatePersonID()
    }
    persons = persons.concat(newPerson)

    response.json(newPerson)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.statusMessage = `Couldn't find person with id=${id}`
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

//helper functions

const generatePersonID = () => Math.floor(Math.random() * 10000)