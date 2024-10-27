import { Router } from "express";
import * as controller from "../../controllers/clients/category.controller";
import * as middleware from "../../middlewares/clients/session_cart.middlewares"
const router: Router = Router();

router.get("/:id",middleware.session_cart, controller.index);

export const categoryRoutes: Router = router;