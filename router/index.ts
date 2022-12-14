import express from "express";
import { logout, registration, login, refresh } from '../controllers/auth-controller';
import { readAllTasks, createTask, updateTask, deleteTask, changeTasksCondition } from '../controllers/task-controller';
const router = express.Router();
import { body } from 'express-validator';

//  Authorization
router.post("/registration",
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
registration);
router.post("/login", login);
router.post('/logout', logout);
router.get("/refresh", refresh);

//  Work with tasks
router.get('/tasks/:usersId', readAllTasks);
router.post('/tasks', createTask);
router.put('/tasks', updateTask);
router.delete('/tasks', deleteTask);
router.put('/tasksCondition', changeTasksCondition);

export default router;