const express = require("express");
const router = express.Router();
const multer = require("multer");

const profileController = require("../controllers/profile");
const { isLoggedin } = require("../middleware");
const { storage } = require("../cloudConfig");

const upload = multer({ storage });

// Profile
router.get("/", isLoggedin, profileController.profile);

// My Posts
router.get("/posts", isLoggedin, profileController.posts);

// Favorites
router.get("/favorites", isLoggedin, profileController.favorites);

// Add Favorite
router.post(
    "/favorites/:id",
    isLoggedin,
    profileController.addFavorite
);

// Remove Favorite
router.delete(
    "/favorites/:id",
    isLoggedin,
    profileController.removeFavorite
);

// Edit Profile
router.get("/edit", isLoggedin, profileController.editProfile);

// Update Profile
router.put(
    "/",
    isLoggedin,
    upload.single("profileImage"),
    profileController.updateProfile
);

// show profile
router.get(
    "/user/:id",
    profileController.publicProfile
);

// Delete Account
router.delete("/", isLoggedin, profileController.deleteAccount);

module.exports = router;