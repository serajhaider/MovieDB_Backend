require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const authRoutes = require('./routes/AuthRoutes');
const taskRoutes = require('./routes/taskRoutes');
const movieRoutes = require('./routes/movieRoutes');

app.get('/', (req, res) => {
  res.send('Express Server is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/movies', movieRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express Server is running on port ${PORT}`);
});