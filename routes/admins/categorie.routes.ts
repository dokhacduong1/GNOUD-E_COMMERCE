import { Router } from "express";
import * as controller from "../../controllers/admins/categorie.controller";
import * as uploadToCloud from "../../middlewares/admins/upload_cloud.middleware";
import * as validate from "../../validates/admin/categorie.validate";
import multer from "multer";

const upload = multer();

const router: Router = Router();

router.get("/add-categorie", controller.addCategorie);
router.post(
  "/add-categorie",
  upload.single("image"),
  validate.createCategorie,
  uploadToCloud.upload_single,
  controller.createCategorie
);
export const categorieRoutes: Router = router;
