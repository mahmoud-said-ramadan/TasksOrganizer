import { roles } from "../../middleware/auth.js";

export const commentEndPoint = {
  getComment: [roles.user],
  addComment: [roles.user],
  updateComment: [roles.user],
  deleteComment: [roles.user],
  deleteMember: [roles.admin, roles.user],
};
