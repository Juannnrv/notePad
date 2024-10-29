# Note Pad 

The **Notes Application** is a platform designed to facilitate the management of users' personal notes. Its main objective is to provide a simple and accessible environment where users can efficiently create, edit, view and delete their notes. The application has features such as note search, user authentication and a history of changes, allowing users to organize their thoughts and keep a record of their ideas in a secure and private way.debounce functions.

The application is developed with an MVC architecture that includes both an intuitive frontend and a robust backend, ensuring a seamless user experience. In addition, the use of a JWT token for authentication ensures that only authorized users can access their notes, thus protecting the privacy and security of information.



To install and configure this project, follow these steps:



### **Prerequisites**:

- **Node.js**: Make sure you have Node.js version `18.x` installed.
- **NPM**: Comes installed with Node.js, but make sure you have a recent version.



### Installing dependencies

- Clone the project repository and navigate to the project directory.

  ```bash
  git clone https://github.com/Juannnrv/notePad
  
  cd notePad
  ```

  

- Run the following command to install the production and development dependencies:

  ```bash
  npm install 
  ```



### Dependencies versions

- **Production dependencies**:
  - `bcrypt@5.1.1` - To encrypt passwords.
  - `concurrently@9.0.1` - Execute multiple commands simultaneously.
  - `cors@2.8.5` - Middleware to enable CORS.
  - `express-jwt@8.4.1` - Middleware for authentication with JWT.
  - `express-rate-limit@7.4.1` - Middleware to limit the number of requests.
  - `express-session@1.18.1` - Session handling in Express.
  - `express-validator@7.2.0` - Data validation in Express.
  - `framer-motion@11.11.10` - Animations for the interface.
  - `https@1.0.0` - HTTPS protocol.
  - `jsonwebtoken@9.0.2` - JWT token generation.
  - `mongoose@8.7.2` - ORM for MongoDB.
  - `react@18.3.1` and `react-dom@18.3.1` - Library for building interfaces.
  - `react-icons@5.3.0` - Icons for React.
  - `react-router-dom@6.27.0` - Routing in React applications.
  - `semver@7.6.3` - Semantic version validation and manipulation.
- **Development Dependencies**:
  - `@eslint/js@9.11.1`, `eslint@9.11.1`, `eslint-plugin-react@7.37.0`, `eslint-plugin-react@7.37.0`, `eslint-plugin-react-hooks@5.1.0-rc.0`, `eslint-plugin-react-refresh@0.4.12` - Tools for linting.
  - `@types/react@18.3.10`, `@types/react-dom@18.3.0` - Types for React.
  - `@vitejs/plugin-react@4.3.2`, `vite@5.4.8` - Configuration for frontend development.
  - `autoprefixer@10.4.20`, `postcss@8.4.47`, `tailwindcss@3.4.14` - Configuration for CSS styles.



### Set enviroment variables:

Create an `.env` file in the root of the project and add the necessary environment variables (follow .envTemplate file).

```bash
  MONGO_PROTOCOLO=mongodb://
  MONGO_USER=juan
  MONGO_PSW=juan123
  MONGO_HOST=172.16.102
  MONGO_PORT=27017
  MONGO_DB_NAME=notas
  ```

### **Start the project**:

- In development, you can use the following command to start the frontend and backend concurrently:

  ```bash
  npm run dev
  ```

  

This will start Vite for the frontend and the backend server (`server.js`) with environment variables defined in `.env`.



## User API Documentation



### Create Account

**Method**: `POST`
**URL**: `https://localhost:3000/users/create`
**Auth required**: `False`

**Limit requests**: 45 every 15 minutes

**Headers**:

```json
{
    "Content-Type": "application/json",
    "x-version": "1.0.0"
}
```

**Body**:

```json
{
    "username": "string",
    "password": "string, minimum 6 characters",
    "email": "valid email"
}
```

**Success Response**:

- **Code**: `201 Created`

```json
{
    "status": 201,
    "message": "User account created successfully",
    "data": {
        "username": "sampleUsername",
        "email": "sampleEmail"
    }
}
```

**Error Responses**

**Code** : `400 Bad Request`

```json
{
    "status": 400,
    "message": "Validation errors",
    "data": [
        {
            "msg": "Username is required",
            "param": "username",
            "location": "body"
        }
    ]
}
```

**Code** : `500 Internal Server Error`

```json
{
    "status": 500,
    "message": "Error creating user account"
}
```



### Log In Account

**Method**: `POST`
**URL**: `https://localhost:3000/users/login`
**Auth required**: `False`

**Limit requests**: 3 every 3 minutes

**Header**:

```json
{
    "Content-Type": "application/json",
    "x-version": "1.0.0"
}
```

**Body**:

```json
{
    "email": "example@example.com",
    "password": "examplePass123"
}
```

**Success Responses**:

