const express = require('express');

const cors = require('cors');

require('dotenv').config();

const app = express();
const Person = require('./models/person');

app.use(express.json());
app.use(express.static('build'));
app.use(cors());

/*
const morgan = require('morgan');

app.use(morgan(':method :url :status :response-time ms :body'))
morgan.token('body', (req, res) => JSON.stringify(req.body));

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
    },
    {
        "id": 5,
        "name": "Julio Cedeno",
        "number": "04-12-0828368"
      }
];

#############################################################################

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + Math.floor(Math.random()*100)
  }

 ###################################################################
   const findName = Person.find(p => p.name===body.name);
    const findNumber = Person.find(p => p.number===body.number);

    if (!body.name) {
      return res.status(400).json({
        error: 'Name missing'
      })
    }
    if (!body.number) {
      return res.status(400).json({
        error: 'Number missing'
      })
    }

    if (findName) {
      return res.status(400).json({
        error: 'name must be unique'
      })
    }

    if (findNumber) {
      return res.status(400).json({
        error: 'number must be unique'
      })
    }

*/

app.get('/', (req, res) => {
  res.send('<h1>HOLIS</h1>');
});
app.get('/info', (req, res)=>{
  const idSum = Person.length;
  const date = new Date();
  res.send(`<div> 
    <h3>hay ${idSum} personas registradas</h3>
    <h3>${date}</h3>
    </div>
    `);
});
app.get('/api/persons', (req, res) => {
  Person.find({}).then( (persons) => {
    res.json(persons);
  } );
});

app.get('/api/persons/:id', (req, res, next) =>{
  Person.findById(req.params.id).then(
      (person) => {
        if (person) {
          res.json(person);
        } else {
          res.status(404).end();
        }
      },
  ).catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });


  person.save().then((persons) => {
    res.json(persons);
  }).catch((error) => next(error));
});


app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const person = {
    ...body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
      .then((updatedPerson) => res.json(updatedPerson))
      .catch((error) => next(error));
});


app.delete('/api/persons/:id', (req, res, next) =>{
  Person.findByIdAndRemove(req.params.id)
      .then((result) => {
        res.status(204).end();
      })
      .catch((error) => next(error));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({error: 'Malformatted ID'});
  }

  if (error.name === 'ValidationError') {
    const errors = {};

    Object.keys(error.errors).map((key) => {
      errors[key] = error.errors[key].message;
    });

    console.log(errors);

    return res.status(400).send(errors);
  }


  next(error);
};
app.use(errorHandler);
