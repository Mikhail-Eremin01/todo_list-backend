import { Schema, model } from 'mongoose';

const TaskSchema = new Schema(
    {
        name: {type: String, required: true},
        completed: {type: Boolean, required: true},
        usersId: {type: String, required: true}
    }
)

const Task = model("Task", TaskSchema);

export default Task;