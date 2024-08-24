
import { Express } from "express";
import {homeRoutes} from "./home.routes"
import { productRoutes } from "./product.routes";

const routes_client = (app: Express): void => {
    app.use("/", homeRoutes);
    app.use("/product", productRoutes);
}
export default routes_client