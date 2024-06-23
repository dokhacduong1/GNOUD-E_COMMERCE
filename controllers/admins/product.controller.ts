import { Request, Response } from "express";

const prefix_client = "admins";
// [GET] /
export const addProduct = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.render(prefix_client + "/pages/products/add-product", {
      title: "Dashboard",
    
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
