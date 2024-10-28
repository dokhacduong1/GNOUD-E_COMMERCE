import { Router } from "express";
import * as controller from "../../controller_api/client/search_api.controller";
import *  as middleware from "../../../../middlewares/clients/session_cart.middlewares";

const router: Router = Router();

router.get("/general/preview",middleware.session_cart, controller.index);
export const search_api_Routes: Router = router;