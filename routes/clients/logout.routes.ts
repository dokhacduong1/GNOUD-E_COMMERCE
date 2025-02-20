import { Router } from "express";
import * as controller from "../../controllers/clients/logout.controller";


const router: Router = Router();


router.get("/", controller.index);


export const logoutRoutes: Router = router;
