import { query } from "../config/db";
import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { UserProfileDTO } from "../dtos/user/userProfileDto";


const mapUser = (user: any, interests: any): UserProfileDTO => {
    return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        biography: user.biography,
        fame_rating: user.fame_rating,
        sexual_preferences: user.sexual_preferences,
        age: user.age,
        city: user.city,
        country: user.country,
        interests: interests.map((interest: any) => interest.tag),
        profile_picture: user.profile_picture,
        gender: user.gender,
        profile_completed: user.profile_completed,
    };
};

export const getMyProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {

    try{
        const userId: any = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID not found",
            });
        }

        const getMyProfileQuery = `
            SELECT * FROM users WHERE id = $1;
        `;

        const { rows: user } = await query(getMyProfileQuery, [userId]);

        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const getInterestsQuery = `
        SELECT it.tag
        FROM interests i
        JOIN interest_tags it ON i.interest_id = it.id
        WHERE i.user_id = $1;
        
        `;
        const { rows: interests } = await query(getInterestsQuery, [userId]);
        
        const data = mapUser(user[0], interests);

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error while retrieving my profile"
        });
    }
};
