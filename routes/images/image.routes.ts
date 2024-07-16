import { Router } from "express";
import * as controller from "../../controllers/images/image.controller";

const router: Router = Router();

router.get("/item/:key/:id", controller.image);

export const imageRoutes: Router = router;
