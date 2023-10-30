import { Router } from "express";
import * as validators from './user.validation.js';
import { validation } from "../../middleware/validation.js";
import { getUser } from "./controller/getUser.js";
import { changePassword } from "./controller/changePassword.js";
import { changeEmail } from "./controller/changeEmail.js";
import { userEndPoint } from "./user.endPoint.js";
import { getAllUsers } from "./controller/getAllUsers.js";
import { auth } from "../../middleware/auth.js";
import { logout } from "./controller/logout.js";
import { updatePersonalInfo } from "./controller/updatePersonalInfo.js";
import { fileUpload, filesValidation } from "../../utils/multer.js";
const router = Router()

router.get('/getUser/:id',auth(userEndPoint.getUser),getUser)
router.get('/getAllUsers',auth(userEndPoint.getAllUser),getAllUsers)
router.patch('/changePassword',auth(userEndPoint.update),validation(validators.changePassword),changePassword)
router.patch('/changeEmail',auth(userEndPoint.update),validation(validators.changeEmail),changeEmail)
router.patch('/logout',auth(userEndPoint.update),logout)
router.put('/updateInfo',auth(userEndPoint.update),validation(validators.updateInfo) ,fileUpload(filesValidation.image).single('image'),updatePersonalInfo)

export default router