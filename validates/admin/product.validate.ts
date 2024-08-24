import { Request, Response, NextFunction } from "express";
import Product from "../../models/product.model";

export const createProduct = async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Khai báo interface cho dữ liệu sản phẩm từ yêu cầu
      interface RequestProducts {
        title: string;
        category_id: number;
        discount: string;
        featured: string;
        options: Array<any>;
        price: number;
        description: string;
        product_information: Array<any>;
        size_specifications: Array<any>;
      }
  
      // Lấy dữ liệu từ yêu cầu
      const {
        title,
        category_id,
        options,
        price,
        description,
      }: RequestProducts = req.body;
  
      // Hàm gửi lỗi với thông báo cụ thể
      const sendError = (message: string) => res.status(400).json({ message });
      
      // Kiểm tra các trường dữ liệu cần thiết
      if (!title) return sendError("Title is required");
      if (!category_id) return sendError("Category is required");
      if (!price) return sendError("Price is required");
      if (!description) return sendError("Description is required");
      if (!options) return sendError("Options is required");

      // Kiểm tra các trường dữ liệu trong mảng options
      if (options.some(item => !item.title)) return sendError("Title option is required");
      if (options.some(item => item.color.length < 1)) return sendError("Color is required");
      if (options.some(item => item.listImages.length < 1)) return sendError("ListImages is required");
      if (options.some(item => item.stock && item.stock < 1)) return sendError("Stock is required");
      
      // Kiểm tra các trường dữ liệu trong mảng listOptions của mỗi item trong options
      if (options.some(item => item.listOptions && item.listOptions.some(option => !option.size || option.stock < 1))) {
        return sendError("Key list option and stock are required");
      }
      
      // Nếu không có lỗi, chuyển đến middleware tiếp theo
      next();
    } catch (error) {
      // Nếu có lỗi ngoại lệ, in lỗi và gửi phản hồi với mã lỗi 500
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


  export const changeStatus = async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      enum Status {
        ACTIVE = "active",
        INACTIVE = "inactive",
      }
  
      const status: Status = req.params.status as Status;
      const id: number = parseInt(req.params.id);
      if (!Object.values(Status).includes(status)) {
        req.flash("error", "Invalid status");
        res.redirect("back");
        return;
      }
      if (!id) {
        req.flash("error", "Invalid ID");
        res.redirect("back");
        return;
      }
      const recordCheck = await Product.findByPk(id,{
        raw: true,
      });
      if (!recordCheck) {
        req.flash("error", "Record not found");
        res.redirect("back");
        return;
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  export const editProduct = async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Khai báo interface cho dữ liệu sản phẩm từ yêu cầu
      interface RequestProducts {
        title: string;
        category_id: number;
        discount: string;
        featured: string;
        options: Array<any>;
        price: number;
        description: string;
        product_information: Array<any>;
        size_specifications: Array<any>;
      }
  
      // Lấy dữ liệu từ yêu cầu
      const {
        title,
        category_id,
        options,
        price,
        description,
      }: RequestProducts = req.body;
  
      // Hàm gửi lỗi với thông báo cụ thể
      const sendError = (message: string) => res.status(400).json({ message });
      
      // Kiểm tra các trường dữ liệu cần thiết
      if (!title) return sendError("Title is required");
      if (!category_id) return sendError("Category is required");
      if (!price) return sendError("Price is required");
      if (!description) return sendError("Description is required");
      if (!options) return sendError("Options is required");

      // Kiểm tra các trường dữ liệu trong mảng options
      if (options.some(item => !item.title)) return sendError("Title option is required");
      if (options.some(item => item.color.length < 1)) return sendError("Color is required");
      if (options.some(item => item.listImages.length < 1)) return sendError("ListImages is required");
      if (options.some(item => item.stock && item.stock < 1)) return sendError("Stock is required");
      
      // Kiểm tra các trường dữ liệu trong mảng listOptions của mỗi item trong options
      if (options.some(item => item.listOptions && item.listOptions.some(option => !option.size ))) {
        return sendError("Key list option and stock are required");
      }
      
      // Nếu không có lỗi, chuyển đến middleware tiếp theo
      next();
    } catch (error) {
      // Nếu có lỗi ngoại lệ, in lỗi và gửi phản hồi với mã lỗi 500
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };