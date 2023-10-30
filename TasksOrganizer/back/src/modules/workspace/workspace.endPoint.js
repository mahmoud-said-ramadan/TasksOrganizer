import { roles } from "../../middleware/auth.js";

export const workspaceEndPoint = {
  getWorkSpace: [roles.user],
  AddWorkSpace: [roles.user],
  UpdateWorkSpace: [roles.user],
  deleteMember: [roles.admin, roles.user],
  addMember: [roles.admin, roles.user],
};
 