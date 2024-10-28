import { Router } from "express";
import * as controller from "../../controller_api/client/cart_api.controller";
import * as validate from "../../validates_api/client/cart.validate";
import *  as middleware_session from "../../../../middlewares/clients/session_cart.middlewares";
const router: Router = Router();
router.use(middleware_session.session_cart);
router.post("/add-cart",validate.addCart, controller.addCart);
router.post("/update-quantity",validate.updateQuantity, controller.updateQuantity);
router.post("/delete-product",validate.deleteProduct, controller.deleteProduct);

export const cart_api_Routes: Router = router;