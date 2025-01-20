## Instructions to Run the Application

To run the application, please follow these steps:

1. Make sure you have Docker installed and running on your machine.

2. Run the following command to set up the database:

```bash
make db
```

4. After the database setup is complete, run the following command to start the backend server:

```bash
make backend
```

5. The application should now be running. You can access the endpoints using `http://localhost:5000`.

## Endpoints

### 1. User Signup

- **URL**: `http://localhost:5000/api/auth/signup`
- **Method**: `POST`

#### Request Body

```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "password": "string",
  "gender": "MALE | FEMALE | OTHER",
  "age": number
}
```

### 2. User Signin

- **URL**: `http://localhost:5000/api/auth/signin`
- **Method**: `POST`

#### Request Body

```json
{
  "email": "string",
  "password": "string"
}
```

### Success Response

- **Status Code: 200 OK**
- **Response Body:**

```json
{
  "message": "Login successful",
  "jwt": "<authentication_token>"
}
```

### 3. Complete profile

- **URL**: `http://localhost:5000/api/user/complete-profile`
- **Method**: `POST`

```json
{
  "profile_picture": "string", // Base64-encoded image
  "biography": "string",
  "preferences": "string", // 'MALE', 'FEMALE', 'BOTH'
  "latitude": "string",
  "longitude": "string",
  "pictures": ["string"], // Array of Base64-encoded images
  "interests": ["string"] // Array of valid interest tags "TRAVEL", "MUSIC", "FOOD"
}
```
