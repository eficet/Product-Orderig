const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth= require('../middlewares/checkAuth');

router.post("/signup", async (req, res) => {
  try {
    var user = await User.find({ email: req.body.email });
    if (user.length > 0) {
      const error = new Error("user exists");
      error.status = 400;
      throw error;
    }
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 2)
    });
    var savedUser = await newUser.save();
    res.status(200).json({
      message: "successfuly created a user",
      data: savedUser
    });
  } catch (err) {
    console.log(err);
    res.status(err.status || 500).json({
      error: {
        message: err.message
      }
    });
  }
});
router.post("/login", async (req, res) => {
  const email = req.body.email;
  try {
    var findUser = await User.findOne({ email: email });
    if (!findUser) {
      var error = new Error("User not found");
      error.status = 400;
      throw error;
    } else {
      var checkPassword = await bcrypt.compare(req.body.password, findUser.password);
      if (checkPassword) {
        var token = jwt.sign(
          { email: findUser.email, _id: findUser._id },
         process.env.JWT_SECRET,
          {
            expiresIn: "1h"
          }
        );
        res.status(200).json({
          message:"auth successfull",
          token:token
        })
      }
      else{
        return res.status(400).json({
          message:'wrong password',
          path:req.originalUrl,
          method:req.method
    });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.delete("/:userId",auth, async (req, res) => {
  const id = req.params.userId;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({
      message: "successfuly deleted the user with id : " + id
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;
