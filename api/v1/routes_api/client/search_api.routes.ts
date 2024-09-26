import { Router } from "express";
import * as controller from "../../controller_api/client/search_api.controller";

const router: Router = Router();
router.get("/general/preview", controller.index);
export const seacrh_api_Routes: Router = router;