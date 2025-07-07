const express = require("express");
const { logOut, logIn, deleteUser, signUp, getSubjects, addSubjects, getUsers } = require("../controllers/user.controller");
const { validateLogIn, validateDeleteUser, validateSignUp, validateGetSubjects} = require("../middlewares/validationMiddleware");

const router = express.Router();

router.get("/", getUsers);

router.post("/signup", validateSignUp, signUp);

router.post("/login", validateLogIn, logIn);

router.post("/logout", logOut);

router.delete("/delete", validateDeleteUser,deleteUser);

//TODO: Optimize remaining routes

router.get("/teachers/:id/subjects", validateGetSubjects, getSubjects);

router.put("/teacher/:id/add-subject", addSubjects);


module.exports = router;
