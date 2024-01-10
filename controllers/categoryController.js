const Category = require("../models/category");
const Furniture = require("../models/furniture");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.categories_list = async (req, res, next) => {
  try {
    const allCategories = await Category.find().sort({ name: 1 }).exec();
    res.render("categories_list", {
      title: "Categories",
      categories: allCategories,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.get_category = async (req, res, next) => {
  try {
    const [category, furnitureInCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Furniture.find({ category: req.params.id }, "name price").exec(),
    ]);
    if (category === null) {
      // No results.
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
    res.render("category_detail", {
      title: "Category",
      category: category,
      category_furniture: furnitureInCategory,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.create_category_get = async (req, res, next) => {
  try {
    res.render("category_form", { title: "Create new category" });
  } catch (error) {
    console.error(error);
  }
};

exports.create_category_post = [
  // Validate and sanitize the name field.
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (categoryExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New category saved. Redirect to category detail page.
        res.redirect(category.url);
      }
    }
  }),
];

exports.update_category_get = async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    // No results
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: "Update Category",
    category: category,
  });
};

exports.update_category_post = [
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("Update Category", {
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        {}
      );
      // Redirect to category detail page.
      res.redirect(updatedCategory.url);
    }
  }),
];

exports.delete_category_get = asyncHandler(async (req, res, next) => {
  // Get details of category and all their furniture (in parallel)
  const [category, allFurnitureOfCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Furniture.find({ category: req.params.id }, "name price").exec(),
  ]);

  if (category === null) {
    // No results.
    res.redirect("/store/category");
  }

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    category_furniture: allFurnitureOfCategory,
  });
});

exports.delete_category_post = asyncHandler(async (req, res, next) => {
  // Get details of category and all their furniture (in parallel)
  const [category, allFurnitureOfCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Furniture.find({ category: req.params.id }, "name price").exec(),
  ]);

  if (allFurnitureOfCategory > 0) {
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_furniture: allFurnitureOfCategory,
    });
    return;
  } else {
    await Category.findByIdAndDelete(req.params.id).exec();
    res.redirect("/store/categories");
  }
});
