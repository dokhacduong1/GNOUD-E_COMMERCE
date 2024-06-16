import { Router } from "express";
import * as controller from "../../controllers/clients/home.controller";

const router: Router = Router();

router.get("/", controller.index);

export const homeRoutes: Router = router;
