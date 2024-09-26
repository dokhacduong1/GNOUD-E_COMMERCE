
import { Express } from "express";
import {homeRoutes} from "./home.routes"
import { productRoutes } from "./product.routes";
import { categoryRoutes } from "./category.routes";

const routes_client = (app: Express): void => {
    app.use("/", homeRoutes);
    app.use("/product", productRoutes);
    app.use("/category", categoryRoutes);
}
export default routes_client