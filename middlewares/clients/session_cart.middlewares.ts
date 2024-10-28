import {NextFunction, Request, Response} from "express"; // Import các kiểu dữ liệu từ express
import {v4 as uuidv4} from "uuid"; // Import hàm uuidv4 từ thư viện uuid để tạo mã UUID
import Cart from "../../models/cart.model"; // Import model Cart từ thư mục models
import {decodeJwtToken, generalJwtCustom} from "../../helpers/jwt_custom";
import CartItems from "../../models/cart_items.model";

export const session_cart = async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let cart_code = req.cookies.cart_code; // Lấy giá trị cart_code từ cookie
    const sessionCartToken = req.cookies._session_cart; // Lấy giá trị _session_cart từ cookie
    const secretKey = process.env.SECRET_KEY_API_LOCK; // Lấy giá trị secret key từ biến môi trường

    // Kiểm tra nếu không có cart_code hoặc cart_code không tồn tại trong database
    if (
      !cart_code ||
      !(await Cart.findOne({ where: { Cart_ID: cart_code }, raw: true }))
    ) {
      cart_code = uuidv4(); // Tạo một cart_code mới
      await Cart.create({ Cart_ID: cart_code }); // Lưu cart_code mới vào database
      console.log("New cart_code created and set in cookie:", cart_code); // In ra console thông báo tạo cart_code mới
    }

    const maxAge = 360 * 24 * 60 * 60; // 360 ngày tính bằng giây
    const extraTokens = [
      `cart_code=${cart_code}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict; Secure; Partitioned`,
    ]; // Thiết lập cookie với các thuộc tính bảo mật

    // Kiểm tra nếu token vẫn hợp lệ (còn hạn)
    const decodedToken = decodeJwtToken(sessionCartToken, secretKey); // Giải mã token
    const quantityCart = await CartItems.sum('Quantity', {where: {Cart_ID: cart_code}});
    res.locals.quantityCart = quantityCart;
    req.body.quantityCart = quantityCart;
    if (decodedToken && decodedToken.cart_code === cart_code) {
      next(); // Nếu token hợp lệ, chuyển sang middleware tiếp theo
      return;
    }
    //lấy tổng quantity của các sản phẩm trong giỏ hàng



    // Tạo token mới và thiết lập cookie
    generalJwtCustom(
      res,
      { cart_code },
      secretKey,
      "15m",
      "_session_cart",
      extraTokens
    );

    next(); // Chuyển sang middleware tiếp theo
  } catch (error) {
    console.error("Error in session_cart middleware:", error); // In ra console lỗi nếu có
    res.status(500).json({ message: "Internal server error" }); // Trả về lỗi 500 nếu có lỗi xảy ra
  }
};