import { Request, Response, NextFunction } from "express";
import Product from "../../../../models/product.model";
import ProductOption from "../../../../models/product_options.model";
import {
  IProduct,
  IProductOption,
} from "../../../../interfaces/clients/product.interfaces";
import CartItems from "../../../../models/cart_items.model";
import { ICartItemn } from "../../../../interfaces/clients/cart.interfaces";
import { validateRequiredFields } from "../../helpers_api/validate_required_fields";

export const addCart = async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {

    const { Product_ID, Product_Option_ID, SizeProduct, Quantity } = req.body;
    const cartMaxItems = req.app.locals.webOptions.CartMaxItems;

    // Kiểm tra các trường bắt buộc
    const requiredFields = [
      { field: Product_ID, message: "送信したデータにエラーが発生しました。" },
      {
        field: Product_Option_ID,
        message: "送信したデータにエラーが発生しました。",
      },
      { field: SizeProduct, message: "送信したデータにエラーが発生しました。" },
      {
        field: Quantity,
        message: `数量は必須であり、0 より大きく ${cartMaxItems} 未満である必要があります`,
        validate: (value: number) => value > 0 && value <= cartMaxItems,
      },
    ];

    if (!validateRequiredFields(requiredFields, res)) {
      return;
    }

    // Kiểm tra sự tồn tại của sản phẩm và tùy chọn sản phẩm
    const [findProduct, findProductOption,findCartItemQuantity] = await Promise.all([
      Product.findOne({
        where: { ID: Product_ID },
        raw: true,
      }) as unknown as IProduct,
      ProductOption.findOne({
        where: { ID: Product_Option_ID, Product_ID: Product_ID },
        raw: true,
      }) as unknown as IProductOption,
      CartItems.findOne({
        where: {
          Product_ID,
          Cart_ID: req.cookies.cart_code,
          Product_Option_ID,
          SizeProduct,
        },
        raw: true,
      }) as unknown as ICartItemn,

    ]);
    
    if (!findProduct) {
      res.status(404).json({ code: 404, message: "商品が見つかりません。" });
      return;
    }

    if (!findProductOption) {
      res
        .status(404)
        .json({ code: 404, message: "製品オプションが見つかりません。" });
      return;
    }
    if(findCartItemQuantity){
      if(findCartItemQuantity.Quantity + Quantity > cartMaxItems){
        res.status(404).json({ code: 404, message: `カート内の商品は ${cartMaxItems} 未満である必要があります` });
        return;
      }
    }

    const listOptionSize = JSON.parse(
      findProductOption.List_Options.toString()
    );

    if (
      listOptionSize.findIndex((item: any) => item.size === SizeProduct) === -1
    ) {
      res.status(404).json({ code: 404, message: "サイズが見つかりません。" });
      return;
    }
    //Neu thay size co stock = 0 thi tra ve loi
    if (
      listOptionSize.findIndex(
        (item: any) => item.size === SizeProduct && item.stock === 0
      ) !== -1
    ) {
      res.status(404).json({ code: 404, message: "この製品はもう入手できません。" });
      return;
    }
    req.body.Price = parseFloat(findProduct.Price.toString());

    next();
  } catch (error) {
    console.error("Error in addCart middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { idProduct, quantity, idColorProduct } = req.body;
    const cartMaxItems = req.app.locals.webOptions.CartMaxItems;

    const requiredFields = [
      { field: idProduct, message: "送信したデータにエラーが発生しました。" },
      {
        field: idColorProduct,
        message: "送信したデータにエラーが発生しました。",
      },
      {
        field: quantity,
        message: `数量は必須であり、0 より大きく ${cartMaxItems} 未満である必要があります`,
        validate: (value: number) => value > 0 && value <= cartMaxItems,
      },
    ];

    if (!validateRequiredFields(requiredFields, res)) {
      return;
    }

    const [findProduct, findProductInCartItems, findProductOption] =
      await Promise.all([
        Product.findOne({
          where: { ID: idProduct },
          raw: true,
        }) as unknown as IProduct,
        CartItems.findOne({
          where: { Product_ID: idProduct, Cart_ID: req.cookies.cart_code },
          raw: true,
        }) as unknown as ICartItemn,
        ProductOption.findOne({
          where: { ID: idColorProduct, Product_ID: idProduct },
          raw: true,
        }) as unknown as IProductOption,
      ]);

    if (!findProduct) {
      res.status(404).json({ code: 404, message: "商品が見つかりません。" });
      return;
    }

    if (!findProductInCartItems) {
      res
        .status(404)
        .json({ code: 404, message: "カート内に商品が見つかりません。" });
      return;
    }

    if (!findProductOption) {
      res
        .status(404)
        .json({ code: 404, message: "製品オプションが見つかりません。" });
      return;
    }
    next();
  } catch (error) {
    console.error("Error in updateQuantity middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { idProduct, sizeProduct, idColorProduct } = req.body;

    const requiredFields = [
      { field: idProduct, message: "送信したデータにエラーが発生しました。" },
      { field: sizeProduct, message: "送信したデータにエラーが発生しました。" },
      {
        field: idColorProduct,
        message: "送信したデータにエラーが発生しました。",
      },
    ];
    if (!validateRequiredFields(requiredFields, res)) {
      return;
    }

    const [findProduct, findProductOption] = await Promise.all([
      Product.findOne({
        where: { ID: idProduct },
        raw: true,
      }) as unknown as IProduct,
      ProductOption.findOne({
        where: { ID: idColorProduct },
        raw: true,
      }) as unknown as IProductOption,
    ]);
    if (!findProduct) {
      res.status(404).json({ code: 404, message: "商品が見つかりません。" });
      return;
    }
    if (!findProductOption) {
      res
        .status(404)
        .json({ code: 404, message: "品オプションが見つかりません。" });
      return;
    }
    next();
  } catch (error) {
    console.error("Error in delete middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
