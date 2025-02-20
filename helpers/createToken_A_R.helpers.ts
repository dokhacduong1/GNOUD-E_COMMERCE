import jwt from "jsonwebtoken";
import RefreshTokens from "../models/RefreshTokens.model";
import { Response } from "express";
import ms from "ms";

interface recordNew {
    fullName: string,
    email: string,
    id: string,
    sex: string
}

const REFRESH_TOKEN_EXPIRATION = "30d"; // 30 days
const ACCESS_TOKEN_EXPIRATION = "1m"; // 1 hour

export async function createA_R_Token(res: Response, record: any, tokenID: string = "",cart_code:string=""): Promise<void> {
    // Tạo refresh token mới

    const newRefreshToken = jwt.sign(record, process.env.REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
    // Tạo access token mới
    const newAccessToken = jwt.sign(record, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });


    if (tokenID) {
        // Cập nhật token cũ là đã bị thu hồi
        await RefreshTokens.update({ Is_Revoked: true }, { where: { ID: tokenID } });
    }

    // Tạo một bản ghi token mới trong cơ sở dữ liệu
    await RefreshTokens.create({
        User_ID: record.id,
        Token: newRefreshToken,
        ExpiresAt: new Date(Date.now() + ms(REFRESH_TOKEN_EXPIRATION)),
        Is_Revoked: false,
    });
    let listCookie = [
        `r_token=${newRefreshToken}; HttpOnly; Path=/; Max-Age=${ms(REFRESH_TOKEN_EXPIRATION) / 1000}; SameSite=None; Secure; Partitioned`,
        `a_token=${newAccessToken}; HttpOnly; Path=/; Max-Age=${ms(ACCESS_TOKEN_EXPIRATION) / 1000}; SameSite=None; Secure; Partitioned`,
    ]
    if(cart_code){
        listCookie.push(`cart_code=${cart_code}; HttpOnly; Path=/; Max-Age=${ms(ACCESS_TOKEN_EXPIRATION) / 1000}; SameSite=Lax; Secure; Partitioned`)
    }
    // Đặt cookie cho token mới
    res.setHeader("Set-Cookie",listCookie );

    return;
}

export async function createA_R_Token_Api(res: Response, record: any, tokenID: string = ""): Promise<void> {

    const newRefreshToken = jwt.sign(record, process.env.REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
    // Tạo access token mới
    const newAccessToken = jwt.sign(record, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });


    if (tokenID) {
        // Cập nhật token cũ là đã bị thu hồi
        await RefreshTokens.update({ Is_Revoked: true }, { where: { ID: tokenID } });
    }

    // Tạo một bản ghi token mới trong cơ sở dữ liệu
    await RefreshTokens.create({
        User_ID: record.id || record["ID"],
        Token: newRefreshToken,
        ExpiresAt: new Date(Date.now() + ms(REFRESH_TOKEN_EXPIRATION)),
        Is_Revoked: false,
    });
    // Đặt cookie cho token mới
    res.setHeader("Set-Cookie", [
        `r_token=${newRefreshToken}; HttpOnly; Path=/; Max-Age=${ms(REFRESH_TOKEN_EXPIRATION) / 1000}; SameSite=None; Secure; Partitioned`,
        `a_token=${newAccessToken}; HttpOnly; Path=/; Max-Age=${ms(ACCESS_TOKEN_EXPIRATION) / 1000}; SameSite=None; Secure; Partitioned`,
    ]);


}