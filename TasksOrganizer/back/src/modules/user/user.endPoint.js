import { roles } from "../../middleware/auth.js";

export const userEndPoint = {
  getAllUser: [roles.admin],
  getUser: [roles.user, roles.admin],
  update: [roles.user, roles.admin],
};