
import { Express } from "express";
import {dashboardRoutes} from "./dashboard.routes"
import {productRoutes} from "./product.routes"
import {categorieRoutes} from "./categorie.routes"
const prefix = 'admin';
const routes_admin = (app: Express): void => {
    app.use(`/${prefix}`, dashboardRoutes);
    app.use(`/${prefix}/products`, productRoutes);
    app.use(`/${prefix}/categories`, categorieRoutes);
}
export default routes_admin