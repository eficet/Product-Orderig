const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Products = require("../models/products");
const multer= require('multer');
const auth= require('../middlewares/checkAuth');
const storage= multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'./uploads/');
  },
  filename:(req,file,cb)=>{
    cb(null,file.originalname);
  }
})
//execute multer - initialize multer
//const upload = multer({dest:'uploads/'});
const upload = multer({storage:storage});

router.get("/",auth, async (req, res) => {
  try {
    var products = await Products.find();
    res
      .status(200)
      .json({ message: "Products successfully found", data: products });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//    CALLBACKS

// router.get("/:id", (req, res) => {
//   var product = Products.findById(req.params.id, (err, result) => {
//     if (err) throw err;
//     juka = result;
//     res.json({
//       message: "successfully found product",
//       data: result
//     });
//   });
// });

//    PROMISES

// router.get("/:id", (req, res) => {
//   var product = Products.findById(req.params.id)
//     .exec()
//     .then(result =>
//       res.json({
//         message: "successfully found product",
//         data: result
//       })
//     ).catch(err =>{
//       res.json(err);
//       console.log(err);
//     })
// });

// ASYNC AWAIT

router.get("/:id",auth, async (req, res) => {
  const id = req.params.id;
  try {
    var product = await Products.findById(id);
    if (product) {
      res.json({ message: "successfully found product", data: product });
    } else {
      res.status(400).json({
        message: "couldnt find product with id : " + id
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post("/",upload.single('productImage'),auth, async (req, res) => {
 console.log(req.file.path);
  var newProduct = new Products({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    imageUrl:req.file.path
  });
  try {
    var product = await newProduct.save();
    res.status(201).json({
      message: "succesfully added products",
      data: product
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});
  
  router.put("/:id",auth, async (req, res) => {
    const id = req.params.id;
    try{
     var product=await Products.findByIdAndUpdate(id,req.body,{useFindAndModify:false});
     res.status(200).json(product);
  }catch(err){
    console.log(err);
    res.status(500).json("")
  }
  });

  router.delete("/:id",auth, async (req, res) => {
    const id = req.params.id;
    try {
      await Products.remove({ _id: id });
      res.json({ message: "successfully removed product with id : " + id });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "couldnt remove product with id " + id
      });
    }
  });
module.exports = router;
