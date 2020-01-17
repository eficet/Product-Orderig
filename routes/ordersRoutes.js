const express = require("express");
const mongoose = require("mongoose");
const OrderModel = require("../models/orders");
const ProductModel = require("../models/products");
const auth= require('../middlewares/checkAuth');
const router = express.Router();

router.get("/",auth, async (req, res) => {
  try {
    var products = await OrderModel.find().populate('product','name');
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.get("/:id",auth, async (req, res) => {
  const id = req.params.id;
  try{
  var order = await OrderModel.findById(id);
  if (!order) {
    res.status(400).json({
      message: "couldnt find order with id : " + id
    });
  }
  res.status(200).json({
    message: "successfully found the order",
    data: order
  });
}catch(err){
    console.log(err);
    res.status(500).json(err);
}
});

router.post("/",auth,async (req, res) => {
    console.log(req.file)
  var newOrder = new OrderModel({
    _id: mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    product: req.body.productId,
    name: req.body.name
  });
  try {
    var product = await ProductModel.findById(req.body.productId);
    if (!product) {
      res.status(400).json({
        message: "product not found"
      });
    }
    var savedOrder = await newOrder.save();
    res.status(201).json({
      message: "order successfuly created",
      data: savedOrder
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/",auth, async (req, res) => {
  const id = req.params.id;
  try {
    await OrderModel.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;
