const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const serviceschema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1444260239795-df1f0772a252?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    // set: (v)=> v === "" ? "https://images.unsplash.com/photo-1444260239795-df1f0772a252?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D": v,
  },
  price: Number,
  location: String,
  country: String,
  category: {
    type: String,
     enum: [
        "Art",
        "Food",
        "Pottery",
        "Handicrafts",
        "Jewellery",
        "Home Decor",
        "Kitchenware",
        "Gifts",
        "Others"
    ],
    default: "Trending",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

serviceschema.post("findOneAndDelete", async (service) => {
  if (service) {
    await Review.deleteMany({ _id: { $in: service.reviews } });
  }
});
const Service = mongoose.model("Service", serviceschema);
module.exports = Service;
