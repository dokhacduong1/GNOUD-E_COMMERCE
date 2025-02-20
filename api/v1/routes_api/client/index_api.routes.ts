import { Express } from "express";
import { category_api_Routes } from "./category_api.routes";
import { search_api_Routes } from "./search_api.routes";
import { cart_api_Routes } from "./cart_api.routes";
import * as middleware_block_api from "../../middlewares_api/client/block_api.middlewares";
import {block_api} from "../../middlewares_api/client/block_api.middlewares";

const routesClientVersion1 = (app: Express): void => {
    const version = "/api/v1/client";
    app.use(block_api)
    app.use(version + "/category", category_api_Routes);
    app.use(version + "/search",search_api_Routes);
    app.use(version + "/carts",cart_api_Routes);

}
export default routesClientVersion1