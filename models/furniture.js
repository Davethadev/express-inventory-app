const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FurnitureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  number_in_stock: {
    type: Number,
  },
});

// Virtual for furniture's URL
FurnitureSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/store/furniture/${this._id}`;
});

module.exports = mongoose.model("Furniture", FurnitureSchema);
