const User = require("../models/user");
const Service = require("../models/service");
const Review = require("../models/review");

module.exports.profile = async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate("favorites");
    const services = await Service.find({
        owner: req.user._id,
    });
    const totalServices = services.length;
    const favoriteCount = user.favorites.length;
    const reviewCount = await Review.countDocuments({
        author: req.user._id,
    });
    res.render("profile/index", {
        user,
        services,
        totalServices,
        favoriteCount,
        reviewCount,
    });
};

module.exports.publicProfile = async (req, res) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        req.flash("error", "User not found");
        return res.redirect("/services");
    }

    const services = await Service.find({
        owner: user._id,
    });

    res.render("profile/public", {
        user,
        services,
    });
};

module.exports.posts = async(req,res)=>{
const services = await Service.find({
    owner:req.user._id
});
res.render("profile/posts",{services});
}

module.exports.favorites = async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate("favorites");

    res.render("profile/favorites", {
        services: user.favorites,
    });
};

module.exports.editProfile=(req,res)=>{
res.render("profile/edit",{user:req.user});
}

module.exports.updateProfile = async(req,res)=>{
const user = await User.findById(req.user._id);
user.bio=req.body.bio;
user.phone=req.body.phone;
if(req.file){
user.profileImage={
url:req.file.path,
filename:req.file.filename
}
}
await user.save();
req.flash("success","Profile Updated!");
res.redirect("/profile");
}

module.exports.deleteAccount = async(req,res)=>{
await Service.deleteMany({
owner:req.user._id
});
await Review.deleteMany({
author:req.user._id
});
await User.findByIdAndDelete(req.user._id);
req.logout(()=>{
res.redirect("/");
});
}



module.exports.addFavorite = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(req.params.id)) {
        user.favorites.push(req.params.id);
        await user.save();
    }

    req.flash("success", "Added to Favorites!");
    res.redirect("back");
};

module.exports.removeFavorite = async (req, res) => {
    const user = await User.findById(req.user._id);

    user.favorites.pull(req.params.id);

    await user.save();

    req.flash("success", "Removed from Favorites!");

    res.redirect("back");
};