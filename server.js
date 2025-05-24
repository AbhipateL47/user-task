require('dotenv').config();
const express = require('express');
const allRoutes = require('./routes');
const connectDB = require('./config/dbConnection');

connectDB();

const app = express();

app.use(express.json());

app.use('/api', allRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});