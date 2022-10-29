import UserModel from "../models/user";
import bcrypt from "bcryptjs";
import tokenService from "./token-service";
import ApiError from "../exceptions/api-error";
import { Types } from "mongoose";


interface IUser{
    name: string,
    _id: Types.ObjectId,
    email: string,
    password: string
}

class UserService {
    async registration(name: string, email:string, password:string) {
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
        const tokens = tokenService.generateTokens({ ...usersData });
        await tokenService.saveToken(usersData.id, tokens.refreshToken);

        return { ...tokens, user: usersData };
    }

    async login(email:string, password:string) {
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
        const tokens = tokenService.generateTokens({ ...usersData });

        await tokenService.saveToken(usersData.id, tokens.refreshToken);

        return { ...tokens, user: usersData };
    }

    async logout(refreshToken:string) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken:string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData:any = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
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
            const tokens = tokenService.generateTokens({ ...usersData });

            await tokenService.saveToken(usersData.id, tokens.refreshToken);
            return { ...tokens, user: usersData };
        }
    }
}

export default new UserService();
