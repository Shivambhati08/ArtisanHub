const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/google",

passport.authenticate("google",{

scope:["profile","email"]

})

);

router.get("/google/callback",

passport.authenticate("google",{

failureRedirect:"/login",
failureFlash:true

}),

(req,res)=>{

req.flash("success","Logged in with Google!");

res.redirect("/services");

}

);

module.exports = router;