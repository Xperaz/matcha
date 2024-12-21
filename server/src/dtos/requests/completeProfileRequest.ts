export interface completeProfileReqeuest {
    profile_picture: string,
    biography: string,
    preferences: string,
    latitude: number,
    longtitude: number,
    city: string,
    country: string,
    pictures: string[],
    interests: string[]
}

enum Preferences {
    MALE,
    FEMALE,
    BOTH
}

enum Interests{
    TRAVEL,
    MUSIC,
    GYM,
    SHOPPING,
    PROGRAMMING,
    FILMS,
    NIGHTLIFE,
    FOOTBALL,
    FOOD,
    DOGS,
    CATS,
    BOOKS,
    GAMING,
}

export function isValidPreference(preference: string): boolean {
    return Object.values(Preferences).includes(preference as unknown as Preferences);
}

export function isValidInterest(interest: string): boolean {
    return Object.values(Interests).includes(interest as unknown as Interests);
}