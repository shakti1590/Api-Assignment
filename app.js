// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressMongoSanitize = require('express-mongo-sanitize');
const uuid = require('uuid');
const Ticket = require('./models/ticket');
const app = express();
app.use(bodyParser.json());
app.use(expressMongoSanitize());
const databaseURI = 'mongodb+srv://ssingh12102002:shakti1234@ticket.frfxchp.mongodb.net/?retryWrites=true&w=majority'; // Replace 'tambula' with your desired database name
mongoose.connect(databaseURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});
function generateTambulaTicket() {
  const ticket = [];
  const columnRanges = [0, 10, 20, 30, 40, 50, 60, 70, 80];

  while (ticket.length < 3) {
    const newTicket = [];
    const usedNumbers = new Set();

    for (let i = 0; i < 9; i++) {
      const min = columnRanges[i] + 1;
      const max = columnRanges[i + 1];
      const column = [];

      while (column.length < 5) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        if (!usedNumbers.has(randomNumber)) {
          column.push(randomNumber);
          usedNumbers.add(randomNumber);
        }
      }

      newTicket.push(column.sort((a, b) => a - b));
    }

    ticket.push(newTicket);
  }

  return ticket;
}
app.post('/api/tickets', async (req, res) => {
  try {
    const numbers = generateTambulaTicket();
    const ticket = new Ticket({
      ticketId: uuid.v4(),
      numbers,
    });
    await ticket.save();

    return res.status(201).json({ ticketId: ticket.ticketId });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return res.status(500).json({ message: 'Failed to create ticket' });
  }
});
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
