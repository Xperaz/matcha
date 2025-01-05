"use client";

import withProtectedRoute from "@/auth/withProtectedRoute";
import withAppLayout from "../templates/layout/withAppLayout";
import UserInfoCard from "../organisms/UserInfoCard";

interface User {
  id: number;
  name: string;
  bio: string;
  profilePicture: string;
  age: number;
}
const users: User[] = [
  {
    id: 1,
    name: "hamid reza",
    bio: "I'm a software engineer",
    profilePicture:
      "https://res.cloudinary.com/dzcvzkrow/image/upload/v1735987900/Laura_cde6os.jpg",
    age: 35,
  },
  {
    id: 2,
    name: "mohammad",
    bio: "I'm a software engineer",
    profilePicture:
      "https://res.cloudinary.com/dzcvzkrow/image/upload/v1735987900/Laura_cde6os.jpg",
    age: 35,
  },
  {
    id: 3,
    name: "ali",
    bio: "I'm a software engineer",
    profilePicture:
      "https://res.cloudinary.com/dzcvzkrow/image/upload/v1735987900/Laura_cde6os.jpg",
    age: 35,
  },
  {
    id: 4,
    name: "reza",
    bio: "I'm a software engineer",
    profilePicture:
      "https://res.cloudinary.com/dzcvzkrow/image/upload/v1735987900/Laura_cde6os.jpg",
    age: 35,
  },
  {
    id: 5,
    name: "mohsen",
    bio: "I'm a software engineer",
    profilePicture:
      "https://res.cloudinary.com/dzcvzkrow/image/upload/v1735987900/Laura_cde6os.jpg",
    age: 35,
  },
  {
    id: 6,
    name: "mohammad",
    bio: "I'm a software engineer",
    profilePicture:
      "https://res.cloudinary.com/dzcvzkrow/image/upload/v1735987994/b95028c5ee5c11e4f0881048a84b91b6_cejbte.jpg",
    age: 35,
  },
  {
    id: 7,
    name: "ali",
    bio: "I'm a software engineer",
    profilePicture:
      "https://res.cloudinary.com/dzcvzkrow/image/upload/v1735987994/b95028c5ee5c11e4f0881048a84b91b6_cejbte.jpg",
    age: 35,
  },
  {
    id: 8,
    name: "reza",
    bio: "I'm a software engineer",
    profilePicture:
      "https://res.cloudinary.com/dzcvzkrow/image/upload/v1735987994/b95028c5ee5c11e4f0881048a84b91b6_cejbte.jpg",
    age: 35,
  },
];

// const user = {
//   name: "hamid reza",
//   bio: "I'm a software engineer",
//   profilePicture: "https://asset.cloudinary.com/dzcvzkrow/53f3a809498bf4b8f3af5180182d74b8",
//   age: 35,
// };
const Matches = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Matches</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <UserInfoCard
            key={user.id}
            name={user.name}
            bio={user.bio}
            profilePicture={user.profilePicture}
            age={user.age}
          />
        ))}
      </div>
    </div>
  );
};

export default withAppLayout(withProtectedRoute(Matches));
