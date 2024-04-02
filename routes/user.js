const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {savedRedirectUrl} = require("../middleware.js")

const controllerUsers = require("../controller/users.js");





router.get("/signup", controllerUsers.signupForm);


router.post("/signup", wrapAsync(controllerUsers.signup));


router.get("/login", controllerUsers.renderLoginForm );

    router.post("/login", savedRedirectUrl, passport.authenticate("local", 
    {failureRedirect:"/login",
     failureFlash:true,}), controllerUsers.login);


    router.get("/logout", controllerUsers.logout);







module.exports = router;