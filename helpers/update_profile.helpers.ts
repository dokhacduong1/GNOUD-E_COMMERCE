import {Request, Response} from "express";
import {createA_R_Token_Api} from "./createToken_A_R.helpers";
import User from "../models/users.model";
import {constantUser} from "../constants/infoUser.contant";

export const updateProfileClient = async function (
    res: Response,
    user: any
): Promise<void> {
    try {
        const email = user.email;
        const userResult = await User.findOne({where: {Email: email},raw: true});
        const record = constantUser(userResult);
        await createA_R_Token_Api(res,record);

        // console.log("Update profile successfully");
    } catch (error) {
        console.error("Error in login_verify controller:", error);
        res.status(500).json({ message: "Error" });
    }
};