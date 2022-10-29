import TaskModel from '../models/task';
import { Request, Response, NextFunction } from 'express';

export const readAllTasks = async(req: Request, res: Response, next:NextFunction) => {
    const allTasks = await TaskModel.find({});
    
    return res.json(allTasks);
}

export const createTask = async(req: Request, res: Response, next:NextFunction) => {
    const {name} = req.body;

    await TaskModel.create({name, completed: false});
    const allTasks = await TaskModel.find({});

    return res.json(allTasks);
}

export const updateTask = async(req: Request, res: Response, next:NextFunction) => {
    const {id, name} = req.body;

    const filter = { _id: id };
    const update = { name: name };

    await TaskModel.findOneAndUpdate(filter, update, {
        new: true
    });
    const allTasks = await TaskModel.find({});

    return res.json(allTasks);
}

export const deleteTask = async(req: Request, res: Response, next:NextFunction) => {
    const {id} = req.body;
    await TaskModel.deleteOne({_id: id});
    const allTasks = await TaskModel.find({});

    return res.json(allTasks);
}

export const changeTasksCondition = async(req: Request, res: Response, next:NextFunction) => {
    const {id} = req.body;
    const user = await TaskModel.findOne({_id: id});

    const filter = { _id: id };
    const update = { completed: !user?.completed };

    await TaskModel.findOneAndUpdate(filter, update, {
        new: true
    });
    const allTasks = await TaskModel.find({});

    return res.json(allTasks);
}