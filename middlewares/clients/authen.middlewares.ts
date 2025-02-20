import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import RefreshTokens from "../../models/RefreshTokens.model";
import {createA_R_Token} from "../../helpers/createToken_A_R.helpers";
import {constantUser} from "../../constants/infoUser.contant";

// Hàm xác thực token
async function verifyToken(token: string, secret: string): Promise<any> {
    return new Promise((resolve) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                resolve(null); // Trả về null nếu token không hợp lệ
            } else {
                resolve(decoded); // Trả về thông tin giải mã nếu token hợp lệ
            }
        });
    });
}
function clearCookie(res: Response){
    res.setHeader("Set-Cookie", [
        `r_token=; HttpOnly; Path=/; Max-Age=; SameSite=None; Secure; Partitioned`,
        `a_token=; HttpOnly; Path=/; Max-Age=; SameSite=None; Secure; Partitioned`,
    ]);
}
// Hàm xử lý refresh token
export async function handleRefreshToken(userR: any, RefreshToken: string, res: Response) {
    const token = await RefreshTokens.findOne({
        where: { User_Id: userR.id, token: RefreshToken, is_revoked: false },
        raw: true,
    }) as any;

    if (!token) {
        clearCookie(res);
        return;
    }

    const record = constantUser(userR);
   await createA_R_Token(res,record, token.ID);



    return userR;
}

// Middleware xác thực
export const authenMiddlewares = async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const AccessToken = req.cookies['a_token']; // Lấy access token từ cookie
        const RefresgToken = req.cookies['r_token']; // Lấy refresh token từ cookie

        if (AccessToken || RefresgToken) {
            const userA = await verifyToken(AccessToken, process.env.ACCESS_TOKEN_SECRET); // Xác thực access token

            if (userA) {
                req['verifyUser'] = userA; // Lưu thông tin người dùng vào request
                res.locals.verifyUser = userA; // Lưu thông tin người dùng vào response locals
            } else if (RefresgToken) {

                const userR = await verifyToken(RefresgToken, process.env.REFRESH_TOKEN_SECRET); // Xác thực refresh token
                if (userR) {
                    const verifiedUser = await handleRefreshToken(userR, RefresgToken, res); // Xử lý refresh token
                    if (verifiedUser) {
                        req['verifyUser'] = verifiedUser; // Lưu thông tin người dùng vào request

                        res.locals.verifyUser = verifiedUser; // Lưu thông tin người dùng vào response locals
                    }

                }else{

                    clearCookie(res);
                }
            }
        }

        next(); // Chuyển sang middleware tiếp theo
    } catch (error) {
        console.error("Error in middleware:", error); // In ra console lỗi nếu có
        res.status(500).json({ message: "Internal server error" }); // Trả về lỗi 500 nếu có lỗi xảy ra
    }
};
export const userStrictAuthenticationMiddleware = async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const AccessToken = req.cookies['a_token']; // Lấy access token từ cookie
        const RefresgToken = req.cookies['r_token']; // Lấy refresh token từ cookie

        if (AccessToken || RefresgToken) {
            const userA = await verifyToken(AccessToken, process.env.ACCESS_TOKEN_SECRET); // Xác thực access token
            // console.log(userA);
            if (userA) {
                req['verifyUser'] = userA; // Lưu thông tin người dùng vào request

                res.locals.verifyUser = userA; // Lưu thông tin người dùng vào response locals
                return next();
            } else if (RefresgToken) {
                const userR = await verifyToken(RefresgToken, process.env.REFRESH_TOKEN_SECRET); // Xác thực refresh token

                if (userR) {
                    const verifiedUser = await handleRefreshToken(userR, RefresgToken, res); // Xử lý refresh token

                    if (verifiedUser) {
                        req['verifyUser'] = verifiedUser; // Lưu thông tin người dùng vào request

                        res.locals.verifyUser = verifiedUser; // Lưu thông tin người dùng vào response locals
                        return next();
                    }
                } else {
                    clearCookie(res);
                }
            }
        }
        res.redirect("/login");
    } catch (e) {
        console.error("Error in middleware:", e);
        res.status(500).json({ message: "Internal server error" });
    }
};