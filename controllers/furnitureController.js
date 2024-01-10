const Furniture = require("../models/furniture");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  // Get details of categories and furniture (in parallel)
  const [numCategories, numFurniture] = await Promise.all([
    Category.countDocuments({}).exec(),
    Furniture.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Inventory Home",
    categories_count: numCategories,
    furniture_count: numFurniture,
  });
};

exports.furniture_list = async (req, res, next) => {
  try {
    const allFurniture = await Furniture.find().sort({ name: 1 }).exec();
    res.render("furniture_list", {
      title: "Furniture",
      furniture_list: allFurniture,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.get_furniture = async (req, res, next) => {
  try {
    const furniture = await Furniture.findById(req.params.id)
      .populate("category")
      .exec();
    res.render("furniture_detail", {
      title: "Furniture Detail",
      furniture: furniture,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.create_furniture_get = asyncHandler(async (req, res, next) => {
  // Get all categories and furniture which we can use for adding to our furniture.
  const [allFurniture, allCategories] = await Promise.all([
    Furniture.find().sort({ name: 1 }).exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  res.render("furniture_form", {
    title: "Create Furniture",
    furniture_list: allFurniture,
    categories: allCategories,
  });
});

exports.create_furniture_post = [
  // Convert the category to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 2 }).escape(),
  body("category.*").escape(),
  body("price", "Price must not be empty.").escape(),
  body("number_in_stock", "").escape(),
  body("description", "").trim().escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Furniture object with escaped and trimmed data.
    const furniture = new Furniture({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories for form.
      const allCategories = await Category.find().sort({ name: 1 }).exec();

      res.render("furniture_form", {
        title: "Create Furniture",
        categories: allCategories,
        furniture: furniture,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save furniture.
      await furniture.save();
      res.redirect(furniture.url);
    }
  }),
];

exports.update_furniture_get = async (req, res, next) => {
  const [furniture, allCategories] = await Promise.all([
    Furniture.findById(req.params.id).populate("category").exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  res.render("furniture_form", {
    title: "Update Furniture",
    furniture: furniture,
    categories: allCategories,
  });
};

exports.update_furniture_post = [
  // Convert the category to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 2 }).escape(),
  body("category.*").escape(),
  body("price", "Price must not be empty.").escape(),
  body("number_in_stock", "").escape(),
  body("description", "").trim().escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Furniture object with escaped and trimmed data.
    const furniture = new Furniture({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories for form.
      const allCategories = await Category.find().sort({ name: 1 }).exec();

      res.render("furniture_form", {
        title: "Update Furniture",
        categories: allCategories,
        furniture: furniture,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save furniture.
      const updatedFurniture = await Furniture.findByIdAndUpdate(
        req.params.id,
        furniture,
        {}
      ).exec();
      res.redirect(updatedFurniture.url);
    }
  }),
];

exports.delete_furniture_get = async (req, res, next) => {
  const furniture = Furniture.findById(req.params.id).exec();

  if (furniture === null) {
    // No results
    res.redirect("/store/furniture");
  }

  res.render("furniture_delete", {
    title: "Delete Furniture",
    furniture: furniture,
  });
};

exports.delete_furniture_post = async (req, res, next) => {
  try {
    await Furniture.findByIdAndDelete(req.params.id).exec();
    res.redirect("/store/furniture");
  } catch (error) {
    console.error(error);
  }
};
