import { roles } from "../../middleware/auth.js";

export const boardEndPoint = {
  getBoard: [roles.user],
  AddBoard: [roles.user],
  UpdateBoard: [roles.user],
  deleteMember: [roles.admin, roles.user],
};
