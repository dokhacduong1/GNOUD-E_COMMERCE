import { Router } from "express";
import * as controller from "../../controllers/clients/home.controller";
import * as middleware from "../../middlewares/clients/session_cart.middlewares"
import * as middlewareAuthen from "../../middlewares/clients/authen.middlewares";
const router: Router = Router();

router.get("/",middlewareAuthen.authenMiddlewares, controller.index);

export const homeRoutes: Router = router;
