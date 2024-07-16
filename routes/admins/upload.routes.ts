import { Router } from "express";
import * as controller from "../../controllers/admins/upload.controller";
import multer from "multer";
const router: Router = Router();
const upload = multer();

router.post(
  "/multi-image",
  upload.array("multiple"),
  upload.single("single"),
  controller.multiImage
);

export const uploadRoutes: Router = router;
