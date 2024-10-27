import { Router } from "express";
import * as controller from "../../controller_api/client/search_api.controller";
import *  as middleware from "../../../../middlewares/clients/session_cart.middlewares";
import * as middleware_block_api from "../../middlewares_api/client/block_api.middlewares";
const router: Router = Router();
router.get("/general/preview",middleware.session_cart,middleware_block_api.block_api, controller.index);
export const seacrh_api_Routes: Router = router;