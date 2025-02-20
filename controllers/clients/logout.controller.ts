import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import RefreshTokens from "../../models/RefreshTokens.model";

export const index = async function (
    req: Request,
    res: Response
): Promise<void> {
    try {
        const R_TOKEN = req.cookies["r_token"];
        if (!R_TOKEN) {
            res.setHeader("Set-Cookie", [
                `r_token=; HttpOnly; Path=/; Max-Age=; SameSite=None; Secure; Partitioned`,
                `a_token=; HttpOnly; Path=/; Max-Age=; SameSite=None; Secure; Partitioned`,
                'cart_code=; HttpOnly; Path=/; Max-Age=; SameSite=Lax; Secure; Partitioned'
            ]);
            res.redirect("/")
            return
        }
        const decoded = jwt.verify(R_TOKEN, process.env.REFRESH_TOKEN_SECRET);
        const { id } = decoded;
        await RefreshTokens.update(
            { is_revoked: true },
            { where: { user_id: id, token: R_TOKEN } }
        );

        res.setHeader("Set-Cookie", [
            `r_token=; HttpOnly; Path=/; Max-Age=; SameSite=None; Secure; Partitioned`,
            `a_token=; HttpOnly; Path=/; Max-Age=; SameSite=None; Secure; Partitioned`,
            'cart_code=; HttpOnly; Path=/; Max-Age=; SameSite=Lax; Secure; Partitioned'
        ]);
        res.redirect("/")
    } catch (error) {
       res.redirect("/")
    }
};
