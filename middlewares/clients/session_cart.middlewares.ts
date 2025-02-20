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
    let cart_code = req?.cookies?.cart_code || ""; // Lấy giá trị cart_code từ cookie

    const cart = await Cart.findOne({ where: { Cart_ID: cart_code }, raw: true }); // Tìm kiếm cart_code trong database

    // Kiểm tra nếu không có cart_code hoặc cart_code không tồn tại trong database
    if (
      !cart_code ||
      !cart
    ) {
      cart_code = uuidv4(); // Tạo một cart_code mới
      await Cart.create({ Cart_ID: cart_code }); // Lưu cart_code mới vào database

    }
    //Tinhs tong so luong san pham trong gio hang

    res.locals.quantityCart = await CartItems.sum('Quantity', {where: {Cart_ID: cart_code}})
    const maxAge = 360 * 24 * 60 * 60; // 360 ngày tính bằng giây
    const extraTokens = [
      `cart_code=${cart_code}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure; Partitioned`,
    ]; // Thiết lập cookie với các thuộc tính bảo mật

    res.setHeader("Set-Cookie", extraTokens);
    req["cart_code"] = cart_code;
    next();
  } catch (error) {
    console.error("Error in session_cart middleware:", error); // In ra console lỗi nếu có
    res.status(500).json({ message: "Internal server error" }); // Trả về lỗi 500 nếu có lỗi xảy ra
  }
};