const express = require('express');
const connectDB = require('./src/config/db');
connectDB();

const app = express();
app.use(express.json());

const taskRoutes = require('./src/routes/taskRoutes');
const movieRoutes = require('./src/routes/movieRoutes');

app.get('/', (req, res) => {
    res.send('Express Server is running');
});

app.use('/api/tasks', taskRoutes);
app.use('/movies', movieRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express Server is running on port ${PORT}`);
});
