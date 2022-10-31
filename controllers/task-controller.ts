import TaskModel from '../models/task';
import { Request, Response, NextFunction } from 'express';

export const readAllTasks = async(req: Request, res: Response, next:NextFunction) => {
    const {usersId} = req.params;
    const allTasks = await TaskModel.find({usersId});
    
    return res.json(allTasks);
}

export const createTask = async(req: Request, res: Response, next:NextFunction) => {
    const {name, usersId} = req.body;
    console.log(usersId);
    await TaskModel.create({name, completed: false, usersId: usersId});
    const allTasks = await TaskModel.find({usersId});
    console.log(allTasks);

    return res.json(allTasks);
}

export const updateTask = async(req: Request, res: Response, next:NextFunction) => {
    const {id, name, usersId} = req.body;

    const filter = { _id: id };
    const update = { name: name };

    await TaskModel.findOneAndUpdate(filter, update, {
        new: true
    });
    const allTasks = await TaskModel.find({usersId});

    return res.json(allTasks);
}

export const deleteTask = async(req: Request, res: Response, next:NextFunction) => {
    const {id, usersId} = req.body;
    await TaskModel.deleteOne({_id: id});
    const allTasks = await TaskModel.find({usersId});

    return res.json(allTasks);
}

export const changeTasksCondition = async(req: Request, res: Response, next:NextFunction) => {
    const {id, usersId} = req.body;
    const user = await TaskModel.findOne({_id: id});

    const filter = { _id: id };
    const update = { completed: !user?.completed };

    await TaskModel.findOneAndUpdate(filter, update, {
        new: true
    });
    const allTasks = await TaskModel.find({usersId});

    return res.json(allTasks);
}