const Joi = require("joi");

module.exports.serviceSchema = Joi.object({
  service: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
    category: Joi.string()
      .valid(
        "Food",
        "Art",
        "Electronics",
        "Games",
        "Home Decor",
        "Jewellery",
        "KitchenWare",
        "Others",
      )
      .required(),
  }).required(),
});

module.exports.reviewschema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required(),
  }).required(),
});
