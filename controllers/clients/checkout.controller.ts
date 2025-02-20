import { Request, Response } from "express";

import ProductPreview from "../../models/product_preview.model";
const prefix_client = "clients";
// [GET] /
export const index = async function (
    req: Request,
    res: Response
): Promise<void> {
    try {


        res.render(prefix_client + "/pages/checkout/index", {
            title: "checkout",

        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
