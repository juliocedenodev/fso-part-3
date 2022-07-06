const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);


mongoose.connect(url)
    .then((result) => console.log('Connected to the URL'))
    // eslint-disable-next-line max-len
    .catch((error) => console.log('error connecting to MongoDB:', error.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
    minLength: 3,
    validate: {
      validator: async function(val) {
        const user = await Person.findOne({name: val});
        if (user) {
          if (this.id === user.id) {
            return true;
          }
          return false;
        }
        return true;
      },
      message: (props) => `${props.value} is already on the server`,
    },
  },
  number: {
    type: String,
    required: [true, 'Phone number required'],
    minLength: 8,
    validate: {
      validator: (number) =>{
        return /\d{4}-\d{7}/.test(number);
      },
      message: (number) => `${number.value} is not a valid phone number!`,
    },


  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Person = mongoose.model('Person', personSchema);

module.exports = mongoose.model('Person', personSchema);
