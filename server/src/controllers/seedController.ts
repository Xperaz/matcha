import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/ahthenticatedRequest";
import { query } from "../config/db";
import cloudinary from "../config/cloudinary";
import bcrypt from "bcryptjs";
import path from "path";

const MALE_COUNT = 100;
const FEMALE_COUNT = 100;

const Preferences = ["MALE", "FEMALE", "BOTH"];

const Interests = [
  "TRAVEL",
  "MUSIC",
  "GYM",
  "SHOPPING",
  "PROGRAMMING",
  "FILMS",
  "NIGHTLIFE",
  "FOOTBALL",
  "FOOD",
  "DOGS",
  "CATS",
  "BOOKS",
  "GAMING",
];

const gender = ["MALE", "FEMALE", "OTHER"];

const maleFirstName = [
  "hamid",
  "mhend",
  "Robert",
  "mohamed",
  "bihi",
  "William",
  "Joseph",
  "beleid",
  "Thomas",
  "Daniel",
];

const maleLastName = [
  "fatmi",
  "boudou",
  "hadou",
  "Joseph",
  "beleid",
  "brik",
  "somi",
  "hamid",
  "mhend",
  "sossi",
];

const femaleFirstName = [
  "Olivia",
  "Emma",
  "Charlotte",
  "Amelia",
  "Sophia",
  "Mia",
  "Isabella",
  "Ava",
  "Evelyn",
  "Harper",
];

const femaleLastName = [
  "Smith",
  "Johnson",
  "Williams",
  "Jones",
  "Brown",
  "Davis",
  "Miller",
  "Wilson",
  "Moore",
  "Taylor",
];

const city = [
  "Casablanca",
  "Rabat",
  "Tanger",
  "Fes",
  "Marrakech",
  "Agadir",
  "Oujda",
  "Kenitra",
  "Tetouan",
  "Safi",
];

const country = [
  "Morocco",
  "Algeria",
  "Tunisia",
  "Libya",
  "Mauritania",
  "Mali",
  "Niger",
  "Chad",
  "Sudan",
  "Egypt",
];

const maleProfilePictures = [
  "/Users/aboudoun/Desktop/matcha/server/src/public/malePics/1.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/malePics/2.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/malePics/3.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/malePics/5.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/malePics/6.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/malePics/7.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/malePics/8.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/malePics/9.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/malePics/10.jpeg",
];

const femaleProfilePictures = [
  "/Users/aboudoun/Desktop/matcha/server/src/public/femalePics/1.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/femalePics/2.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/femalePics/3.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/femalePics/4.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/femalePics/5.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/femalePics/6.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/femalePics/7.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/femalePics/8.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/femalePics/9.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/femalePics/10.jpeg",
];

const pictures = [
  "/Users/aboudoun/Desktop/matcha/server/src/public/pictures/1.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/pictures/2.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/pictures/3.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/pictures/4.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/pictures/5.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/pictures/6.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/pictures/7.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/pictures/8.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/pictures/9.jpeg",
  "/Users/aboudoun/Desktop/matcha/server/src/public/pictures/10.jpeg",
];

