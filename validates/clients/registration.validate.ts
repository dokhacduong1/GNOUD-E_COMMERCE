import { Request, Response, NextFunction } from "express";
import * as validate_email from "email-validator";
import passwordValidator  from "password-validator";
import User from "../../models/users.model";


let schemaPassword = new passwordValidator();
schemaPassword
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .has().symbols(1)                               // Must have at least 1 symbol
export const getRegistration = async function (
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
        console.error("Error in  middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const postRegistration = async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if(req['verifyUser'] && Object.keys(req['verifyUser']).length > 0){
            res.redirect("/");
            return;
        }
        const {name, email, password,password_confirmation,clause } = req.body;
        if(!name){
            req.flash("error", "名前を入力してください。");
            res.redirect("back");
            return;
        }
        if(!email || !validate_email.validate(email)){
            req.flash("error", "メールアドレスが正しくありません。");
            res.redirect("back");
            return;
        }
        if (password !== password_confirmation) {
            req.flash("error", "パスワードが一致しません。");
            res.redirect("back");
            return;
        }
        if(!password || !schemaPassword.validate(password)){
            //Mật khẩu phải chứa ít nhất 8 ký tự, ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số, 1 ký tự đặc biệt
            req.flash("error", "パスワードは8文字以上で、少なくとも1つの大文字、1つの小文字、1つの数字、1つの特殊文字を含む必要があります。");
            res.redirect("back");
            return;
        }
        if(!clause){
            req.flash("error", "利用規約に同意してください。");
            res.redirect("back");
            return;
        }
        const findEmailDatabase = await User.findOne({where: {Email: email}});
        if(findEmailDatabase){
            req.flash("error", "メールアドレスがすでに存在します。");
            res.redirect("back");
            return;
        }

        next();
    } catch (error) {
        console.error("Error in  middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
