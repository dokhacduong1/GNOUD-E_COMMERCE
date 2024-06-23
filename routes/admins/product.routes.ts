import { Router } from "express";
import * as controller from "../../controllers/admins/product.controller";

const router: Router = Router();

router.get("/add-product", controller.addProduct);
router.get("/management-product", controller.addProduct);
export const productRoutes: Router = router;
