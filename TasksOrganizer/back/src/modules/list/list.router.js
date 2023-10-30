import { Router } from "express";
import { addList } from "./controller/addList.js";
import { deleteList } from "./controller/deleteList.js";
import { updateList } from "./controller/updateList.js";
import { getList } from "./controller/getList.js";
import { getAllList } from "./controller/getAllList.js";
import { fileUpload, filesValidation } from "../../utils/multer.js";
import { listEndPoint } from "./list.endPoint.js";
import { asyncErrorHandler } from "../../utils/errorHandling.js";
import { auth } from "../../middleware/auth.js";
const router = Router()

router.post('/',auth(listEndPoint.addList),asyncErrorHandler(addList))
router.get('/:boardId/:listId',auth(listEndPoint.getList),asyncErrorHandler(getList))
router.get('/:boardId',auth(listEndPoint.getAllList),asyncErrorHandler(getAllList))
router.delete('/:boardId/:listId',auth(listEndPoint.deleteList),asyncErrorHandler(deleteList))
router.patch('/:boardId/:listId',auth(listEndPoint.updateList),asyncErrorHandler(updateList))

export default router