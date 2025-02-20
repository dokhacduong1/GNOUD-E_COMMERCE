import {NextFunction, Request, Response} from "express";
import {validateRequiredFields, validateRequiredFieldsFlask} from "../../api/v1/helpers_api/validate_required_fields";
import passwordValidator  from "password-validator";
import User from "../../models/users.model";
import {comparePassword} from "../../helpers/check-password.helpers";
let schemaPassword = new passwordValidator();
schemaPassword
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .has().symbols(1)                               // Must have at least 1 symbol

export const editProfile = async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try{
        const {fullName,sex,birthday,} = req.body;
        const requiredFields = [
            { field: fullName, message: "名前を入力してください。" },
            {field: sex, message: "性別を選択してください。"},
            {field: birthday, message: "生年月日を入力してください。"},
        ];
        if(!validateRequiredFields(requiredFields, res)){
            return;
        }

        next();
    }catch (error) {
        console.error("Error in  middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const changePassword = async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try{
        const {new_password,confirm_password} = req.body;
        const current_password = req.body.current_password || "";
        const email = req['verifyUser'].email;




        //Taọ mảng chứa các trường bắt buộc nhập
        if(!new_password || !confirm_password){
            req.flash("error", "全てのフィールドを入力してください。");
            res.redirect("back");
            return;
        }

        if(new_password !== confirm_password){
            req.flash("error", "新しいパスワードと確認用パスワードが一致しません。");
            res.redirect("back");
            return;
        }
        if(!new_password || !schemaPassword.validate(new_password)){
            //Mật khẩu phải chứa ít nhất 8 ký tự, ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số, 1 ký tự đặc biệt
            req.flash("error", "パスワードは8文字以上で、少なくとも1つの大文字、1つの小文字、1つの数字、1つの特殊文字を含む必要があります。");
            res.redirect("back");
            return;
        }
        //Kiểm tra mật khẩu mới có đúng định dạng không
        const findEmailDatabase = await User.findOne({where: {Email: email},raw: true});
        if(!findEmailDatabase){
            req.flash("error", "メールアドレスが存在しません。");
            res.redirect("back");
            return;
        }
        //Kiểm tra mật khẩu hiện tại có đúng không
        const isValidPassword = await comparePassword(current_password, findEmailDatabase.PasswordHash);
        // const isEmptyPassword = await comparePassword("", findEmailDatabase.PasswordHash);
        // console.log(isEmptyPassword);
        if(!isValidPassword){
            req.flash("error", "現在のパスワードが間違っています。");
            res.redirect("back");
            return;
        }

        next();
    }catch (error) {
        console.error("Error in  middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

function isVietnamesePhoneNumber(number) {
    return /(?:\+84|0084|0)[235789][0-9]{1,2}[0-9]{7}(?:[^\d]+|$)/g.test(number);
}
export const createAddress = async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try{
        // [Object: null prototype] {
        //     name: 'Dương',
        //         phone: '0123467893',
        //         province_id: '512_1',
        //         ward_id: '26734',
        //         address: 'An Dương,Hải Phòng'
        // }

        const {name,phone,province_id,ward_id,address} = req.body;
        const requiredFields = [
            { field: name, message: "名前を入力してください。" },
            {field: phone, message: "電話番号を入力してください。"},
            {field: province_id, message: "都道府県を選択してください。"},
            {field: ward_id, message: "コミューン/区を選択してください。"},
            {field: address, message: "住所を入力してください。"},
        ];
        if(!validateRequiredFieldsFlask(requiredFields, res,req)){
            res.redirect("back");
            return;
        }
        if(!isVietnamesePhoneNumber(phone)){
            req.flash("error", "電話番号の形式が正しくありません。");
            res.redirect("back");
            return;
        }
        next()
    }catch (error) {
        console.error("Error in  middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}