const TaskModel = require('../models/taskModel');

const getAllTasks = async (req, res) => {
	try {
		const tasks = await TaskModel.find();
		res.status(200).json(tasks);
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving tasks', error });
	}
};

const getTaskById = async (req, res) => {
	try {
		const task = await TaskModel.findById(req.params.id);
		if (task) {
			res.status(200).json(task);
		} else {
			res.status(404).json({ message: 'Task not found' });
		}
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving task', error });
	}
};

const createTask = async (req, res) => {
	try {
		const newTask = await TaskModel.create(req.body);
		res.status(201).json(newTask);
	} catch (error) {
		res.status(500).json({ message: 'Error creating task', error });
	}
};

const updateTask = async (req, res) => { 
	try {
		const updatedTask = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (updatedTask) {
			res.status(200).json(updatedTask);
		} else {
			res.status(404).json({ message: 'Task not found' });
		}
	} catch (error) {
		res.status(500).json({ message: 'Error updating task', error });
	}
};

const deleteTask = async (req, res) => {
	try {
		const deletedTask = await TaskModel.findByIdAndDelete(req.params.id);
		if (deletedTask) {
			res.status(200).json(deletedTask);
		} else {
			res.status(404).json({ message: 'Task not found' });
		}
	} catch (error) {
		res.status(500).json({ message: 'Error deleting task', error });
	}
};

module.exports = {
	getAllTasks,
	getTaskById,
	createTask,
	updateTask,
	deleteTask,
};

