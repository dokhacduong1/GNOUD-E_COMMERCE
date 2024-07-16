
import { Express } from "express";
import { imageRoutes } from "./image.routes";
import * as middleware from "../../middlewares/images/image.middleware";

const routes_images = (app: Express): void => {
    app.use("/images",middleware.image,imageRoutes);
}
export default routes_images