- **Code**: `200 OK`

  ```json
  {
      "status": "200",
      "message": "User logged in successfully",
      "data": {
          "token": "JWT_token_here"
      }
  }
  ```

**Error Responses**

**Code** : `400 Bad Request`

```json
{
    "status": 400,
    "message": "Validation errors",
    "data": [
        {
            "msg": "Email is required",
            "param": "email",
            "location": "body"
        }
    ]
}
```

**Code** : `404 Not Found`

```json
{
    "status": 404,
    "message": "Invalid email or password, please check and try again"
}
```

**Code** : `500 Internal Server Error`

```json
{
    "status": 500,
    "message": "Error logging in user"
}
```

### Update User Account

**Method**: `PUT`
**URL**: `https://localhost:3000/users/:id`
**Auth required**: `False`

**Limit requests**: 45 every 15 minutes

**Header**:

```json
{
    "Content-Type": "application/json",
    "x-version": "1.0.0"
}
```

**Params**: `/userID`

**Body**:

```json
{
    "username": "newUserName",
    "email": "newEmail@example.com",
    "password": "newPass123"
}
```

**Success Responses**:

- **Code**: `200 OK`

  ```json
  {
      "status": "200",
      "message": "User account updated successfully",
      "data": {
          "id": "userID",
          "username": "newUserName",
          "email": "newEmail@example.com"
      }
  }
  ```

**Error Responses**

**Code** : `400 Bad Request`

```json
{
    "status": 400,
    "message": "Validation errors",
    "data": [
        {
            "msg": "ID is required",
            "param": "id",
            "location": "params"
        }
    ]
}
```

**Code** : `404 Not Found`

```json
{
    "status": 404,
    "message": "User not found"
}
```

**Code** : `500 Internal Server Error`

```json
{
    "status": 500,
    "message": "Error updating user account"
}
```



### Delete User Account

**Method**: `DELETE`
**URL**: `https://localhost:3000/users/:id`
**Auth required**: `False`

**Limit requests**: 10 every 10 minutes

**Header**:

```json
{
    "Content-Type": "application/json",
    "x-version": "1.0.0"
}
```

**Params**: `/userID`

**Success Responses**:

- **Code**: `200 OK`

  ```json
  {
      "status": "200",
      "message": "User account deleted successfully",
      "data": {
          "id": "userID",
          "username": "exampleUser",
          "email": "example@example.com"
      }
  }
  ```

**Error Responses**

**Code** : `404 Not Found`

```json
{
    "status": 404,
    "message": "User not found"
}
```

**Code** : `500 Internal Server Error`

```json
{
    "status": 500,
    "message": "Error deleting user account"
}
```





## Notes API Documentation



### Create Note

**Method**: `POST`
**URL**: `https://localhost:3000/notes`
**Auth required**: `True`

**Header**:

```json
{
    "Content-Type": "application/json",
    "x-version": "1.0.0"
}
```

**Body**:

```json
{
    "title": "Sample Note Title",
    "description": "This is a sample description for the note."
}
```

**Success Responses**:

- **Code**: `201 Created`

  ```json
  {
      "status": "201",
      "message": "Note created successfully",
      "data": {
          "_id": "noteID",
          "title": "Sample Note Title",
          "description": "This is a sample description for the note.",
          "user_id": "userID",
          "changes": [
              {
                  "title": "Sample Note Title",
                  "description": "This is a sample description for the note.",
                  "date": "date_created"
              }
          ],
          "status": "visible"
      }
  }
  ```

**Error Responses**

**Code** : `400 Bad Request`

```json
{
    "status": 400,
    "message": "Validation errors",
    "data": [
        {
            "msg": "Title is required",
            "param": "title",
            "location": "body"
        }
    ]
}
```

**Code**: `500 Internal Server Error`

```json
{
    "status": "status code",
    "message": "Description of error"
}
```



### Get Notes

**Method**: `GET`
**URL**: `https://localhost:3000/notes`
**Auth required**: `True`

**Header**:

```json
{
    "Content-Type": "application/json",
    "x-version": "1.0.0"
}
```

**Success Responses**:

- **Code**: `200 OK`

  ```json
  {
      "status": "200",
      "message": "Notes retrieved successfully",
      "data": [
          {
              "_id": "noteID",
              "title": "Sample Note Title",
              "description": "This is a sample description.",
              "user_id": "userID",
              "changes": [],
              "status": "visible"
          }
      ]
  }
  ```

**Error**:

- **Code**: `500 Internal Server Error`

  ```json
  {
      "status": "500",
      "message": "Error retrieving notes"
  }
  ```



## Get Note by ID

**Method**: `GET`
**URL**: `https://localhost:3000/notes/:id`
**Auth required**: `True`

**Header**:

```json
{
    "Content-Type": "application/json",
    "x-version": "1.0.0"
}
```

