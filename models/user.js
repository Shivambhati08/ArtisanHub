const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  googleId:{
        type:String,
        default:null
    },

  profileImage: {
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    },
    filename: {
      type: String,
      default: "default-profile",
    },
  },

  bio: {
    type: String,
    default: "",
  },

  phone: {
    type: String,
    default: "",
  },

  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);