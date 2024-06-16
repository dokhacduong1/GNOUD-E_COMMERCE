
import { Express } from "express";
import {homeRoutes} from "./home.routes"

const routes_client = (app: Express): void => {
    app.use("/", homeRoutes);
}
export default routes_client