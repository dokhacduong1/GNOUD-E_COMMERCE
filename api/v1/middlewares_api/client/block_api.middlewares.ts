import { Request, Response, NextFunction } from "express";
import { decodeJwtToken } from "../../../../helpers/jwt_custom";
import Cart from "../../../../models/cart.model";
import { Op } from "sequelize";
// Hàm helper để kiểm tra xem yêu cầu có chứa header ngoại lệ nào không
const hasExceptionHeader = (
  req: Request,
  exceptionHeaders: string[]
): boolean => exceptionHeaders.some((header) => req.headers[header]);

// Hàm helper để kiểm tra xem yêu cầu có chứa user-agent ngoại lệ nào không
const hasForbiddenUserAgent = (
  req: Request,
  forbiddenAgents: string[]
): boolean => {
  const userAgent = req.headers["user-agent"] || "";
  return forbiddenAgents.some((agent) =>
    userAgent.toLowerCase().includes(agent.toLowerCase())
  );
};

// Hàm helper để kiểm tra JWT
const isValidJwt = (
  seesionCart: string,
  cart_code: string,
  secretKey: string
): boolean => {
  const decoded = decodeJwtToken(seesionCart, secretKey);
  return decoded && decoded.cart_code && decoded.cart_code === cart_code;
};

export const block_api = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    const { cart_code} = req.cookies;
    const nameHost = req.headers.host;
    const refererHost = req.headers.referer
      ? new URL(req.headers.referer).host
      : null;

    const exceptionHeaders = [
      "postman-token",
      "x-requested-with", // Thường được sử dụng bởi Ajax requests

    ];
    const forbiddenUserAgents = [
      "googlebot", // Google Bot
      "bingbot", // Bing Bot
      "yandexbot", // Yandex Bot
      "axios", // Thư viện Axios
      "postman", // Postman
      "curl", // Công cụ dòng lệnh cURL
      "slurp", // Yahoo! Slurp
      "DuckDuckBot", // DuckDuckGo Bot
      "Baiduspider", // Baidu Bot
      "Sogou", // Sogou Bot
      "Exabot", // Exabot
      "facebot", // Facebook Bot
      "ia_archiver", // Internet Archive
      "wget", // Trình tải xuống
      "http.client", // Python HTTP client
      "python-requests", // Thư viện Requests trong Python
      "Ruby", // Scripts Ruby
      "HTTrack", // Công cụ sao chép website
      "Google Analytics", // Công cụ phân tích Google
      "New Relic", // Giám sát hiệu suất
      "Pingdom", // Công cụ giám sát website
      "WebScraper", // Một số scraper tự động
      "BingPreview", // Bing Preview Tool
      "api", // Một số yêu cầu từ API
    ];

    const isInvalidCart = await Cart.findOne({
      where: {
        Cart_ID: cart_code,
        User_ID: { [Op.ne]: null }, // Kiểm tra User_ID khác null
      },
      raw: true, // Lấy kết quả dạng plain object
    });



    const hasForbiddenReferrer = refererHost && refererHost !== nameHost;
    const hasExceptionOrForbiddenAgent =
      hasExceptionHeader(req, exceptionHeaders) ||
      hasForbiddenUserAgent(req, forbiddenUserAgents);

    if ( hasForbiddenReferrer || hasExceptionOrForbiddenAgent) {
      res.send("");
      return;
    }

    next();
  } catch (error) {
    console.error("Error in image middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
