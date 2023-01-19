const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/uploadimage", upload.single("image"), async (req, res) => {
  const { email } = req.body;
  const saveImage = User.findOne(
    { email: email },
    {
      profile_pic_name: req.body.name,
      profile_pic: {
        data: fs.readFileSync("uploads/" + req.file.filename),
        contentType: "image/png",
      },
    }
  );
  saveImage
    .save()
    .then((res) => {
      console.log("image is saved");
    })
    .catch((err) => {
      console.log(err, "eror occured");
    });
});

router.post("/addpost", (req, res) => {
  const { email, post, postdescription } = req.body;

  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      }
      savedUser.posts.push({ post, postdescription, likes: [], comments: [] });
      savedUser
        .save()
        .then((user) => {
          res.json({ message: "Post added successfully" });
        })
        .catch((err) => {
          res.json({ error: "Error adding post" });
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
