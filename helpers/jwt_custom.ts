import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export function generalJwtCustom(
    res: Response,
    data: any,
    secretKey: string,
    expiresIn: string, // Thời gian sống của token dưới dạng chuỗi (ví dụ: "10s", "5m", "2h", "1d")
    cookieName: string = "_session_cart", // Tên cookie, mặc định là "_session_cart"
    extraTokens: string[] = [] // Thay đổi thành mảng chuỗi
  ): void {
    const R_Token = jwt.sign(data, secretKey, {
      expiresIn, // Đặt thời gian sống của token
    });
  
    // Chuyển đổi thời gian sống của token sang giây để sử dụng trong Max-Age
    const timeUnit = expiresIn.slice(-1);
    const timeValue = parseInt(expiresIn.slice(0, -1), 10);
    let maxAgeInSeconds;
  
    switch (timeUnit) {
      case 's':
        maxAgeInSeconds = timeValue;
        break;
      case 'm':
        maxAgeInSeconds = timeValue * 60;
        break;
      case 'h':
        maxAgeInSeconds = timeValue * 60 * 60;
        break;
      case 'd':
        maxAgeInSeconds = timeValue * 60 * 60 * 24;
        break;
      default:
        throw new Error("Invalid time unit for expiresIn");
    }
  
    const cookies = [
      `${cookieName}=${R_Token}; HttpOnly; Path=/; Max-Age=${maxAgeInSeconds}; SameSite=Strict; Secure; Partitioned`
    ];
  
    // Thêm các phần tử của extraTokens vào mảng cookies
    extraTokens.forEach(token => {
      cookies.push(token);
    });
  
    res.setHeader("Set-Cookie", cookies);
  }
export function decodeJwtToken(
  token: string,
  secretKey: string
): object | null | any {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
   
    return null;
  }
}
