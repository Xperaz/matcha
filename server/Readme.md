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

### User Signin
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