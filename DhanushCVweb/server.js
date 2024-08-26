const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Atlas connection string
const MONGO_URI = 'mongodb+srv://2123012:1mGRkKAWhLOzCuwB@dhanush.jgtpl.mongodb.net/dhanush?retryWrites=true&w=majority&tls=true';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas:', err));

// Define the Contact schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
});

// Create the Contact model
const Contact = mongoose.model('Contact', contactSchema);

// Handle form submission
app.post('/submit-form', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate data on the server-side
  if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
    return res.status(400).send('All fields are required.');
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Invalid email format.');
  }

  // Save the data to MongoDB
  const newContact = new Contact({ name, email, subject, message });
  newContact.save()
    .then(() => res.send('Contacted successfully!'))
    .catch(err => res.status(500).send('Error saving data. Please try again.'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
