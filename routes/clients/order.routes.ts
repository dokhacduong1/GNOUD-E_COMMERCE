import { Router } from "express";
import * as controller from "../../controllers/clients/order.controller";

import * as middlewareAuthen from "../../middlewares/clients/authen.middlewares";

const router: Router = Router();

router.get("/",middlewareAuthen.userStrictAuthenticationMiddleware, controller.index);

export const orderRoutes: Router = router;