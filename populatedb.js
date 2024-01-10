#! /usr/bin/env node

console.log(
  'This script populates some test furniture and categories to the database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Furniture = require("./models/furniture");
const Category = require("./models/category");

// const furniture = [];

const furniture = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createFurniture();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// category[0] will always be the Tables category, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
  const category = new Category({ name: name });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function furnitureCreate(
  index,
  name,
  description,
  category,
  price,
  number_in_stock
) {
  const furnituredetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    number_in_stock: number_in_stock,
  };
  if (category != false) furnituredetail.category = category;

  const newFurniture = new Furniture(furnituredetail);
  await newFurniture.save();
  furniture[index] = furniture;
  console.log(`Added furniture: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Tables"),
    categoryCreate(1, "Chairs"),
    categoryCreate(2, "Armchairs"),
    categoryCreate(3, "Dressers"),
    categoryCreate(4, "Bed"),
    categoryCreate(5, "Shelf"),
  ]);
}

async function createFurniture() {
  console.log("Adding Furniture");
  await Promise.all([
    furnitureCreate(0, "accent chair", "", [categories[1]], 29.99, 1),
    furnitureCreate(1, "albany sectional", "", [categories[3]], 109, 1),
    furnitureCreate(2, "albany table", "", [categories[0]], 309, 1),
    furnitureCreate(3, "armchair", "", [categories[2]], 125, 1),
    furnitureCreate(4, "bar stool", "", [categories[1]], 40, 1),
    furnitureCreate(5, "dining table", "", [categories[0]], 42, 1),
    furnitureCreate(6, "emperor bed", "", [categories[4]], 23, 1),
    furnitureCreate(7, "high-back bench", "", [categories[1]], 39, 1),
    furnitureCreate(8, "leather sofa", "", [categories[2]], 99, 1),
    furnitureCreate(9, "modern bookshelf", "", [categories[5]], 31, 1),
    furnitureCreate(10, "shelf", "", [categories[5]], 30, 1),
    furnitureCreate(11, "suede armchair", "", [categories[2]], 15, 1),
    furnitureCreate(12, "utopia sofa", "", [categories[2]], 79, 1),
    furnitureCreate(13, "vase table", "", [categories[0]], 120, 1),
    furnitureCreate(14, "wooden bed", "", [categories[4]], 25, 1),
    furnitureCreate(15, "wooden desk", "", [categories[0]], 40, 1),
    furnitureCreate(16, "wooden table", "", [categories[0]], 23, 1),
  ]);
}
