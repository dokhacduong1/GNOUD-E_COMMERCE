import { Router } from "express";
import * as controller from "../../controllers/clients/product.controller";
import * as middleware from "../../middlewares/clients/session_cart.middlewares"
const router: Router = Router();

router.get("/:slug",middleware.session_cart, controller.index);

export const productRoutes: Router = router;
