import { Router } from "express";
import * as controller from "../../controllers/clients/my_page.controller";
import * as middlewareAuthen from "../../middlewares/clients/authen.middlewares";
import * as middlewareUpload from "../../middlewares/clients/upload_custom.middleware";
import * as middlewareCart from "../../middlewares/clients/session_cart.middlewares"
import * as validate from "../../validates/clients/my_page.validate";
import {managementAddress, patchEditAddress} from "../../controllers/clients/my_page.controller";
const router: Router = Router();

router.get("/",middlewareAuthen.userStrictAuthenticationMiddleware,middlewareCart.session_cart,controller.index);
router.get("/edit-profile",middlewareAuthen.userStrictAuthenticationMiddleware,middlewareCart.session_cart,controller.editProfile);
router.get("/change-password",middlewareAuthen.userStrictAuthenticationMiddleware,middlewareCart.session_cart,controller.changePassword);
router.get("/management-address",middlewareAuthen.userStrictAuthenticationMiddleware,middlewareCart.session_cart,controller.managementAddress);
router.get("/create-address",middlewareAuthen.userStrictAuthenticationMiddleware,middlewareCart.session_cart,controller.createAddress);
router.get("/edit-address/:id",middlewareAuthen.userStrictAuthenticationMiddleware,middlewareCart.session_cart,controller.editAddress);
//[POST]
router.post("/create-address",middlewareAuthen.userStrictAuthenticationMiddleware,validate.createAddress,controller.postCreateAddress);

//[PATCH]
router.patch("/edit-address/:id",middlewareAuthen.userStrictAuthenticationMiddleware,validate.createAddress,controller.patchEditAddress);
router.patch("/edit-profile",middlewareAuthen.userStrictAuthenticationMiddleware,validate.editProfile,middlewareUpload.upload_single_base64,controller.patchEditProfile);
router.patch("/change-password",middlewareAuthen.userStrictAuthenticationMiddleware,validate.changePassword,controller.patchChangePassword);
export const myPageRoutes: Router = router;