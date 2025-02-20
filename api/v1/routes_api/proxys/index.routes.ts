
import { Express } from "express";

import * as middleware from "../../../../middlewares/images/image.middleware";
import {locationRoutes} from "./location.routes";

const routesProxyVersion1 = (app: Express): void => {
    const version = "/api/v1/";
    app.use(version + "locations",locationRoutes);
}
export default routesProxyVersion1