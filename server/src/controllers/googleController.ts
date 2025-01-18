import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import qs from "querystring";
import jwt from "jsonwebtoken";
import { query } from "../config/db";

dotenv.config();
interface GoogleUserBasicInfo {
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

interface GoogleUserInfo extends GoogleUserBasicInfo {
  gender: string;
  age: number;
}

const validateUser = (user: GoogleUserInfo): GoogleUserInfo => {
  const { age, gender } = user;
  if (!age){
    user.age = 18;
  }
  if (!gender || (gender != "male" && gender != "female")){
    user.gender = "other";
  }
  user.gender = user.gender.toUpperCase();
  console.log("user", user);
  return user;
}

const calculateAge = (year: number, day:number, month:number): number => {
  const today = new Date();
  const birthDate = new Date(year, month, day);
  let age = today.getFullYear() - birthDate.getFullYear();
  return age;
}

const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

const createUser = async (user: GoogleUserInfo): Promise<string> => {
  const createUserQuery = `
    INSERT INTO users (email, first_name, last_name, gender, age, is_google)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
  `;
  const { email, given_name, family_name, gender, age } = user;
  const values = [email, given_name, family_name, gender, age, true];
  const { rows } = await query(createUserQuery, values);
  return rows[0].id;
};

const generateToken = async (user: GoogleUserInfo): Promise<string> => {
  const getUserQuery = `
    SELECT id FROM users WHERE email = $1;
  `;
  const { rows } = await query(getUserQuery, [user.email]);
  if (rows.length > 0) {
    const token = signToken(rows[0].id);
    return token;
  }
  const id = await createUser(validateUser(user));
  return signToken(id);
};

const decodeGoogleToken = (token: string): GoogleUserBasicInfo => {
  const decoded = jwt.decode(token) as any;
  if (!decoded) {
    throw new Error("Failed to decode Google token");
  }
  return {
    email: decoded.email,
    name: decoded.name,
    picture: decoded.picture,
    given_name: decoded.given_name,
    family_name: decoded.family_name,
  };
};

const getGoogleAauthTokens = async ({ code }: { code: string }) => {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Failed to fetch Google Oauth Tokens");
    throw new Error(error.message);
  }
};

const getGoogleUser = async ({
  id_token,
  access_token,
}: {
  id_token: string;
  access_token: string;
}): Promise<GoogleUserInfo> => {
  try {
    // Get user info from id_token
    const basicInfo = decodeGoogleToken(id_token);

    // Get additional info using People API
    const profileResponse = await axios.get(
      "https://people.googleapis.com/v1/people/me",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          personFields: "genders,birthdays",
        },
      }
    );

    const additionalInfo = profileResponse.data;
    const {year, month, day} = additionalInfo.birthdays?.[0]?.date || {};
    const userAge = calculateAge(year, day, month);

    return {
      ...basicInfo,
      gender: additionalInfo.genders?.[0]?.value || null,
      age: userAge ,
    };
  } catch (error: any) {
    console.error(error, "Error fetching Google user");
    throw new Error(error.message);
  }
};

export const googleOauthHandle = async (req: Request, res: Response) => {
  try {
    const code: string = req.query.code as string;
    const { id_token, access_token } = await getGoogleAauthTokens({ code });
    const googleUser: GoogleUserInfo = await getGoogleUser({
      id_token,
      access_token,
    });

    console.log("googleUser", googleUser);

    const token = await generateToken(googleUser);

    console.log("---------------------------------token", token);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    res.redirect("http://localhost:3000/home");
  } catch (error) {
    console.log("error getting google auth credentials", error);
    res.redirect("http://localhost:3000/login");
  }
};
