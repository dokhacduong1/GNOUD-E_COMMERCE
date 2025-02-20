import { Router } from "express";
import * as controller from "../../controllers/clients/product.controller";

import * as middlewareAuthen from "../../middlewares/clients/authen.middlewares";
const router: Router = Router();
router.use(middlewareAuthen.authenMiddlewares);
router.get("/:slug", controller.index);

export const productRoutes: Router = router;
