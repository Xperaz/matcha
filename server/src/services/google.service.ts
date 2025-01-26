import axios from "axios";
import qs from "querystring";
import jwt from "jsonwebtoken";
import { query } from "../config/db";
import { signToken } from "./auth.service";
import { v4 as uuidv4 } from "uuid";

interface GoogleUserBasicInfo {
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface GoogleUserInfo extends GoogleUserBasicInfo {
  gender: string;
  age: number;
}

const validateUser = (user: GoogleUserInfo): GoogleUserInfo => {
  const { age, gender } = user;
  if (!age) {
    user.age = 18;
  }
  if (!gender || (gender != "male" && gender != "female")) {
    user.gender = "other";
  }
  user.gender = user.gender.toUpperCase();
  return user;
};

const calculateAge = (year: number, day: number, month: number): number => {
  const today = new Date();
  const birthDate = new Date(year, month, day);
  let age = today.getFullYear() - birthDate.getFullYear();
  return age;
};

function generateRandomUsername(firstName: string, lastName: string): string {
  const lowerFirstName = firstName.toLowerCase();
  const lowerLastName = lastName.toLowerCase();

  const uniqueId = uuidv4().split("-")[0];

  const username = `${lowerFirstName}.${lowerLastName}.${uniqueId}`;

  return username;
}

const createGoogleUser = async (user: GoogleUserInfo): Promise<string> => {
  const username = generateRandomUsername(user.given_name, user.family_name);
  const createUserQuery = `
      INSERT INTO users (email, first_name, last_name, username, gender, age, is_google, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;
  const { email, given_name, family_name, gender, age } = user;
  const values = [
    email,
    given_name,
    family_name,
    username,
    gender,
    age,
    true,
    true,
  ];
  const { rows } = await query(createUserQuery, values);
  return rows[0].id;
};

export const generateToken = async (user: GoogleUserInfo): Promise<string> => {
  const getUserQuery = `
      SELECT id FROM users WHERE email = $1;
    `;
  const { rows } = await query(getUserQuery, [user.email]);
  if (rows.length > 0) {
    const token = signToken(rows[0].id);
    return token;
  }
  const id = await createGoogleUser(validateUser(user));
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

export const getGoogleAauthTokens = async ({ code }: { code: string }) => {
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

export const getGoogleUser = async ({
  id_token,
  access_token,
}: {
  id_token: string;
  access_token: string;
}): Promise<GoogleUserInfo> => {
  try {
    const basicInfo = decodeGoogleToken(id_token);

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
    const { year, month, day } = additionalInfo.birthdays?.[0]?.date || {};
    const userAge = calculateAge(year, day, month);

    return {
      ...basicInfo,
      gender: additionalInfo.genders?.[0]?.value || null,
      age: userAge,
    };
  } catch (error: any) {
    console.error(error, "Error fetching Google user");
    throw new Error(error.message);
  }
};
