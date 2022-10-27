import userService from "../service/user-service";
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
                ApiError.BadRequest('Validation error', errors.array())
            )
        }
        const { name, email, password } = req.body;
        const userData = await userService.registration(name, email, password);
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
        const userData = await userService.login(email, password);
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
        const token = await userService.logout(refreshToken);
        res.clearCookie("refreshToken");
        return res.json(token);
    } catch (error) {
        next(error);
    }
}

export const refresh = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const { refreshToken } = req.cookies;
        const userData = await userService.refresh(refreshToken);
        res.cookie("refreshToken", userData!.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        return res.json(userData);
    } catch (error) {
        next(error);
    }
}