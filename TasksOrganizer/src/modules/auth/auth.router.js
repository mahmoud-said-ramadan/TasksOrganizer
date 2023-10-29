// import { validate } from 'express-validation';
import * as authController from './controller/auth.js'
import { Router } from "express";
import * as validators from './controller/validate.js';
import  {validation} from '../../middleware/validate.js';

const router = Router();


router.post("/signUp", validation(validators.signUp), authController.signUp);
router.get("/confirmEmail/:token", authController.confirmEmail);
router.get("/newConfirmEmail/:token", authController.newConfirmEmail);
router.post("/logIn", validation(validators.logIn), authController.logIn);
router.get("/unsubscribe/:token", authController.unsubscribe);
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
router.get("/assignmentEmail", authController.assignmentEmail);
router.get("/tray", authController.tray);




export default router;