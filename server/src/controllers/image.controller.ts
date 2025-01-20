import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import * as imageService from "../services/image.service";

export const getAllImages = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId: string = req.user.id;

    const userImages = await imageService.getAllImages(userId);

    return res.status(200).json({
      success: true,
      data: userImages,
    });
  } catch (error) {
    console.error("Error getting images: ", error);
    return res.status(500).json({
      success: false,
      message: "Error getting images",
    });
  }
};

export const removeImage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { imageId } = req.params;
    const userId: string = req.user.id;

    if (!imageId) {
      return res.status(400).json({
        success: false,
        message: "Image ID is required",
      });
    }

    const imageRemoved = await imageService.removeImage(imageId, userId);

    if (!imageRemoved) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image removed successfully",
    });
  } catch (error) {
    console.error("Error removing image: ", error);
    return res.status(500).json({
      success: false,
      message: "Error removing image",
    });
  }
};

export const addImage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { image } = req.body;
    const userId: string = req.user.id;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const imageId = await imageService.uploadImage(image, userId);

    return res.status(201).json({
      success: true,
      message: "Image added successfully",
      imageId: imageId,
    });
  } catch (error) {
    console.error("Error adding image: ", error);
    return res.status(500).json({
      success: false,
      message: "Error adding image",
    });
  }
};

export const addProfileImage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { profileImage } = req.body;
    const userId: string = req.user.id;

    if (!profileImage) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }
    await imageService.updateProfileImage(profileImage, userId);
    return res.status(200).json({
      success: true,
      message: "Profile image added successfully",
    });
  } catch (error) {
    console.error("Error adding profile image: ", error);
    return res.status(500).json({
      success: false,
      message: "Error adding profile image",
    });
  }
};
