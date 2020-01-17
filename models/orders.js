const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" ,required:true},
  quantity: { type: Number, required: true }
});
const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;
