var express = require("express");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var productsShcema = new Schema({
  _id: mongoose.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true }
});
var productsModel = mongoose.model("Product", productsShcema);
module.exports = productsModel;
