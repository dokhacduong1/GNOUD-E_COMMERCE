import { Router } from "express";
import * as controller from "../../controller_api/client/cart_api.controller";
import * as validate from "../../validates_api/client/cart.validate";
import * as middlewareAuthen from "../../middlewares_api/client/authen_api.middlewares";
const router: Router = Router();

router.post("/add-cart",validate.addCart,middlewareAuthen.userStrictAuthenticationMiddleware, controller.addCart);
router.post("/update-quantity",validate.updateQuantity, controller.updateQuantity);
router.post("/delete-product",validate.deleteProduct, controller.deleteProduct);

export const cart_api_Routes: Router = router;