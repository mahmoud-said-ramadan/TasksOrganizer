import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { commentEndPoint } from "./comment.endPoint.js";
import * as commentController from "./controller/comment.js";
const router = Router();

router
  .route("/")
  .get(auth(commentEndPoint.getComment), commentController.getComment)
  .post(auth(commentEndPoint.addComment), commentController.createComment)
  .put(auth(commentEndPoint.updateComment), commentController.updateComment)
  .delete(auth(commentEndPoint.deleteComment), commentController.deleteComment);
export default router;
