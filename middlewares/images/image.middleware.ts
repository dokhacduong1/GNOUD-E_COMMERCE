
import { Request, Response, NextFunction } from "express";

// Hàm helper để kiểm tra xem yêu cầu có chứa header ngoại lệ nào không
const hasExceptionHeader = (req: Request, exceptionHeaders: string[]): boolean => 
  // Duyệt qua mảng exceptionHeaders, nếu có bất kỳ header nào trong yêu cầu thì trả về true
  exceptionHeaders.some(header => req.headers[header]);

// Hàm helper để kiểm tra xem yêu cầu có chứa user-agent ngoại lệ nào không
const hasForbiddenUserAgent = (req: Request, forbiddenAgents: string[]): boolean => {
  // Lấy user-agent từ yêu cầu, nếu không có thì gán là chuỗi rỗng
  const userAgent = req.headers['user-agent'] || '';
  // Duyệt qua mảng forbiddenAgents, nếu có bất kỳ agent nào trong user-agent thì trả về true
  return forbiddenAgents.some(agent => userAgent.toLowerCase().includes(agent.toLowerCase()));
};

// Middleware để kiểm tra yêu cầu
export const image = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Lấy host name từ yêu cầu
    const nameHost = req.headers.host;
    // Định nghĩa mảng các header ngoại lệ
    const exceptionHeaders : string[] = ["postman-token"];
    // Định nghĩa mảng các user-agent ngoại lệ
    const forbiddenUserAgents: string[] = ["googlebot", "bingbot", "yandexbot",'axios','postman','curl'];

    // Nếu header referer chứa host name và không có header ngoại lệ hoặc user-agent ngoại lệ thì cho phép yêu cầu
    if (req?.headers?.referer?.includes(nameHost) && !hasExceptionHeader(req, exceptionHeaders) && !hasForbiddenUserAgent(req, forbiddenUserAgents)) {
      next(); // Tiếp tục xử lý yêu cầu tiếp theo
      return;
    }

    // Nếu không thỏa mãn điều kiện, trả về lỗi 403
    res.status(403).render("errors/403", {
      text: "ERROR: ACCESS DENIED",
    });
  } catch (error) {
    // Nếu có lỗi xảy ra, log lỗi và trả về lỗi 500
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};