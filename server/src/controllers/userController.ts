import { query } from "../config/db";
import cloudinary  from "../config/cloudinary";
import { Request, Response } from "express";


export const completeProfile = async (req: Request, res: Response): Promise<Response> => {
// TODO: update user data || maybe add another route for images upload
// TODO: add a new variable to user db complete_signup: bool

try{

    const { 
        data,
        profile_picture
    } = req.body;
    
    //TODO: validate the data
    if (!data || !profile_picture){
        return res.status(400).json({
            sucess: false,
            message: "all fields are required"
        });
    }

    const upload_response = await cloudinary.uploader.upload(profile_picture);
    const url = upload_response.url;

} catch (ex) {

}

};
