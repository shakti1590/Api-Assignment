const mongoose = require('mongoose');
const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
  },
  numbers: [[Number]], 
});

module.exports = mongoose.model('Ticket', ticketSchema);
