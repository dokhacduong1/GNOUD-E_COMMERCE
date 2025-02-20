import { Router } from "express";
import * as controller from "../../controllers/clients/registration.controller";
import * as validate from "../../validates/clients/registration.validate";


const router: Router = Router();


router.get("/",validate.getRegistration, controller.index);
router.post("/",validate.postRegistration,controller.registration_verify);
export const registrationRoutes: Router = router;
