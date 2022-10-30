import {registrationService, loginService, logoutService, refreshService} from "../service/user-service";
const { validationResult } = require('express-validator');
import { Request, Response, NextFunction } from 'express'
import ApiError from "../exceptions/api-error";

interface TypedRequestBody extends Express.Request {
    body: {
        name: string
        email: string,
        password:string
    }
}

export const registration = async(req: TypedRequestBody, res: Response, next:NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(
                ApiError.BadRequest('Please enter a valid email address. For instance johndoe@gmail.com', errors.array())
            )
        }
        const { name, email, password } = req.body;
        const userData = await registrationService(name, email, password);
        res.cookie("refreshToken", userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        return res.json(userData);
    } catch (error) {
        next(error);
    }
}

export const login = async(req: TypedRequestBody, res:Response, next:NextFunction) => {
    try {
        const { email, password } = req.body;
        const userData = await loginService(email, password);
        res.cookie("refreshToken", userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        return res.json(userData);
    } catch (error) {
        next(error);
    }
}

export const logout = async(req: Request, res:Response, next:NextFunction) => {
    try {
        const { refreshToken } = req.cookies;
        const token = await logoutService(refreshToken);
        res.clearCookie("refreshToken");
        return res.json(token);
    } catch (error) {
        next(error);
    }
}

export const refresh = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const { refreshToken } = req.cookies;
        const userData = await refreshService(refreshToken);
        res.cookie("refreshToken", userData!.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        return res.json(userData);
    } catch (error) {
        next(error);
    }
}