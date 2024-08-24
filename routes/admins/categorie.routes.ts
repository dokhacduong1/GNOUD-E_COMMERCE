import { Router } from "express";
import * as controller from "../../controllers/admins/categorie.controller";
import * as uploadToCloud from "../../middlewares/admins/upload_cloud.middleware";
import * as validate from "../../validates/admin/categorie.validate";
import multer from "multer";

const upload = multer();

const router: Router = Router();
//[GET]
router.get("/management", controller.index);
router.get("/create", controller.getCreate);
router.get("/delete-categorie/:id", controller.deleteCategory);
router.get("/edit/:id",controller.getEdit);
router.get("/reload-count",controller.reloadCount)

//[POST]
router.post(
  "/create",
  upload.single("image"),
  validate.createCategorie,
  uploadToCloud.upload_single,
  controller.postCreate
);

//[PATCH]
router.patch("/change-status/:status/:id",validate.changeStatus, controller.changeStatus);
router.patch("/change-multi",controller.changeMulti)
router.patch("/edit/:id",upload.single("image"),validate.editCategorie,uploadToCloud.upload_single,controller.patchEdit)

export const categorieRoutes: Router = router;
