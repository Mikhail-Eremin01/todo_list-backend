import express from "express";
import { logout, registration, login, refresh } from '../controllers/auth-controller';
const router = express.Router();
const { body } = require('express-validator');

router.post("/registration",
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
registration);
router.post("/login", login);
router.post('/logout', logout);
router.get("/refresh", refresh);

export default router;