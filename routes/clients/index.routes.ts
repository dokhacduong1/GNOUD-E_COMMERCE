
import { Express } from "express";
import {homeRoutes} from "./home.routes"
import { productRoutes } from "./product.routes";
import { categoryRoutes } from "./category.routes";
import { searchProductRoutes } from "./search_product.routes";

const routes_client = (app: Express): void => {
    app.use("/", homeRoutes);
    app.use("/product", productRoutes);
    app.use("/category", categoryRoutes);
    app.use("/search", searchProductRoutes);
}
export default routes_client