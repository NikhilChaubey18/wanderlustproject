
const User = require("../models/user.js");


module.exports.signupForm = (req,res) => {
    res.render("users/signup.ejs")
    
    };


module.exports.signup = async(req,res) => {
    try{

        let {username, email, password} = req.body;
const newUser = new User({username, email});
const registeredUser = await User.register(newUser, password);
console.log(registeredUser);
// console.log(req.body);
req.login(registeredUser, (err) => {
    if(err) {
        return next(err);
    };
    req.flash("success", "Welcome to wanderlust");
res.redirect("/listings");
});

    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }


};

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs")
    
    };

    module.exports.login = async(req,res) => {
        

        req.flash("success", "Welcome Back to Wanderlust");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    };


    module.exports.logout = (req,res,next) => {
        req.logout((err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "You are logged out");
            res.redirect("/listings");
        })
    };