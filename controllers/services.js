const Service = require("../models/service");

module.exports.index =  async (req, res) => {
  const allServices = await Service.find({});
  res.render("services/index.ejs", { allServices });
}

module.exports.searchServices = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.redirect("/services");
    }

    const allServices = await Service.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } }
        ]
    });

    res.render("services/index.ejs", { allServices });
};
module.exports.filterByCategory = async (req, res) => {
    const { category } = req.params;

    const allServices = await Service.find({ category });

    res.render("services/index.ejs", { allServices });
};

module.exports.renderNewForm =  (req, res) => {
  res.render("services/new.ejs");
}

module.exports.showService = async (req, res) => {
    let { id } = req.params;
    const service = await Service.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!service) {
      req.flash("error", "service does't exists!");
      return res.redirect("/services");
    }
    res.render("services/show.ejs", { service });
  };

  module.exports.createService = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
      const newservice = new Service(req.body.service);
      newservice.owner = req.user._id;
      newservice.image = {url, filename};
      await newservice.save();
      req.flash("success", "New Service Created!");
      res.redirect("/services");
    };

    module.exports.renderEditForm =  async (req, res) => {
      let { id } = req.params;
      let service = await Service.findById(id);
      if (!service) {
        req.flash("error", "service does't exists!");
        return res.redirect("/services");
      }
      let OriginalImageurl = service.image.url;
      OriginalImageurl = OriginalImageurl.replace("/upload", "/upload/w_250");
      res.render("services/edit.ejs", { service, OriginalImageurl });
    };

    module.exports.updateService = async (req, res) => {
      let { id } = req.params;
      let service = await Service.findByIdAndUpdate(id, {...req.body.service});

      if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      service.image = {url, filename};
      await service.save();
      }

      req.flash("success", "Service updated!");
      res.redirect(`/services/${id}`);
  };

module.exports.destroyService = async (req, res) => {
    let { id } = req.params;
    let deleteService = await Service.findByIdAndDelete(id);
    req.flash("success", "Service Deleted!");
    res.redirect("/services");
  };