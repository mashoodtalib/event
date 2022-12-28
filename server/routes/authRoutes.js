const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
//
require("dotenv").config();

// //
const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");

// nodemailer
async function mailer(recieveremail, code) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,

    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: process.env.Nodemail_email, // generated ethereal user
      pass: process.env.Nodemail_password, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "Play your Life", // sender address
    to: `${recieveremail}`, // list of receivers
    subject: "Email Verification", // Subject line
    text: `Your Verification Code is ${code}`, // plain text body
    html: `<b>Your Verification Code is ${code}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

// //

router.post("/signup", async (req, res) => {
  console.log("sent by client - ", req.body);
  const { userName, name, email, password } = req.body;

  const user = new User({
    userName,
    name,
    email,
    password,
  });

  try {
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // const id = _id;
    // // const { _id, userName, email } = savedUser;

    res.send({
      message: "User Registered Successfully",
      token,
      user: { userName, name, email, password },
    });
  } catch (err) {
    console.log(err);
  }
});
router.post("/userdata", (req, res) => {
  const { authorization } = req.headers;
  //    authorization = "Bearer afasgsdgsdgdafas"
  if (!authorization) {
    return res
      .status(401)
      .json({ error: "You must be logged in, token not given" });
  }
  const token = authorization.replace("Bearer ", "");
  // console.log(token);

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res
        .status(401)
        .json({ error: "You must be logged in, token invalid" });
    }
    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      res.status(200).send({
        message: "User Found",
        user: userdata,
      });
    });
  });
});
router.post("/verify", (req, res) => {
  console.log("sent by client - ", req.body);
  const { email } = req.body;
  if (!email) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }
    try {
      let VerificationCode = Math.floor(100000 + Math.random() * 900000);
      let user = [
        {
          email,

          VerificationCode,
        },
      ];
      await mailer(email, VerificationCode);
      res.send({
        message: "Verification Code Sent to your Email",
        // VerificationCode:email,
        udata: user,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

router.post("/signin", (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    User.findOne({ userName: userName })
      .then((savedUser) => {
        if (!savedUser) {
          return res.status(422).json({ error: "Invalid Credentials" });
        } else {
          console.log(savedUser);
          bcrypt.compare(password, savedUser.password).then((doMatch) => {
            if (doMatch) {
              const token = jwt.sign(
                { _id: savedUser._id },
                process.env.JWT_SECRET
              );

              const { _id, userName, password } = savedUser;

              res.json({
                message: "Successfully Signed In",
                token,
                user: { _id, userName, password },
              });
            } else {
              return res.status(422).json({ error: "Invalid Credentials" });
            }
          });
          // res.status(200).json({ message: "User Logged In Successfully", savedUser });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.post("/changepassword", (req, res) => {
  const { oldpassword, newpassword, email } = req.body;

  if (!oldpassword || !newpassword || !email) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    User.findOne({ email: email }).then(async (savedUser) => {
      if (savedUser) {
        bcrypt.compare(oldpassword, savedUser.password).then((doMatch) => {
          if (doMatch) {
            savedUser.password = newpassword;
            savedUser
              .save()
              .then((user) => {
                res.json({ message: "Password Changed Successfully" });
              })
              .catch((err) => {
                // console.log(err);
                return res.status(422).json({ error: "Server Error" });
              });
          } else {
            return res.status(422).json({ error: "Invalid Credentials" });
          }
        });
      } else {
        return res.status(422).json({ error: "Invalid Credentials" });
      }
    });
  }
});

router.post("/resetpassword", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    User.findOne({ email: email }).then(async (savedUser) => {
      if (savedUser) {
        savedUser.password = password;
        savedUser
          .save()
          .then((user) => {
            res.json({ message: "Password Changed Successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return res.status(422).json({ error: "Invalid Credentials" });
      }
    });
  }
});

router.post("/setusername", (req, res) => {
  const { userName, email } = req.body;
  if (!userName || !email) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  User.find({ userName }).then(async (savedUser) => {
    if (savedUser.length > 0) {
      return res.status(422).json({ error: "Username already exists" });
    } else {
      User.findOne({ email: email }).then(async (savedUser) => {
        if (savedUser) {
          savedUser.userName = userName;
          savedUser
            .save()
            .then((user) => {
              res.json({ message: "Username Updated Successfully" });
            })
            .catch((err) => {
              return res.status(422).json({ error: "Server Error" });
            });
        } else {
          return res.status(422).json({ error: "Invalid Credentials" });
        }
      });
    }
  });
});

router.post("/searchuser", (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(422).json({ error: "Please search a username" });
  }

  User.find({ userName: { $regex: keyword, $options: "i" } })
    .then((user) => {
      // console.log(user);
      let data = [];
      user.map((item) => {
        data.push({
          _id: item._id,
          username: item.userName,
          email: item.email,
          profile_pic: item.profile_pic,
        });
      });

      // console.log(data);
      if (data.length == 0) {
        return res.status(422).json({ error: "No User Found" });
      }
      res.status(200).send({ message: "User Found", user: data });
    })
    .catch((err) => {
      res.status(422).json({ error: "Server Error" });
    });
});

// get other user

router.post("/otheruserdata", (req, res) => {
  const { email } = req.body;

  User.findOne({ email: email }).then((saveduser) => {
    if (!saveduser) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }
    //    console.log(saveduser);

    let data = {
      _id: saveduser._id,
      userName: saveduser.userName,
      email: saveduser.email,
      description: saveduser.description,
      profile_pic: saveduser.profile_pic,
      followers: saveduser.followers,
      following: saveduser.following,
    };

    // console.log(data);

    res.status(200).send({
      user: data,
      message: "User Found",
    });
  });
});
router.post("/getuserbyid", (req, res) => {
  const { userid } = req.body;

  User.findById({ _id: userid })
    .then((saveduser) => {
      if (!saveduser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      }
      //    console.log(saveduser);

      let data = {
        _id: saveduser._id,
        username: saveduser.username,
        email: saveduser.email,
        description: saveduser.description,
        profilepic: saveduser.profilepic,
        followers: saveduser.followers,
        following: saveduser.following,
        posts: saveduser.posts,
      };

      // console.log(data);

      res.status(200).send({
        user: data,
        message: "User Found",
      });
    })
    .catch((err) => {
      console.log("error in getuserbyid ");
    });
});

// follow user
router.post("/followuser", (req, res) => {
  const { followfrom, followto } = req.body;
  console.log(followfrom, followto);
  if (!followfrom || !followto) {
    return res.status(422).json({ error: "Invalid Credentials" });
  }
  User.findOne({ email: followfrom })
    .then((mainuser) => {
      if (!mainuser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      } else {
        if (mainuser.following.includes(followto)) {
          console.log("already following");
        } else {
          mainuser.following.push(followto);
          mainuser.save();
        }
        // console.log(mainuser);

        User.findOne({ email: followto })
          .then((otheruser) => {
            if (!otheruser) {
              return res.status(422).json({ error: "Invalid Credentials" });
            } else {
              if (otheruser.followers.includes(followfrom)) {
                console.log("already followed");
              } else {
                otheruser.followers.push(followfrom);
                otheruser.save();
              }
              res.status(200).send({
                message: "User Followed",
              });
            }
          })
          .catch((err) => {
            return res.status(422).json({ error: "Server Error" });
          });
      }
    })
    .catch((err) => {
      return res.status(422).json({ error: "Server Error" });
    });
});
module.exports = router;
