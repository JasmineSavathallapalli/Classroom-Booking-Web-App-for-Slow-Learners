## **User API Documentation**

### **Base URL**
```
http://localhost:5000/api/users
```

---

## **1️⃣ User Signup**
**Endpoint:** `POST /signup`  
**Description:** Registers a new user.  

**Request Body (JSON):**  
```json
{
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "password": "password123",
    "role": "student",
    "registerNumber": "REG12345",
    "programme": "MCA"
}
```
- If **role = "student"**, `registerNumber` and `programme` are required.  
- If **role = "teacher"**, `subjectsTeaching` will be added later via profile update.  

**Response (Success - 201 Created):**  
```json
{
    "message": "User registered successfully"
}
```
**Response (Error - 400 Bad Request):**  
```json
{
    "message": "User already exists"
}
```

---

## **2️⃣ User Login**
**Endpoint:** `POST /login`  
**Description:** Logs in a user.  

**Request Body (JSON):**  
```json
{
    "email": "johndoe@gmail.com",
    "password": "password123"
}
```
**Response (Success - 200 OK):**  
```json
{
    "message": "Login successful",
    "user": {
        "id": "65abcd1234ef5678",
        "role": "student"
    }
}
```
**Response (Error - 400 Bad Request):**  
```json
{
    "message": "Invalid email or password"
}
```

---

## **3️⃣ User Logout**
**Endpoint:** `POST /logout`  
**Description:** Logs out the user.  

**Response (Success - 200 OK):**  
```json
{
    "message": "Logged out successfully"
}
```

---

## **4️⃣ Delete User**
**Endpoint:** `DELETE /delete/:id`  
**Description:** Deletes a user by ID.  

**Response (Success - 200 OK):**  
```json
{
    "message": "User deleted successfully"
}
```
**Response (Error - 404 Not Found):**  
```json
{
    "message": "User not found"
}
```

---

## **Classroom API Documentation**

### **Base URL**
```
http://localhost:5000/api/classrooms
```

---

## **1️⃣ Fetch All Classrooms**
**Endpoint:** `GET /list`  
**Description:** Retrieves all classrooms.  

**Response (Success - 200 OK):**  
```json
[
    {
        "_id": "65f123abc456def789000111",
        "name": "Room A101",
        "capacity": 30
    }
]
```
**Response (Error - 500 Server Error):**  
```json
{
    "message": "Server Error"
}
```

---

## **2️⃣ Add Classroom**
**Endpoint:** `POST /add`  
**Description:** Adds a new classroom.  

**Request Body (JSON):**  
```json
{
    "name": "Room B202",
    "capacity": 40
}
```
**Response (Success - 200 OK):**  
```json
{
    "message": "Classroom added successfully"
}
```
**Response (Error - 500 Server Error):**  
```json
{
    "message": "Server Error"
}
```

---

## **3️⃣ Delete Classroom**
**Endpoint:** `DELETE /delete/:id`  
**Description:** Deletes a classroom by ID.  

**Response (Success - 200 OK):**  
```json
{
    "message": "Classroom deleted successfully"
}
```
**Response (Error - 404 Not Found):**  
```json
{
    "message": "Classroom not found"
}
```
