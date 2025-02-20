import { Request, Response } from "express";
import User from "../../models/users.model";
import Cart from "../../models/cart.model";
import ms from "ms";

const prefix_client = "clients";
// [GET] /
export const index = async function (
    req: Request,
    res: Response
): Promise<void> {
    try {
        res.render(prefix_client + "/pages/registration/index", {
            title: "Register",

        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const registration_verify = async function (
    req: Request,
    res: Response
): Promise<void> {
    try {
        const {name, email, password } = req.body;
        const cart_code = req["cart_code"];
        const recordNew :{
            FullName: string,
            Email: string,
            PasswordHash: string,

        } = {
            FullName: name,
            Email: email,
            PasswordHash: password,
        }

        const user = await User.create(recordNew,{raw: true});
        await Cart.update({User_ID: user.ID},{where: {Cart_ID: cart_code}});
        res.setHeader("Set-Cookie", [

            'cart_code=; HttpOnly; Path=/; Max-Age=; SameSite=Lax; Secure; Partitioned'
        ]);

        req.flash("success", "アカウントが正常に作成されました。");
        res.redirect("back")
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
};