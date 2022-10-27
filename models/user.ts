import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    name: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true}
})

const User = model("User", UserSchema);

export default User;