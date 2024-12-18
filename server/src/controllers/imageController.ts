
import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { query } from "../config/db";
import cloudinary from "../config/cloudinary";

export const removeImage = async (req: AuthenticatedRequest, res: Response) => {

    try {
        const { imageId } = req.params;
        const userId = req.user.id;

        if (!imageId) {
            return res.status(400).json({
                success: false,
                message: "Image ID is required",
            });
        }

        const getImageUrlQuery: string = `
            SELECT picture_url FROM images
            WHERE id = $1 AND user_id = $2;
        `;

        const { rows } = await query(getImageUrlQuery, [imageId, userId]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Image not found",
            });
        }

        await cloudinary.uploader.destroy(rows[0].picture_url);

        const deleteImageQuery: string = `
            DELETE FROM images
            WHERE id = $1 AND user_id = $2;
        `;

        await query(deleteImageQuery, [imageId, userId]);

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
        const userId = req.user.id;

        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }

        const result: any = await cloudinary.uploader.upload(image);
        const imageUrl: string = result.secure_url;

        const addImageQuery: string = `
            INSERT INTO images (url, user_id)
            VALUES ($1, $2)
            RETURNING id;
        `;

        const { rows } = await query(addImageQuery, [imageUrl, userId]);

        return res.status(201).json({
            success: true,
            message: "Image added successfully",
            imageId: rows[0].id,
        });
        
    } catch (error) {
        console.error("Error adding image: ", error);
        return res.status(500).json({
            success: false,
            message: "Error adding image",
        });

    }
};

export const addProfileImage = async (req: AuthenticatedRequest, res: Response) => {

    try{
        const { profileImage } = req.body;
        const userId = req.user.id;

        if (!profileImage) {
            return res.status(400).json({
                success: false,
                message: "Profile image is required",
            });
        }

        const result: any = await cloudinary.uploader.upload(profileImage);
        const profileImageUrl: string = result.secure_url;

        const updateProfileImageQuery: string = `
            UPDATE users
            SET profile_image = $1
            WHERE id = $2;
        `;

        await query(updateProfileImageQuery, [profileImageUrl, userId]);

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