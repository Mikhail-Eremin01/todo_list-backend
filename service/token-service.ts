import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import tokenModel from "../models/token";

interface IPayload {
    id: Types.ObjectId,
    email: string
}


export const generateTokensService = async(payload:IPayload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
        expiresIn: "15s",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: "30d",
    });
    return { accessToken, refreshToken };
}

export const validateRefreshTokenService = async(token:string) => {
    try {
        const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
        return userData;
    } catch (error) {
        return null;
    }
}

export const saveTokenService = async(userId:Types.ObjectId, refreshToken:string) => {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
}

export const removeTokenService = async(refreshToken:string) => {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
}

export const findTokenService = async(refreshToken:string) => {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
}