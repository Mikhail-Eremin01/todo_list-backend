import UserModel from "../models/user";
import bcrypt from "bcryptjs";
import {
    generateTokensService, 
    validateRefreshTokenService, 
    saveTokenService, 
    removeTokenService, 
    findTokenService
} from "./token-service";
import ApiError from "../exceptions/api-error";
import { Types } from "mongoose";


interface IUser{
    name: string,
    _id: Types.ObjectId,
    email: string,
    password: string
}


export const registrationService = async(name: string, email:string, password:string) => {
    const candidatesMail = await UserModel.findOne({ email });
    const candidatesName = await UserModel.findOne({ name });

    if (candidatesMail) {
        throw ApiError.BadRequest(
            `User with email ${email} already exists`
        );
    }
    if(candidatesName) {
        throw ApiError.BadRequest(
            `User with name ${name} already exists`
        );
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const user: IUser = await UserModel.create({
        name,
        email,
        password: hashPassword,
    });

    const usersData = {
        id: user._id,
        email: user.email,
        name: user.name
    }
    const tokens = await generateTokensService({ ...usersData });
    await saveTokenService(usersData.id, tokens.refreshToken);

    return { ...tokens, user: usersData };
}

export const loginService = async(email:string, password:string) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw ApiError.BadRequest("User with this email was not found");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
        throw ApiError.BadRequest("Invalid password");
    }
    const usersData = {
        id: user._id,
        email: user.email,
        name: user.name
    }
    const tokens = await generateTokensService({ ...usersData });

    await saveTokenService(usersData.id, (await tokens).refreshToken);

    return { ...tokens, user: usersData };
}

export const logoutService = async(refreshToken:string) => {
    const token = await removeTokenService(refreshToken);
    return token;
}

export const refreshService = async(refreshToken:string) => {
    if (!refreshToken) {
        throw ApiError.UnauthorizedError();
    }
    const userData:any = await validateRefreshTokenService(refreshToken);
    const tokenFromDb = await findTokenService(refreshToken);
    if (!userData || !tokenFromDb) {
        throw ApiError.UnauthorizedError();
    }
    
    const user = await UserModel.findById(userData.id);
    if(user) {
        const usersData = {
            id: user._id,
            email: user.email,
            name: user.name
        }
        const tokens = await generateTokensService({ ...usersData });

        await saveTokenService(usersData.id, tokens.refreshToken);
        return { ...tokens, user: usersData };
    }
}