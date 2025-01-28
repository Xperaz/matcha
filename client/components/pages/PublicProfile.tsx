"use client";
import React, { useState } from "react";
import withAppLayout from "../templates/layout/withAppLayout";
import withProtectedRoute from "@/auth/withProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Flag,
  X,
  UserMinus,
  MapPin,
  Star,
  CircleDot,
} from "lucide-react";

import Image from "next/image";
import { formatLastConnection } from "../organisms/public-profile/utils";

export interface publicProfileDto {
  id: string;
  first_name: string;
  last_name: string;
  biography?: string;
  fame_rating: number;
  sexual_preferences?: "MALE" | "FEMALE" | "BOTH";
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  profile_picture: string;
  country: string;
  city: string;
  is_like: boolean;
  is_match: boolean;
  has_liked_you: boolean;
  is_active: boolean;
  last_connection: Date;
  interests: string[];
  pictures: string[];
}

const user = {
  id: "3330495f-0b80-498b-ad64-db4845e0b5ed",
  first_name: "abderrahim",
  last_name: "boudounit",
  biography: "just test",
  fame_rating: 7,
  age: 18,
  geneger: "MALE",
  profile_picture:
    "https://res.cloudinary.com/dzcvzkrow/image/upload/v1737884465/ysksa7wvxjrajnou71xb.jpg",

  country: "Morocco",
  city: "Casablanca",
  is_like: false,
  is_match: true,
  has_liked_you: false,
  is_active: true,
  last_connection: new Date(),
  interests: ["Tech", "Foodie", "Travel", "Concerts", "Hiking", "Dogs"],
  pictures: [
    "https://res.cloudinary.com/dzcvzkrow/image/upload/v1737884465/ysksa7wvxjrajnou71xb.jpg",
    "https://res.cloudinary.com/dzcvzkrow/image/upload/v1737884465/ysksa7wvxjrajnou71xb.jpg",
    "https://res.cloudinary.com/dzcvzkrow/image/upload/v1737884465/ysksa7wvxjrajnou71xb.jpg",
    "https://res.cloudinary.com/dzcvzkrow/image/upload/v1737884465/ysksa7wvxjrajnou71xb.jpg",
    "https://res.cloudinary.com/dzcvzkrow/image/upload/v1737884465/ysksa7wvxjrajnou71xb.jpg",
    "https://res.cloudinary.com/dzcvzkrow/image/upload/v1737884465/ysksa7wvxjrajnou71xb.jpg",
  ],
};

const getMatchStatus = () => {
  if (user.is_match) return "MATCHED";
  if (user.is_like) return "LIKED";
  return "NONE";
};

export const PublicProfile = () => {
  const allImages = [user.profile_picture, ...user.pictures];
  const [matchStatus, setMatchStatus] = useState(() => getMatchStatus());

  // Helper function to format last connection time

  const renderMatchButton = () => {
    switch (matchStatus) {
      case "MATCHED":
        return (
          <Button variant="destructive" onClick={() => handleUnmatch()}>
            <UserMinus className="mr-2 h-4 w-4" />
            Unmatch
          </Button>
        );

      case "LIKED":
        return (
          <Button variant="outline" onClick={() => handleDislike()}>
            <X className="mr-2 h-4 w-4" />
            Unlike
          </Button>
        );

      case "NONE":
        return (
          <Button variant="outline" onClick={() => handleLike()}>
            <Heart className="mr-2 h-4 w-4" />
            Like
          </Button>
        );

      default:
        return null;
    }
  };

  const handleLike = () => {
    setMatchStatus("LIKED");
    console.log("Liking user...");
  };

  const handleDislike = () => {
    setMatchStatus("NONE");
    console.log("Removing like...");
  };

  const handleUnmatch = () => {
    setMatchStatus("NONE");
    console.log("Unmatching...");
  };

  const handleReport = () => {
    console.log("Reporting user...");
    // TODO: Implement report user functionality, and redirect to home page
  };

  const handleSendMessage = () => {
    console.log("Sending message...");
    // TODO: Implement send message functionality, and redirect to chat page
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Image Gallery */}
      <div className="relative aspect-[4/5] mb-6">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="col-span-2 relative">
            <Image
              src={allImages[0]}
              alt="Profile"
              className="w-full h-[400px] object-cover rounded-lg"
              width={0}
              height={0}
              sizes="100vw"
            />
            {/* Online Status Indicator */}
            <div className="absolute top-4 right-4">
              {user.is_active ? (
                <Badge className="bg-green-500">
                  <CircleDot className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-500/10">
                  Last seen {formatLastConnection(user.last_connection)}
                </Badge>
              )}
            </div>
          </div>
          <div className="grid grid-rows-2 gap-2">
            {allImages.slice(1, 3).map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-[196px] object-cover rounded-lg"
                width={0}
                height={0}
                sizes="100vw"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {allImages.slice(3, 5).map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`Gallery ${idx + 3}`}
              className="w-full h-[200px] object-cover rounded-lg"
              width={0}
              height={0}
              sizes="100vw"
            />
          ))}
        </div>
      </div>

      {/* Profile Info */}
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">
              {user.first_name}, {user.age}
            </h1>
            <div className="flex items-center text-gray-600 space-x-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {user.city}, {user.country}
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                Fame: {user.fame_rating}/100
              </div>
            </div>
            {user.has_liked_you && (
              <Badge
                variant="secondary"
                className="bg-pink-500/10 text-pink-500"
              >
                <Heart className="w-3 h-3 mr-1 fill-current" />
                Likes you
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {renderMatchButton()}
            {user.is_match && (
              <Button variant="default">
                <MessageCircle
                  className="mr-2 h-4 w-4"
                  onClick={() => handleSendMessage()}
                />
                Send Message
              </Button>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">
            About {user.first_name}
          </h2>
          <p className="text-gray-600">{user.biography}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, idx) => (
              <Badge key={idx} variant="secondary">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            className="text-red-600 hover:text-red-700"
            onClick={() => handleReport()}
          >
            <Flag className="mr-2 h-4 w-4" />
            Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withAppLayout(withProtectedRoute(PublicProfile));
