const Service = require("../models/service");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  let service = await Service.findById(req.params.id);
  let newreview = new Review(req.body.review);
  newreview.author = req.user._id;
  service.reviews.push(newreview);
  await newreview.save();
  await service.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/services/${service._id}`);
};

module.exports.destroyReview = async (req, res, next) => {
  let { id, reviewid } = req.params;
  await Service.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  req.flash("success", "Review Deleted!");
  res.redirect(`/services/${id}`);
};
