import { Request, Response } from "express";

const prefix_client = "admins";
// [GET] /
export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.render(prefix_client + "/pages/dashboard/index", {
      title: "Dashboard",
    
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
