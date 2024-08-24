import { Router } from "express";
import * as controller from "../../controllers/clients/product.controller";

const router: Router = Router();

router.get("/:slug", controller.index);

export const productRoutes: Router = router;
