import { Router } from "express";
import * as controller from "../../controllers/clients/cart.controller";

import * as middlewareAuthen from "../../middlewares/clients/authen.middlewares";

const router: Router = Router();

router.get("/",middlewareAuthen.userStrictAuthenticationMiddleware, controller.index);

export const cartRoutes: Router = router;