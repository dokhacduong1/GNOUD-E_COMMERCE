import { Router } from "express";
import * as controller from "../../controllers/clients/category.controller";

const router: Router = Router();

router.get("/:id", controller.index);

export const categoryRoutes: Router = router;