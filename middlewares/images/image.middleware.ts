import { Request, Response, NextFunction } from "express";
import { decodeJwtToken } from "../../helpers/jwt_custom";

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

export const image = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    next();
    return ;

    const { cart_code, _session_cart: sessionCart } = req.cookies;

    const nameHost = req.headers.host;
    const refererHost = req.headers.referer ? new URL(req.headers.referer).host : null;
    if(refererHost !== nameHost){
        return res.status(403).render("errors/403", { text: "ERROR: ACCESS DENIED" });
    }
  

    const exceptionHeaders = ["postman-token"];
    const forbiddenUserAgents = [
      "googlebot", "bingbot", "yandexbot", "axios", "postman", "curl",
    ];

    const isInvalidJwt = !sessionCart || !isValidJwt(sessionCart, cart_code, process.env.SECRET_KEY_API_LOCK);
    const hasForbiddenReferrer = req?.headers?.referer?.includes(nameHost) === false;
    const hasExceptionOrForbiddenAgent = 
      hasExceptionHeader(req, exceptionHeaders) || hasForbiddenUserAgent(req, forbiddenUserAgents);

    if (isInvalidJwt || hasForbiddenReferrer || hasExceptionOrForbiddenAgent) {
      return res.status(403).render("errors/403", { text: "ERROR: ACCESS DENIED" });
    }

    next();
  } catch (error) {
    console.error("Error in image middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
