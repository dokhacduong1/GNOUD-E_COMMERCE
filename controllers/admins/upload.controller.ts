import { Request, Response } from "express";

const prefix_client = "admins";
// [POST] /
export const multiImage = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {

    res.json("Upload success");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
