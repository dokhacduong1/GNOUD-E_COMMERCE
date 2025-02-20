import { Router } from "express";
import * as controller from "../../controllers/clients/category.controller";

import * as middlewareAuthen from "../../middlewares/clients/authen.middlewares";
const router: Router = Router();
router.use(middlewareAuthen.authenMiddlewares);
router.get("/:id", controller.index);

export const categoryRoutes: Router = router;