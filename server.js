const express = require('express');
const app = express();
app.use(express.json());

let tasks = [
{ id: 1, name: "Review Node.js Tutorial", completed: false },
{ id: 2, name: "Review Node.js Tutorial", completed: false },
{ id: 3, name: "Review Node.js Tutorial", completed: false }];
let nextId = 4;

app.get('/', (req, res) => {
    res.send('Express Server is running.. but seraj is shot dowing')
})

app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);

})

app.get('/tasks/:id', (req, res) => {
   const id = parseInt (req.params.id);
   const task = tasks.find(t => t.id === id);
   if (!task) {
       return res.status(404).json({ error: 'Task not found' });
   }
   res.status(200).json(task);
})

app.post('/tasks', (req, res) => {
    console.log('post request received');
    const newTask = req.body;
    newTask.id = nextId++;
    tasks.push(newTask);
    res.status(201).json(newTask);
})


app.post('/task', (req, res) => {
    const newTask = req.body;
    newTask.id = nextId++;
    tasks.push(newTask);
    res.status(201).json(newTask);
})

app.post('/task', (req, res) => {
    const newTask = req.body;
    newTask.id = nextId++;
    tasks.push(newTask);
    res.status(201).json(newTask);
})

app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    tasks.splice(taskIndex, 1);
    res.status(200).json({ message: 'Task deleted successfully' });
});

app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    res.status(200).json(tasks[taskIndex]);
});







app.listen(5000, () => {
    console.log('Express Server is running on port 5000');

})
