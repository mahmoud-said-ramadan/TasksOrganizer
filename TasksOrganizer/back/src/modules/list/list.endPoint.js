import { roles } from "../../middleware/auth.js";

export const listEndPoint = {
  addList: [roles.user, roles.admin],
  deleteList: [roles.user, roles.admin],
  updateList: [roles.user, roles.admin],
  getList: [roles.user, roles.admin],
  getAllList: [roles.user, roles.admin],
};