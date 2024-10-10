import { Router } from "express";
import * as controller from "../../controllers/clients/search_product.controller";

const router: Router = Router();

router.get("/:id", controller.index);

export const searchProductRoutes: Router = router;
