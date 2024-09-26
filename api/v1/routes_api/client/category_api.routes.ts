import { Router } from "express";
import * as controller from "../../controller_api/client/category_api.controller";

const router: Router = Router();
router.get("/get_size/:id", controller.getSizeProduct);
export const category_api_Routes: Router = router;