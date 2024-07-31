import { Router } from "express";
import * as controller from "../../controllers/admins/product.controller";
import * as uploadToCustom from "../../middlewares/admins/upload_custom.middleware";
import * as validate from "../../validates/admin/product.validate";
const router: Router = Router();

router.get("/create", controller.getCreate);
router.get("/management-product", controller.index);
router.get("/delete/:id", controller.deleteProduct);
router.get("/edit/:id",controller.getEdit);


// [POST]
router.post("/create",validate.createProduct,uploadToCustom.upload_single_base64_products, controller.postCreate);

//[PATCH]
router.patch("/change-status/:status/:id",validate.changeStatus, controller.changeStatus);
router.patch("/change-multi",controller.changeMulti)
router.patch("/edit/:id",validate.editProduct,uploadToCustom.upload_single_base64_products_edit,controller.patchEdit)

export const productRoutes: Router = router;
