import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { query } from "../config/db";
import { UserMatchesDto } from "../dtos/user/userMatchesDto";


const mapUserMatches = (rows: any[]): UserMatchesDto[] => {
    return rows.map((row) => {
        return {
            id: row.id,
            first_name: row.first_name,
            last_name: row.last_name,
            profile_picture: row.profile_picture,
            gps_position: row.gps_position,
        };
    });
};

export const swipeLeft = async (req: AuthenticatedRequest, res: Response) => {


};


export const swipeRight = async (req: AuthenticatedRequest, res: Response)  => {
    
    try{
        const userId: string = req.user?.id;
        const receiverId: string = req.params.userId;

        if (!userId || !receiverId){
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID not found",
              });
        }

        // check if the user has already swiped right
        

    } catch (ex) {
        console.error("Error swiping right", ex);
        
        return res.status(500).json({
          success: false,
          message: "An error occurred while swiping right",
        });
    }
};

//get user matches [users], user{f_name, l_name, photo, locatiion?}
export const getUserMatches = async (req: AuthenticatedRequest , res: Response) => {

    try{
        const userId: string = req.user?.id;

        if (!userId){
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID not found",
              });
        }

        const getMatchesQuery: string = `
            SELECT DISTINCT u.id, u.first_name, u.last_name, u.profile_picture, u.gps_position
            FROM likes l
            JOIN users u 
                ON (u.id = l.initiator_id AND l.receiver_id = $1)
                OR (u.id = l.receiver_id AND l.initiator_id = $1)
            WHERE l.status = 'MATCH';
        `;

        const rows  = await query(getMatchesQuery, [userId]);

        if (!rows){
            return res.status(404).json({
                success: false,
                message: "No matches found",
            });
        }

        const userMatches: UserMatchesDto[] = mapUserMatches(rows);

        return res.status(200).json({
            success: true,
            message: "User matches retrieved successfully",
            data: userMatches,
        });

    } catch (ex) {
        console.error("Error getting user matches", ex);
        
        return res.status(500).json({
          success: false,
          message: "An error occurred while getting user matches",
        });
    }
};


// get an array of users to choose from
// TODO maybe use pagination 
export const getUsersProfile = () => {

};