import { Router } from "express";
import * as controller from "../../controllers/admins/product.controller";
import * as uploadToCustom from "../../middlewares/admins/upload_custom.middleware";
import * as validate from "../../validates/admin/product.validate";
const router: Router = Router();

router.get("/create", controller.getCreate);
router.get("/management-product", controller.index);

// [POST]
router.post("/create",validate.createProduct,uploadToCustom.upload_single_base64_products, controller.postCreate);

export const productRoutes: Router = router;
