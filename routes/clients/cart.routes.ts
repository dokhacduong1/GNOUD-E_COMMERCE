import { Router } from "express";
import * as controller from "../../controllers/clients/cart.controller";
import * as middleware from "../../middlewares/clients/session_cart.middlewares"
const router: Router = Router();

router.get("/",middleware.session_cart, controller.index);

export const cartRoutes: Router = router;