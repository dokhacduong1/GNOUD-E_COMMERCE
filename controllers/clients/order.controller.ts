import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../../configs/database";
import { ICartItemn } from "../../interfaces/clients/cart.interfaces";
import { LinkImageConverter } from "../../helpers/convertLinkImage";

const prefix_client = "clients"; // Đặt prefix cho client

export const index = async function (
    req: Request,
    res: Response
): Promise<void> {
    try {
        const cartCode = req.cookies.cart_code;

        if (!cartCode) {
            res.status(400).json({ message: "Cart code is missing" });
            return;
        }

        const query = `
      SELECT 
          p.ID,
          p.Title,
          p.Slug,
          ci.Price,
          ci.SizeProduct,
          ci.Product_Option_ID,
          ci.Quantity,
          po.Title AS TitleColor,
          (SELECT pi.ImageURL 
            FROM product_sql.productimages pi 
            WHERE pi.Option_ID = ci.Product_Option_ID 
            ORDER BY ID ASC
            LIMIT 1) AS ImageLink,
           SUM(ci.Price * ci.Quantity) OVER() AS TotalCartPrice -- Calculates the total price for all items in the cart
      FROM 
          product_sql.cartitems ci
      JOIN 
          product_sql.products p
          ON ci.Product_ID = p.ID
      JOIN 
          product_sql.productoptions po
          ON ci.Product_Option_ID = po.ID
      WHERE 
          ci.Cart_ID = :cartCode;
    `;

        const cartItems = (await sequelize.query(query, {
            replacements: { cartCode },
            type: QueryTypes.SELECT,
        })) as unknown as ICartItemn[];

        const sumQuantity = cartItems.reduce((sum, item) => sum + item.Quantity, 0);
        const sumAllPrice = cartItems.reduce(
            (sum, item) => sum + item.Price * item.Quantity,
            0
        );
        cartItems.forEach((item) => {
            item.ImageLink = LinkImageConverter(item.ImageLink, 400, 400);
            item.sumPrice = item.Price * item.Quantity;
        });

        const priceShip = sumAllPrice < 1500 ? 500 : 0;

        res.render(`${prefix_client}/pages/order/index`, {
            title: "注文",
            sumQuantity,
            sumAllPrice,
            priceShip,
            cartItems,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