export const seedDb = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userEmail = req.user.email;
    console.log("user", userEmail);
    if (userEmail != "abde@gmail.com") {
      return res.status(403).json({
        success: false,
        message: "unothorized",
      });
    }

    for (let i = 0; i < MALE_COUNT; i++) {
      const firstName =
        maleFirstName[Math.floor(Math.random() * maleFirstName.length)];
      const lastName =
        maleLastName[Math.floor(Math.random() * maleLastName.length)];
      const age = Math.floor(Math.random() * 50) + 18;
      const cit = city[Math.floor(Math.random() * city.length)];
      const countr = country[Math.floor(Math.random() * country.length)];
      const profilePicture = path.resolve(
        maleProfilePictures[
          Math.floor(Math.random() * maleProfilePictures.length)
        ]
      );
      const interests = Array.from(
        { length: 8 },
        () => Interests[Math.floor(Math.random() * Interests.length)]
      );
      const preferences =
        Preferences[Math.floor(Math.random() * Preferences.length)];
      const gender = "MALE";
      const email = `${firstName}${lastName}${i}@gmail.com`;
      const password = `${firstName}${lastName}${i}`;
      const biography = "this is random biography lorem ipsum dolor sit amet";
      const encryptedPassword = await bcrypt.hash(password, 10);
      const profileCompleted = true;
      const user_pictures = Array.from({ length: 5 }, () =>
        path.resolve(pictures[Math.floor(Math.random() * pictures.length)])
      );

      // upload profile picture to cloudinary
      const result: any = await cloudinary.uploader.upload(profilePicture);
      const profilePictureUrl: string = result.secure_url;

      // upload pictures to cloudinary
      const picturesUrls: string[] = [];
      for (const image of user_pictures) {
        const imageResult: any = await cloudinary.uploader.upload(image);
        const imageUrl: string = imageResult.secure_url;
        picturesUrls.push(imageUrl);
      }

      // insert user to db
      const insertUserQuery = `
                INSERT INTO users (email, password, first_name, last_name, biography, age,
                    profile_picture, city, country, sexual_preferences, gender, profile_completed)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING id;
            `;

      const result2 = await query(insertUserQuery, [
        email,
        encryptedPassword,
        firstName,
        lastName,
        biography,
        age,
        profilePictureUrl,
        cit,
        countr,
        preferences,
        gender,
        profileCompleted,
      ]);
      const userId = result2.rows[0].id;

      const insertUserImagesQuery = `
            INSERT INTO pictures (user_id, picture_url)
            VALUES ($1, unnest($2::text[]));
            `;
      await query(insertUserImagesQuery, [userId, picturesUrls]);

      const insertUserInterestsQuery = `
            INSERT INTO interests (user_id, interest_id)
            SELECT $1, id
            FROM interest_tags
            WHERE tag = ANY($2::text[])
            ON CONFLICT DO NOTHING;
            `;
      await query(insertUserInterestsQuery, [userId, interests]);

      console.log("User added successfully", firstName, lastName);
    }

    for (let i = 0; i < FEMALE_COUNT; i++) {
      const firstName =
        femaleFirstName[Math.floor(Math.random() * femaleFirstName.length)];
      const lastName =
        femaleLastName[Math.floor(Math.random() * femaleLastName.length)];
      const age = Math.floor(Math.random() * 50) + 18;
      const cit = city[Math.floor(Math.random() * city.length)];
      const countr = country[Math.floor(Math.random() * country.length)];
      const profilePicture = path.resolve(
        femaleProfilePictures[
          Math.floor(Math.random() * femaleProfilePictures.length)
        ]
      );
      const interests = Array.from(
        { length: 5 },
        () => Interests[Math.floor(Math.random() * Interests.length)]
      );
      const preferences =
        Preferences[Math.floor(Math.random() * Preferences.length)];
      const gender = "FEMALE";
      const email = `${firstName}${lastName}${i}@gmail.com`;
      const password = `${firstName}${lastName}${i}`;
      const biography = "this is random biography lorem ipsum dolor sit amet";
      const encryptedPassword = await bcrypt.hash(password, 10);
      const profileCompleted = true;

      const user_pictures = Array.from({ length: 6 }, () =>
        path.resolve(pictures[Math.floor(Math.random() * pictures.length)])
      );

      // upload profile picture to cloudinary
      const result: any = await cloudinary.uploader.upload(profilePicture);
      const profilePictureUrl: string = result.secure_url;

      // upload pictures to cloudinary
      const picturesUrls: string[] = [];
      for (const image of user_pictures) {
        const imageResult: any = await cloudinary.uploader.upload(image);
        const imageUrl: string = imageResult.secure_url;
        picturesUrls.push(imageUrl);
      }

      // insert user to db
      const insertUserQuery = `
                INSERT INTO users (email, password, first_name, last_name, biography, age,
                    profile_picture, city, country, sexual_preferences, gender, profile_completed)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING id;
            `;

      const result2 = await query(insertUserQuery, [
        email,
        encryptedPassword,
        firstName,
        lastName,
        biography,
        age,
        profilePictureUrl,
        cit,
        countr,
        preferences,
        gender,
        profileCompleted,
      ]);
      const userId = result2.rows[0].id;

      const insertUserImagesQuery = `
            INSERT INTO pictures (user_id, picture_url)
            VALUES ($1, unnest($2::text[]));
            `;
      await query(insertUserImagesQuery, [userId, picturesUrls]);

      const insertUserInterestsQuery = `
            INSERT INTO interests (user_id, interest_id)
            SELECT $1, id
            FROM interest_tags
            WHERE tag = ANY($2::text[])
            ON CONFLICT DO NOTHING;
            `;
      await query(insertUserInterestsQuery, [userId, interests]);

      console.log("User added successfully", firstName, lastName);
    }
    return res.status(200).json({
      success: true,
      message: "Database seeded successfully",
    });
  } catch (error) {
    console.error("Error adding image: ", error);
    return res.status(500).json({
      success: false,
      message: "Error adding image",
    });
  }
};
