const express = require("express");
const session = require("express-session");
// const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require("./src/config/db");

const authenticateUser = require('./src/middlewares/authMiddleware')

// Routes
const userRoutes = require("./src/routes/user.routes");

const classroomRoutes = require("./src/routes/classroom.routes");

const sessionRoutes = require("./src/routes/session.routes")

const authRoutes = require("./src/routes/auth.routes");

const bookingRoutes = require("./src/routes/booking.routes")

const attendanceRoutes = require("./src/routes/attendance.routes")

const materialRoutes = require("./src/routes/material.routes")

const chatRoutes = require("./src/routes/chat.routes");

const app = express();
connectDB();

// CORS Configuration
app.use(
  cors({
      origin: "http://localhost:5173", // Frontend URL
      credentials: true, // for session cookies
  })
);

app.use(express.json());

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ----------------------API ROUTES------------------------------

/* 
    /api/users/signup
    /api/users/login
    /api/users/logout
    /api/users/delete
*/
app.use("/api/users", userRoutes);

// Protected routes (Must be logged in to access)
//TODO: Implement authentication properly
app.use(authenticateUser); // Middleware for authenticating the user before accessing the below routes
/*
    /api/sessions/
    /api/sessions/create
    /api/sessions/delete
*/
app.use("/api/sessions",sessionRoutes);


/* 
    /api/classrooms/list
    /api/classrooms/add
    /api/classrooms/delete
*/
app.use("/api/classrooms", classroomRoutes);


// For the FE to access BE session data
app.use("/auth", authRoutes);
/*
    /api/bookings
*/
app.use("/api/bookings", bookingRoutes)

app.use("/api/attendance",attendanceRoutes)

app.use("/api/materials/", materialRoutes)

app.use("/api/chat", chatRoutes);

app.listen(5000, () => console.log(`Backend is running on port 5000`));
