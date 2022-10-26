import express from "express";
import userController from '../controllers/user-controller';
import taskController from "../controllers/task-controller";
const router = express.Router();

router.post("/login", userController.login);

export default router;