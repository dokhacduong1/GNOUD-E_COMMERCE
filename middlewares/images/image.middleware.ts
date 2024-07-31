import { Request, Response, NextFunction } from "express";

export const image = async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const nameHost = req.headers.host;
    // next();
    if (req?.headers?.referer?.includes(nameHost)) {
      next();
      return;
    }
    res.status(403).render("errors/403", {
      text: "ERROR: ACCESS DENIED",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
