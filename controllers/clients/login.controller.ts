import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import RefreshTokens from "../../models/RefreshTokens.model";
import {createA_R_Token} from "../../helpers/createToken_A_R.helpers";
import {constantUser} from "../../constants/infoUser.contant";
import Cart from "../../models/cart.model";

const prefix_client = "clients";
// [GET] /
export const index = async function (
    req: Request,
    res: Response
): Promise<void> {
    try {
        const redirect = req.query.redirect;
        res.render(prefix_client + "/pages/login/index", {
            title: "Login",
            redirect: redirect,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const login_verify = async function (
    req: Request,
    res: Response
): Promise<void> {
    try {
        const redirect: string = req?.query?.redirect?.toString() ?? "";

        const user = req["user"];

        const record = constantUser(user);
        const findCart = await  Cart.findOne({where:{User_ID:record.id},raw:true,attributes:['Cart_ID']}) as unknown as {Cart_ID:string};
       await createA_R_Token(res,record,"",findCart?.Cart_ID);
        if(redirect){
            res.redirect(redirect);
        }else{
            res.redirect("back")
        }

    } catch (error) {
        console.error("Error in login_verify controller:", error);
        res.status(500).json({ message: "Error" });
    }
};
export const login_google = async function (
    req: Request,
    res: Response
): Promise<void> {
    try {
        const userVerify = req["verifyUser"];
        const {redirect} = req["queryBackup"];

        if(userVerify && Object.keys(userVerify).length > 0){
            req.flash("success", "アカウントが正常にリンクされました。");
            res.redirect("/my_page/edit-profile");
            return ;
        }
        const user = req["user_new"];

        const record = constantUser(user);
        const findCart = await  Cart.findOne({where:{User_ID:record.id},raw:true,attributes:['Cart_ID']}) as unknown as {Cart_ID:string};

        await createA_R_Token(res,record,"",findCart?.Cart_ID);
        if(redirect){
            res.redirect(redirect);
        }else{
            res.redirect("/")
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login_facebook = async function (
    req: Request,
    res: Response
): Promise<void> {
    try {
        const userVerify = req["verifyUser"];
        if(userVerify && Object.keys(userVerify).length > 0){
            req.flash("success", "アカウントが正常にリンクされました。");
            res.redirect("/my_page/edit-profile");
            return ;
        }
        const user = req["user_new"];

        const record = constantUser(user);
        await createA_R_Token(res,record);
        res.redirect("/")
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


