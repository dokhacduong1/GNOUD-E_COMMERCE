import { Request, Response } from "express";
import CartItems from "../../../../models/cart_items.model";
import { ICartItemn } from "../../../../interfaces/clients/cart.interfaces";

export const addCart = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const cartCode = req.cookies.cart_code;
    const {quantityCart} =req.body

    const { Product_ID, Product_Option_ID, SizeProduct, Quantity, Price } =
      req.body;

    const [cartItem, created]: [ICartItemn | undefined, boolean] =
      (await CartItems.findOrCreate({
        where: {
          Product_ID,
          Cart_ID: cartCode,
          Product_Option_ID,
          SizeProduct,
        },
        defaults: {
          Cart_ID: cartCode,
          Product_ID: parseInt(Product_ID),
          Product_Option_ID: parseInt(Product_Option_ID),
          SizeProduct,
          Quantity,
          Price,
        },
      })) as any;

    if (cartItem) {
      if (!created) {
        await cartItem.update({
          Quantity: cartItem.Quantity + Quantity,
        });
      }
    }

    res.status(200).json({ code: 200, message: "success",quantity_cart:quantityCart });
  } catch (error) {
    console.error("Error in addCart middleware:", error);
    res.status(500).json({ message: "Error" });
  }
};
export const updateQuantity = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const cartCode = req.cookies.cart_code;
    const { idProduct, quantity,sizeProduct,idColorProduct,quantityCart } = req.body;

    await CartItems.update(
      { Quantity: quantity },
      { where: { Product_ID: idProduct, Cart_ID: cartCode,SizeProduct:sizeProduct,Product_Option_ID:idColorProduct } }
    );


    res.status(200).json({ code: 200, message: "success",quantity_cart:quantityCart });

  } catch (error) {
    console.error("Error in updateQuantity middleware:", error);
    res.status(500).json({ message: "Error" });
  }
};
export const deleteProduct = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const cartCode = req.cookies.cart_code;
    const { idProduct,sizeProduct,idColorProduct,quantityCart} = req.body;

    await CartItems.destroy(
      { where: { Product_ID: idProduct, Cart_ID: cartCode,SizeProduct:sizeProduct,Product_Option_ID:idColorProduct  } }
    );

    res.status(200).json({ code: 200, message: "success",quantity_cart:quantityCart });

  } catch (error) {
    console.error("Error in delete middleware:", error);
    res.status(500).json({ message: "Error" });
  }
};
