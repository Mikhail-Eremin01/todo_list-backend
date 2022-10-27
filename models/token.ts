import { Schema, model } from "mongoose";

const TokenSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        refreshToken: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Token = model("token", TokenSchema);

export default Token;
