import userModel from "../../../../DB/models/user.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import workspaceModel from "../../../../DB/Models/workspace.model.js";
import { nanoid } from "nanoid";

// Update a workspace
export const updateWorkspace = async (req, res, next) => {
    const { workspaceId } = req.params;
    const isUser = await userModel.findById(req.user._id);
    if (!isUser) {
        return next(new ErrorClass(`User not found`, StatusCodes.NOT_FOUND));
    }
    // Find the workspace in the database
    const workspace = await workspaceModel.findById(workspaceId);

    if (!workspace) {
        return next(new ErrorClass(`Workspace Not Found`, StatusCodes.NOT_FOUND));
    }
    // check if who want to update workspace is workspace owner
    if (workspace.createdBy.toString() != req.user._id.toString()) {
        return next(
        new ErrorClass(
            `You Cannot Update This Workspace Info`,
            StatusCodes.BAD_REQUEST
        )
        );
    }
    //change cover pics
    if (req.files?.coverImages) {
        const customId = nanoid(5);
        const CoverImages = [];
        for (const file of req.files) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(
            file.path,
            { folder: `${process.env.FOLDER_CLOUD_NAME}/${customId}/coverImage` }
        );
        CoverImages.push({ secure_url, public_id });
        }
        req.body.coverImages=CoverImages
    }
    workspace.title = req.body.title;
    workspace.description = req.body.description;
    workspace.visability = req.body.visability;

    // Update the workspace fields
    const updatedWorkspace = await workspaceModel.findByIdAndUpdate(workspaceId,req.body);

    return res.status(StatusCodes.ACCEPTED).json({ message: "Workspace Updated Successfully", updatedWorkspace });
};
