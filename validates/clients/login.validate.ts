import {NextFunction, Request, Response} from "express";
import * as validate_email from "email-validator";

import User from "../../models/users.model";
import {comparePassword} from "../../helpers/check-password.helpers";
import UserProvider from "../../models/user_providers";
import {userProvider} from "../../interfaces/clients/login.interfaces";
import {convertNumberToCustomLetters} from "../../helpers/login.helpers";
import Cart from "../../models/cart.model";

export const getLogin = async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try{
        if(req['verifyUser'] && Object.keys(req['verifyUser']).length > 0){
            res.redirect("/");
            return;
        }
        next();
    }catch (error) {
        console.error("Error in addCart middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const postLogin = async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {

        if(req['verifyUser'] && Object.keys(req['verifyUser']).length > 0){
            res.redirect("/");
            return;
        }
        const {email, password } = req.body;
        if(!email || !validate_email.validate(email)){
            req.flash("error", "メールアドレスが正しくありません。");
            res.redirect("back");
            return;
        }
        if(!password){
            req.flash("error", "パスワードを入力してください。");
            res.redirect("back");
            return;
        }
        const findEmailDatabase = await User.findOne({where: {Email: email},raw: true});

        if(!findEmailDatabase){
            req.flash("error", "メールアドレスが存在しません。");
            res.redirect("back");
            return;
        }
        const isValidPassword = await comparePassword(password, findEmailDatabase.PasswordHash);
        if(!isValidPassword){
            req.flash("error", "アカウントまたはパスワードが正しくありません");
            res.redirect("back");
            return;
        }

        if(findEmailDatabase.Status !== "Active"){
            req.flash("error", "アカウントが無効になっています。");
            res.redirect("back");
            return;
        }
        req["user"] = findEmailDatabase;

        next();
    } catch (error) {
        console.error("Error in login middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const linkSocialAccount = async (
    req: Request,
    res: Response,
    next: NextFunction,
    provider: string,
    providerID: string,
    emailDomain: string,
    fullName: string
): Promise<void> => {
    try {
        const userVerify = req["verifyUser"];
        const cart_code = req['cart_code'];

        let findIdSubUserProvider = await UserProvider.findOne({
            where: { Provider: provider, ProviderID: providerID },
            raw: true
        }) as unknown as userProvider;

        if (userVerify?.id) {
            if (findIdSubUserProvider) {
                req.flash('error', 'アカウントがすでに存在します。');
                res.redirect("/my_page/edit-profile");
                return;
            }
            await UserProvider.create({
                UserID: userVerify.id,
                Provider: provider,
                ProviderID: providerID
            });
            req["user_new"] = userVerify;
            next();
            return;
        }

        if (!findIdSubUserProvider) {
            const email = providerID.match(/^\d+$/)
                ? `${convertNumberToCustomLetters(providerID)}@${emailDomain}`
                : `${providerID}@${emailDomain}`;

            const userNew = await User.create({
                Email: email,
                PasswordHash: "",
                FullName: fullName,
                TypeAccount: "Social"
            }, { raw: true });

            findIdSubUserProvider = await UserProvider.create({
                UserID: userNew.ID,
                Provider: provider,
                ProviderID: providerID
            }, { raw: true }) as unknown as userProvider;

            if (cart_code) {
                await Cart.update({ User_ID: userNew.ID }, { where: { Cart_ID: cart_code } });
            }
            req["user_new"] = userNew;
        } else {
            req["user_new"] = await User.findOne({
                where: { ID: findIdSubUserProvider.UserID },
                raw: true
            });
        }

        next();
    } catch (error) {
        console.error(`Error in post login ${provider.toLowerCase()}:`, error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const postLoginGoogle = async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const user = req["user"];
    const { name, sub } = user;
    await linkSocialAccount(req, res, next, "Google", sub, "gmail.com", name);
};

export const postLoginFacebook = async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    console.log("ok")
    const user = req["user"];
    const { first_name, last_name, id } = user;
    await linkSocialAccount(req, res, next, "Facebook", id, "facebook.com", `${first_name} ${last_name}`);
};

