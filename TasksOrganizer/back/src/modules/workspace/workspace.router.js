import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { deleteMember } from "./controller/deleteMember.js";
import { workspaceEndPoint } from "./workspace.endPoint.js";
import { create } from "../commonController/create.js";
import { fileUpload, filesValidation } from "../../utils/multer.js";
import { update } from "../commonController/update.js";
import { get } from "../commonController/get.js";
import deleteMemberController from "../commonController/deleteMember.js";
import addMemberController from "../commonController/addMember.js";
const router = Router();

router.get("/", auth(workspaceEndPoint.getWorkSpace), get);

router.post(
  "/",
  auth(workspaceEndPoint.AddWorkSpace),
  fileUpload(filesValidation.image).fields([
    { name: "coverImages", maxCount: 5 },
  ]),
  create
);

router.put(
  "/:id",
  auth(workspaceEndPoint.UpdateWorkSpace),
  fileUpload(filesValidation.image).fields([
    { name: "coverImages", maxCount: 5 },
  ]),
  update
);

router.delete(
  "/delete-member/:id",
  auth(workspaceEndPoint.deleteMember),
  deleteMemberController
);

router.patch(
  "/add-member/:id",
  auth(workspaceEndPoint.addMember),
  addMemberController
);

export default router;
