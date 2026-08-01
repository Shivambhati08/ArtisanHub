const Service = require("./models/service");
const ExpressError = require("./utils/ExpressError");
const { serviceSchema , reviewschema}= require("./schema");
const  Review = require("./models/review");

module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl =  req.get("Referrer") || "/services";
    req.flash("error", "you must be logged in to add your services!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res, next)=>{
  let {id} = req.params;
  let service = await Service.findById(id);
  if(!service.owner.equals(res.locals.currUser._id)){
    req.flash("error", "You don't have permission to edit this service");
    return res.redirect(`/services/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async(req, res, next)=>{
  let { id, reviewid} = req.params;
  let review = await Review.findById(reviewid);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "You are not author of this review");
    return res.redirect(`/services/${id}`);
  }
  next();
}

module.exports.validateService = (req, res, next) => {
  let { error } = serviceSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validatereview = (req, res, next) => {
  let { error } = reviewschema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};
