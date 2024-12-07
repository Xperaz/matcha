export interface userSignupRequest {
    first_name: string,
    last_name: string,
    password: string,
    email: string,
    gender: genderEnum,
    age: number
    //TODO
}

enum genderEnum {
    MALE,
    FEMALE,
    OTHER
}