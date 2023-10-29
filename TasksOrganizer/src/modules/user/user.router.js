import { auth } from '../../middleware/authentication.js';
import { validation } from '../../middleware/validate.js';
import * as validators from '../auth/controller/validate.js';
import * as userController from './controller/user.js'
import { Router } from "express";
const router = Router();


router.put("/changePassword", validation(validators.changePassword), auth, userController.changePassword);
router.get("/getUserData", auth, userController.getUserData);
router.put("/updateUser", validation(validators.updateUser), auth, userController.updateUser);
router.delete("/deleteUser", validation(validators.validAuthorization), auth, userController.deleteUser);
router.put("/softDeleteUser", validation(validators.validAuthorization), auth, userController.softDeleteUser);
router.post("/logOut", validation(validators.validAuthorization), auth, userController.logOutUser);
router.get("/myTasks", validation(validators.validAuthorization), auth, userController.myTasks);


export default router;