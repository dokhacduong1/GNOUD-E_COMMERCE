import {Request, Response} from "express";
import User from "../../models/users.model";
import {updateProfileClient} from "../../helpers/update_profile.helpers";
import UserProvider from "../../models/user_providers";
import {comparePassword} from "../../helpers/check-password.helpers";
import axios from "axios";
const prefix_client = "clients"; // Đặt prefix cho client
import https from 'https';
import DeliveryAddress from "../../models/delivery_address.model";
const agent = new https.Agent({
    rejectUnauthorized: false
});
export const index = async function (
    req: Request,
    res: Response
): Promise<void> {
    try{
        const listLinkOrderInformation = [{link: "/my_page/management-address", text: "お届け先一覧"},{link: "#", text: "お支払い方法一覧"}, {link: "#", text: "購入履歴"}];
        const listLinkLikeUser = [{link: "#", text: "商品"}];
        res.render(`${prefix_client}/pages/my_page/index`, {
            title: "私のページ",
            listLinkOrderInformation,
            listLinkLikeUser
        });
    }
    catch (error) {
        console.log(error);

        res.status(500).json({message: "Internal Server Error"});
    }
}
//[GET]
export const editProfile = async function (
    req: Request,
    res: Response
): Promise<void> {
    try{
        const user = req['verifyUser'];
        const findAccoundGoogle = !!(await UserProvider.findOne({where: {UserID: user.id, Provider: "Google"}}));
        const findAccoundFacebook = !!(await UserProvider.findOne({where: {UserID: user.id, Provider: "Facebook"}}));
        res.render(`${prefix_client}/pages/my_page/edit-profile`, {
            title: "プロフィールを編集",
            findAccoundGoogle,
            findAccoundFacebook
        });
    }
    catch (error) {
        console.log(error);

        res.status(500).json({message: "Internal Server Error"});
    }
}

//[PATCH]
export const patchEditProfile = async function (
    req: Request,
    res: Response
): Promise<void> {
    try{
        const user = req['verifyUser'];
        if(req.body.image){
            req.body.avatar = req.body.image;
            delete req.body.image;
        }

        await User.update({
            FullName: req.body.fullName,
            Birthday: req.body.birthday,
            Sex: req.body.sex,
            Avatar: req.body.avatar
        },{where: {Email: user.email}});

        await updateProfileClient(res,user);

        res.status(200).json({code:200,message: "Success"});
    }
    catch (error) {
        console.log(error);

        res.status(500).json({message: "Internal Server Error"});
    }
}

export const patchChangePassword = async function (
    req: Request,
    res: Response
): Promise<void> {
    try{
        const email = req['verifyUser'].email;
        const {new_password} = req.body;
        const user = await User.findOne({ where: { Email: email } });
        if (user) {
            user.PasswordHash = new_password;
            user.changed('PasswordHash', true); // Mark PasswordHash as changed
            await user.save();
        }
        req.flash("success", "パスワードが正常に変更されました。");
        res.redirect("back");
        return;
    }
    catch (error) {
        console.log(error);

        res.status(500).json({message: "Internal Server Error"});
    }
}

//[GET]
export const changePassword = async function (
    req: Request,
    res: Response
): Promise<void> {
    try{
        const user = req['verifyUser'];
        // @ts-ignore
        const checkPassword = await User.findOne({where: {ID: user.id}},  {raw: true});
        const isEmptyPassword = await comparePassword("", checkPassword.PasswordHash);

        res.render(`${prefix_client}/pages/my_page/change-password`, {
            title: "パスワード変更",
            isEmptyPassword
        });
    }
    catch (error) {
        console.log(error);

        res.status(500).json({message: "Internal Server Error"});
    }
}
//[GET]
export const managementAddress = async function (
    req: Request,
    res: Response
): Promise<void> {
    try{
        const DeliveryAddressData = await DeliveryAddress.findAll(
            {
                where: {User_ID: req['verifyUser'].id},
                raw: true,
                attributes:['FullName',"PhoneNumber","Address","ID"]
            });


        res.render(`${prefix_client}/pages/my_page/management_address`, {
            title: "お届け先管理",
            DeliveryAddressData
        });
    }
    catch (error) {
        console.log(error);

        res.status(500).json({message: "Internal Server Error"});
    }
}
export const createAddress = async function (
    req: Request,
    res: Response
): Promise<void> {
    try{

        res.render(`${prefix_client}/pages/my_page/create_address`, {
            title: "お届け先追加",

        });
    }
    catch (error) {
        console.log(error);

        res.status(500).json({message: "Internal Server Error"});
    }
}
export const postCreateAddress = async function (
    req: Request,
    res: Response
): Promise<void> {
    try{
        const countAddress = await DeliveryAddress.count({where: {User_ID: req['verifyUser'].id}});
        if(countAddress === 4){
            req.flash("error", "お届け先は4件まで登録可能です。");
            res.redirect("back");
            return;
        }
        const {name, phone, province_id, ward_id,address} = req.body;
        const [city,district] = province_id.split("_");
        const user = req['verifyUser'];
        await DeliveryAddress.create({
            User_ID: user.id,
            FullName: name,
            PhoneNumber: phone,
            City: city,
            District: district,
            Ward: ward_id,
            Address: address,

       })

        res.redirect("/my_page/management-address");
        return;
    }
    catch (error) {
        console.log(error);

        res.status(500).json({message: "Internal Server Error"});
    }
}

export const editAddress = async function (
    req: Request,
    res: Response
): Promise<void> {
    try {
        const id = req.params.id;
        const DeliveryAddressData = await DeliveryAddress.findOne(
            {
                where: {ID: id},
                raw: true
            });
        res.render(`${prefix_client}/pages/my_page/edit_address`, {
            title: "お届け先編集",
            DeliveryAddressData: JSON.stringify(DeliveryAddressData)
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({message: "Internal Server Error"});
    }
}

export const patchEditAddress = async function (
    req: Request,
    res: Response
): Promise<void> {
    try {
        const id = req.params.id;
        const {name, phone, province_id, ward_id,address} = req.body;
        const [city,district] = province_id.split("_");
        await DeliveryAddress.update({
            FullName: name,
            PhoneNumber: phone,
            City: city,
            District: district,
            Ward: ward_id,
            Address: address,
        },{where: {ID: id}});

        res.redirect("/my_page/management-address");
        return;
    } catch (error) {
        console.log(error);

        res.status(500).json({message: "Internal Server Error"});
    }
}