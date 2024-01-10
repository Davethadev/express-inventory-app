const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
});

// Virtual for category's URL
CategorySchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/store/category/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
