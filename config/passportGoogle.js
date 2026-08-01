const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

module.exports = function(passport){

    console.log("BASE_URL =", process.env.BASE_URL);
console.log("Callback URL =", `${process.env.BASE_URL}/auth/google/callback`);
passport.use(

new GoogleStrategy(

{
clientID:process.env.GOOGLE_CLIENT_ID,
clientSecret:process.env.GOOGLE_CLIENT_SECRET,
callbackURL:`${process.env.BASE_URL}/auth/google/callback`,
},

async(accessToken,refreshToken,profile,done)=>{

try{

let user = await User.findOne({
googleId:profile.id
});

if(user){
return done(null,user);
}

const email = profile.emails[0].value;

user = await User.findOne({email});

if(user){

user.googleId = profile.id;

if(profile.photos.length){
user.profileImage.url = profile.photos[0].value;
}

await user.save();

return done(null,user);

}

const newUser = new User({

username:profile.displayName.replace(/\s/g,""),

email,

googleId:profile.id,

profileImage:{
url:profile.photos[0].value,
filename:"google-profile"
}

});

await newUser.save();

done(null,newUser);

}

catch(err){

done(err,false);

}

}

)

);

}