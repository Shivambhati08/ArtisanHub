const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const Service = require("../models/service.js");
const { isLoggedin, isOwner, validateService } = require("../middleware.js");
const serviceController = require("../controllers/services.js");
const multer  = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router
  .route("/")
  // Index Route
  .get(wrapasync(serviceController.index))

  // Create Route
  .post(
    isLoggedin,
    upload.single("service[image]"),
    validateService,
    wrapasync(serviceController.createService),
  );

// New Route
router.get("/new", isLoggedin, serviceController.renderNewForm);

router
  // Search Routes
  .get("/search", wrapasync(serviceController.searchServices))
  
  .route("/:id")
  // Show Route
  .get(wrapasync(serviceController.showService))
  // Update Route
  .put(
    isLoggedin,
    isOwner,
    upload.single("service[image]"),
    validateService,
    wrapasync(serviceController.updateService),
  )
  // Delete Route
  .delete(isLoggedin, isOwner, wrapasync(serviceController.destroyService));

// Edit Route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapasync(serviceController.renderEditForm),
)
.get(
    "/category/:category",
    wrapasync(serviceController.filterByCategory)
);

module.exports = router;
