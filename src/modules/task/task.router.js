import { auth } from '../../middleware/authentication.js';
import { validation } from '../../middleware/validate.js';
import * as validators from '../auth/controller/validate.js';
import * as taskController from './controller/task.js'
import { Router } from "express";
const router = Router();


router.post("/addTask", validation(validators.addTask), auth, taskController.addTask)
router.put("/updateTask", validation(validators.updateTask), auth, taskController.updateTask)
router.delete("/deleteTask", validation(validators.deleteTask), auth, taskController.deleteTask)
router.get("/allTasks", taskController.allTasks)
router.get("/tasksOfOneUser/:userId", taskController.tasksOfOneUser)
router.get("/lateTasks", taskController.lateTasks)


export default router;