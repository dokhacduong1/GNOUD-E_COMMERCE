import { Router } from "express";
import * as controller from "../../controllers/admins/dashboard.controller";

const router: Router = Router();

router.get("/", controller.index);

export const dashboardRoutes: Router = router;
