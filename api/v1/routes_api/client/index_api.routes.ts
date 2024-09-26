import { Express } from "express";
import { category_api_Routes } from "./category_api.routes";
import { seacrh_api_Routes } from "./search_api.routes";
const routesClientVersion1 = (app: Express): void => {
    const version = "/api/v1/client";
    app.use(version + "/category", category_api_Routes);
    app.use(version + "/search",seacrh_api_Routes);
}
export default routesClientVersion1