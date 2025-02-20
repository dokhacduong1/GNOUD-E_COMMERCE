import {NextFunction, Request, Response} from "express";
import {handleRefreshToken} from "../../../../middlewares/clients/authen.middlewares";
import jwt from "jsonwebtoken";
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

                return next();
            } else if (RefresgToken) {
                const userR = await verifyToken(RefresgToken, process.env.REFRESH_TOKEN_SECRET); // Xác thực refresh token

                if (userR) {
                    const verifiedUser = await handleRefreshToken(userR, RefresgToken, res); // Xử lý refresh token

                    if (verifiedUser) {
                        req['verifyUser'] = verifiedUser; // Lưu thông tin người dùng vào request
                        return next();
                    }
                } else {
                    clearCookie(res);
                }
            }
        }
        res.status(401).json({ message: "Unauthorized",code:401 });

    } catch (e) {
        console.error("Error in middleware:", e);
        res.status(500).json({ message: "Internal server error" });
    }
};