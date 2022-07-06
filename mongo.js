const mongoose = require('mongoose');

if (process.argv.length < 3) {
  // eslint-disable-next-line max-len
  console.log('Please provide the password, the name and the number as an argument: node mongo.js <password> <name> <number>');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://person-fullstack:${password}@person.wg6jcd8.mongodb.net/personApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,

});

const Person = mongoose.model('Person', personSchema);

if (!name && !number) {
  mongoose
      .connect(url)
      .then(() => {
        Person.find({}).then((result) => {
          result.forEach((person) => {
            console.log(person);
          });
          mongoose.connection.close();
        });
      });
} else {
  mongoose
      .connect(url)
      .then(() => {
        console.log('connected');

        const person = new Person({
          name: name,
          number: number,
        });

        person.save().then((result) => {
          console.log('person saved!');
          mongoose.connection.close();
        });
      });
}

