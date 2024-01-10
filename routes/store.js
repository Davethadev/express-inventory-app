const express = require("express");
const router = express.Router();

const furniture_controller = require("../controllers/furnitureController");
const category_controller = require("../controllers/categoryController");

/// FURNITURE ROUTES ///

// GET store home page.
router.get("/", furniture_controller.index);

// GET request for creating a furniture. NOTE This must come before routes that display Furniture (uses id).
router.get("/furniture/create", furniture_controller.create_furniture_get);

// POST request for creating Furniture.
router.post("/furniture/create", furniture_controller.create_furniture_post);

// GET request to delete Furniture.
router.get("/furniture/:id/delete", furniture_controller.delete_furniture_get);

// POST request to delete Furniture.
router.post(
  "/furniture/:id/delete",
  furniture_controller.delete_furniture_post
);

// GET request to update Furniture.
router.get("/furniture/:id/update", furniture_controller.update_furniture_get);

// POST request to update Furniture.
router.post(
  "/furniture/:id/update",
  furniture_controller.update_furniture_post
);

// GET request for one Furniture.
router.get("/furniture/:id", furniture_controller.get_furniture);

// GET request for list of all Furniture items.
router.get("/furniture", furniture_controller.furniture_list);

/// CATEGORY ROUTES ///

// GET request for creating a category. NOTE This must come before routes that display Category (uses id).
router.get("/category/create", category_controller.create_category_get);

// POST request for creating category.
router.post("/category/create", category_controller.create_category_post);

// GET request to delete category.
router.get("/category/:id/delete", category_controller.delete_category_get);

// POST request to delete category.
router.post("/category/:id/delete", category_controller.delete_category_post);

// GET request to update category.
router.get("/category/:id/update", category_controller.update_category_get);

// POST request to update category.
router.post("/category/:id/update", category_controller.update_category_post);

// GET request for one category.
router.get("/category/:id", category_controller.get_category);

// GET request for list of all category items.
router.get("/categories", category_controller.categories_list);

module.exports = router;
