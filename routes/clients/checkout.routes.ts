import { Router } from "express";
import * as controller from "../../controllers/clients/checkout.controller";

const router: Router = Router();

router.get("/",controller.index);

export const checkoutRoutes: Router = router;
