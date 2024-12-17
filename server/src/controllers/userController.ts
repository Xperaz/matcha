import { query } from "../config/db";
import cloudinary  from "../config/cloudinary";
import { Response } from "express";
import { completeProfileReqeuest, isValidInterest, isValidPreference } from "../dtos/requests/completeProfileRequest";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";

// validate data
// update it
// upload images
// save urls to database

export const completeProfile = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  
  console.log(req.user);
    
  try{ 

      const userData: completeProfileReqeuest = req.body;
      const userId: any = req.user?.id;

        if (!userId) {
            return res.status(401).json({
              success: false,
              message: "Unauthorized: User ID not found",
            });
        }

        if (!userData.biography || !userData.interests || !userData.latitude || !userData.longtitude || !userData.preferences
            || !userData.pictures || !userData.profile_picture || !userData.city || !userData.country){
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                });
        }

        if (!isValidPreference(userData.preferences)){
            return res.status(400).json({
                success: false,
                message: "invalid preference",
            });
        }

        const invalidInterests: string[] = userData.interests.filter((interest) => !isValidInterest(interest));
        
        if (invalidInterests.length > 0) {
            return res.status(400).json({
                error: "Invalid interests",
                invalidInterests,
            });
        }

        const result: any = await cloudinary.uploader.upload(userData.profile_picture);
        const profilePictureUrl: string = result.secure_url;

        const pictures_urls: string[] = [];
        for (const image of userData.pictures ){
            const imageResult: any = await cloudinary.uploader.upload(image);
            const imageUrl: string = imageResult.secure_url;
            pictures_urls.push(imageUrl);
        }

        // await query("BEGIN");

        const insertUserInfoQuery = `
          UPDATE users
          SET biography = $1,
              latitude = $2,
              longtitude = $3,
              profile_completed = TRUE,
              sexual_preferences = $4,
              profile_picture = $5
              city = $6,
              country = $7
          WHERE id = $8;
        `;
        await query(insertUserInfoQuery, [
          userData.biography,
          userData.latitude,
          userData.longtitude,
          userData.preferences,
          profilePictureUrl,
          userData.city,
          userData.country,
          userId,
        ]);
    
        const insertUserImagesQuery = `
          INSERT INTO pictures (user_id, picture_url)
          VALUES ($1, unnest($2::text[]));
        `;
        await query(insertUserImagesQuery, [userId, pictures_urls]);
        
        const insertUserInterestsQuery = `
            INSERT INTO interests (user_id, interest_id)
            SELECT $1, id
            FROM interest_tags
            WHERE tag = ANY($2::text[])
            ON CONFLICT DO NOTHING;
        `;
        await query(insertUserInterestsQuery, [userId, userData.interests]);
        
        // await query("COMMIT");
        
        return res.status(200).json({
          success: true,
          message: "Profile completed successfully",
        });

      } catch (ex) {
        console.error("Error completing profile:", ex);
    
        // await query("ROLLBACK");
    
        return res.status(500).json({
          success: false,
          message: "An error occurred while completing the profile",
        });
      }
};