**Params**: `/noteID`

**Success Responses**:

- **Code**: `200 OK`

  ```json
  {
      "status": "200",
      "message": "Note retrieved successfully",
      "data": {
          "_id": "noteID",
          "title": "Sample Note Title",
          "description": "This is a sample description.",
          "user_id": "userID",
          "changes": [],
          "status": "visible"
      }
  }
  ```

**Error Responses:**

- **Code**: `404 Not Found`, 

  ```json
  {
    "status": 404,
    "message": "Note not found"
  }
  ```

- **Code** `500 Internal Server Error`

  ```json
  {
      "status": "status code",
      "message": "Description of error"
  }
  ```



## Search Notes

**Method**: `GET`
**URL**: `https://localhost:3000/notes/search`
**Auth required**: `True`

**Header**:

```json
{
    "Content-Type": "application/json",
    "x-version": "1.0.0"
}
```

**URL Query**: `?query="searchTerm"`

**Success Responses**:

- **Code**: `200 OK`

  ```json
  {
      "status": "200",
      "message": "Notes found successfully",
      "data": [
          {
              "_id": "noteID",
              "title": "Matched Note Title",
              "description": "This is a matched description.",
              "user_id": "userID",
              "changes": [],
              "status": "visible"
          }
      ]
  }
  ```

**Error Responses:**

- **Code**: `400 Bad Request`

  ```json
  {
    "status": 400,
    "message": "Query parameter is required and must be a string"
  }
  ```

- **Code**: `404 Not Found`

  ```json
  {
    "status": 404,
    "message": "No notes found"
  }
  ```

- **Code**: `500 Internal Server Error`

  ```json
  {
    "status": 500,
    "message": "Error searching notes"
  }
  ```



## Get Note History

**Method**: `GET`
**URL**: `https://localhost:3000/notes/:id/history`
**Auth required**: `True`

**Header**:

```json
{
    "Content-Type": "application/json",
    "x-version": "1.0.0"
}
```

**Params**: `/noteID`

**Success Responses**:

- **Code**: `200 OK`

  ```json
  {
      "status": "200",
      "message": "Note history retrieved successfully",
      "data": [
          {
              "title": "Previous Note Title",
              "description": "Previous description.",
              "date": "date_of_change"
          }
      ]
  }
  ```

**Error Responses:**

- **Code**: `404 Not Found`, 

  ```json
  {
    "status": 404,
    "message": "Note not found"
  }
  ```

- **Code** `500 Internal Server Error`

  ```json
  {
    "status": 500,
    "message": "Error retrieving note history"
  }
  ```



## Update Note

**Method**: `PUT`
**URL**: `https://localhost:3000/notes/:id`
**Auth required**: `True`

**Header**:

```json
{
    "Content-Type": "application/json",
    "x-version": "1.0.0"
}
```

**Params**: `/noteID`

**Body**:

```json
{
    "title": "Updated Note Title",
    "description": "Updated description for the note."
}
```

**Success Responses**:

- **Code**: `200 OK`

  ```json
  {
      "status": "200",
      "message": "Note updated successfully",
      "data": {
          "_id": "noteID",
          "title": "Updated Note Title",
          "description": "Updated description for the note.",
          "user_id": "userID",
          "changes": [
              {
                  "title": "Updated Note Title",
                  "description": "Updated description for the note.",
                  "date": "date_of_change"
              }
          ],
          "status": "visible"
      }
  }
  ```

**Error Responses:**

- **Code**: `400 Bad Request`, 

  ```json
  {
    "status": 400,
    "message": "Validation errors",
    "data": [
      {
        "msg": "Title is required",
        "param": "title",
        "location": "body"
      }
    ]
  }
  ```

- **Code** `404 Not Found`

  ```json
  {
    "status": 404,
    "message": "Note not found"
  }
  ```

- **Code** `500 Internal Server Error`

  ```json
  {
    "status": 500,
    "message": "Error updating note"
  }
  ```



------

## Delete Note

**Method**: `DELETE`
**URL**: `https://localhost:3000/notes/:id`
**Auth required**: `True`

**Header**:

```json
{
    "Content-Type": "application/json",
    "x-version": "1.0.0"
}
```

**Params**: `/noteID`

**Success Responses**:

- **Code**: `200 OK`

  ```json
  {
      "status": "200",
      "message": "Note deleted successfully",
      "data": {
          "_id": "noteID",
          "title": "Sample Note Title",
          "description": "This is a sample description.",
          "user_id": "userID",
          "changes": [],
          "status": "hidden"
      }
  }
  ```

**Error Responses:**

- **Code**: `404 Not Found`, 

  ```json
  {
    "status": 404,
    "message": "Note not found"
  }
  ```

- **Code** `500 Internal Server Error`

  ```json
  {
    "status": 500,
    "message": "Error deleting note"
  }
  ```

