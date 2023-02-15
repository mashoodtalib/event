const express = require("express");
const crypto = require("crypto");

const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
//
require("dotenv").config();
const validator = require("validator");

// //
const bcrypt = require("bcrypt");
const { Expo } = require("expo-server-sdk");

const nodemailer = require("nodemailer");
const expo = new Expo();

// nodemailer
async function mailer(recieveremail, code) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,

    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: "talibmashood@gmail.com",
      pass: "qzbjqhvkecstcelu", // generated ethereal password
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
const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const passwordResetToken = generatePasswordResetToken();
    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "talibmashood@gmail.com",
        pass: "qzbjqhvkecstcelu",
      },
    });
    const mailOptions = {
      from: "talibmashood@gmail.com",
      to: user.email,
      subject: "Password reset",
      text: `Reset Password Confirmation is Set`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send({ error: "Server error" });
      }
      return res.send({ message: "Password reset email sent" });
    });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
});
router.post("/reset-password", async (req, res) => {
  try {
    const user = await User.findOne({
      passwordResetToken: req.body.passwordResetToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).send({ error: "Invalid password reset token" });
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return res.send({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
});

router.post("/signup", async (req, res) => {
  console.log("sent by client - ", req.body);
  const { userName, name, email, password, deviceToken } = req.body;

  if (!validator.isEmail(email)) {
    res.send({
      message: "Invalid email address",
    });
    User.findOne({ email: email, userName: userName }).then((userdata) => {
      res.send({
        message: "Email or userName Already exist",
      });
    });
  } else {
    const user = new User({
      userName,
      name,
      email,
      password,
      deviceToken,
    });
    try {
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      // const id = _id;
      // // const { _id, userName, email } = savedUser;

      res.send({
        message: "User Registered Successfully",
        token,
        user: { userName, name, email, password, deviceToken },
      });
    } catch (err) {
      console.log(err);
    }
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
    if (!savedUser) {
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
router.post("/verifyfp", (req, res) => {
  console.log("sent by client", req.body);
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser) {
      try {
        let VerificationCode = Math.floor(100000 + Math.random() * 900000);
        await mailer(email, VerificationCode);
        console.log("Verification Code", VerificationCode);
        res.send({
          message: "Verification Code Sent to your Email",
          VerificationCode,
          email,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      return res.status(422).json({ error: "Invalid Credentials" });
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
              let data = {
                _id: savedUser._id,
                userName: savedUser.userName,
                name: savedUser.name,
                email: savedUser.email,
                deviceToken: savedUser.deviceToken,
                profile_pic_name: savedUser.profile_pic_name,
                bio: savedUser.bio,
                links: savedUser.links,
                followers: savedUser.followers,
                following: savedUser.following,
                allmessages: savedUser.allmessages,
                allevents: savedUser.allevents,
                accevents: savedUser.accevents,
                acceventsfrom: savedUser.acceventsfrom,

                passwordResetToken: savedUser.passwordResetToken,
                passwordResetExpires: savedUser.passwordResetExpires,
              };
              //   const { _id, userName, password, email } = savedUser;

              res.json({
                message: "Successfully Signed In",
                token,
                user: data,
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
  const { oldpassword, newpassword, userName } = req.body;

  if (!oldpassword || !newpassword || !userName) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    User.findOne({ userName: userName }).then(async (savedUser) => {
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

  User.find({ userName: userName }).then(async (savedUser) => {
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

router.post("/setbio", (req, res) => {
  const { bio, email } = req.body;
  if (!bio || !email) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  User.find({ bio: bio }).then(async (savedUser) => {
    if (savedUser.length > 0) {
      return res.status(422).json({ error: "Bio already exists" });
    } else {
      User.findOne({ email: email }).then(async (saveduser) => {
        const token = jwt.sign({ _id: saveduser._id }, process.env.JWT_SECRET);
        if (saveduser) {
          saveduser.bio = bio;
          let data = {
            _id: saveduser._id,
            userName: saveduser.userName,
            name: saveduser.name,
            deviceToken: saveduser.deviceToken,
            email: email,
            profile_pic_name: saveduser.profile_pic_name,
            bio: bio,
            links: saveduser.links,
            followers: saveduser.followers,
            following: saveduser.following,
            allmessages: saveduser.allmessages,
            allevents: saveduser.allevents,
            accevents: saveduser.accevents,
            passwordResetToken: saveduser.passwordResetToken,
            passwordResetExpires: saveduser.passwordResetExpires,
            acceventsfrom: saveduser.acceventsfrom,
          };
          saveduser.save();
          res.status(200).send({
            message: "Bio Updated Successfully",
            token,
            user: data,
          });
        } else {
          return res.status(422).json({ error: "Invalid Credentials" });
        }
      });
    }
  });
});
router.post("/setlink", (req, res) => {
  const { links, email } = req.body;
  if (!links || !email) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  User.find({ links: links }).then(async (savedUser) => {
    if (savedUser.length > 0) {
      return res.status(422).json({ error: "links already exists" });
    } else {
      User.findOne({ email: email }).then(async (saveduser) => {
        const token = jwt.sign({ _id: saveduser._id }, process.env.JWT_SECRET);
        if (saveduser) {
          saveduser.links = links;
          let data = {
            _id: saveduser._id,
            userName: saveduser.userName,
            name: saveduser.name,
            deviceToken: saveduser.deviceToken,
            email: email,
            profile_pic_name: saveduser.profile_pic_name,
            bio: saveduser.bio,
            links: links,
            followers: saveduser.followers,
            following: saveduser.following,
            allmessages: saveduser.allmessages,
            allevents: saveduser.allevents,
            accevents: saveduser.accevents,
            passwordResetToken: saveduser.passwordResetToken,
            passwordResetExpires: saveduser.passwordResetExpires,
            acceventsfrom: saveduser.acceventsfrom,
          };
          saveduser.save();
          res.status(200).send({
            message: "links Updated Successfully",
            token,
            user: data,
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
          userName: item.userName,
          email: item.email,
          profile_pic_name: item.profile_pic_name,
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
      name: saveduser.name,
      deviceToken: saveduser.deviceToken,
      email: saveduser.email,
      profile_pic_name: saveduser.profile_pic_name,
      bio: saveduser.bio,
      links: saveduser.links,
      followers: saveduser.followers,
      following: saveduser.following,
      allmessages: saveduser.allmessages,
      allevents: saveduser.allevents,
      accevents: saveduser.accevents,
      passwordResetToken: saveduser.passwordResetToken,
      passwordResetExpires: saveduser.passwordResetExpires,
      acceventsfrom: saveduser.acceventsfrom,
    };

    // console.log(data);

    res.status(200).send({
      user: data,
      message: "User Found",
    });
  });
});
router.get("/:userName", (req, res) => {
  console.log(req.params.userName);
  User.findOne({ userName: req.params.userName }, (err, user) => {
    if (err) {
      console.log(err);
    } else if (user) {
      console.log(user);
      res.send(user);
    } else {
      console.log("User not found");
      res.send("User not found");
    }
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
        userName: saveduser.userName,
        name: saveduser.name,
        deviceToken: saveduser.deviceToken,
        email: saveduser.email,
        profile_pic_name: saveduser.profile_pic_name,
        bio: saveduser.bio,
        links: saveduser.links,
        followers: saveduser.followers,
        following: saveduser.following,
        allmessages: saveduser.allmessages,
        allevents: saveduser.allevents,
        accevents: saveduser.accevents,
        acceventsfrom: saveduser.acceventsfrom,
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
router.post("/checkfollow", (req, res) => {
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
        let data = mainuser.following.includes(followto);
        console.log(data);
        if (data == true) {
          res.status(200).send({
            message: "User in following list",
          });
        } else {
          res.status(200).send({
            message: "User not in following list",
          });
        }
      }
    })
    .catch((err) => {
      return res.status(422).json({ error: "Server Error" });
    });
});

// unfollow user
router.post("/unfollowuser", (req, res) => {
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
          let index = mainuser.following.indexOf(followto);
          mainuser.following.splice(index, 1);
          mainuser.save();

          User.findOne({ email: followto })
            .then((otheruser) => {
              if (!otheruser) {
                return res.status(422).json({ error: "Invalid Credentials" });
              } else {
                if (otheruser.followers.includes(followfrom)) {
                  let index = otheruser.followers.indexOf(followfrom);
                  otheruser.followers.splice(index, 1);
                  otheruser.save();
                }
                res.status(200).send({
                  message: "User Unfollowed",
                });
              }
            })
            .catch((err) => {
              return res.status(422).json({ error: "Server Error" });
            });
        } else {
          console.log("not following");
        }
        // console.log(mainuser);
      }
    })
    .catch((err) => {
      return res.status(422).json({ error: "Server Error" });
    });
});

router.post("/send-notification", (req, res) => {
  const targetUser = req.body.targetUser;
  const message = req.body.message;
  const title = req.body.title;

  // User.findOne({ deviceToken: targetUser }).then((save));
  // Get the target user's device token from the database based on their identifier
  //const deviceToken = getDeviceTokenFromDatabase(targetUser);

  // Create a new push notification and add it to the messages array
  const messages = [
    {
      to: targetUser,
      sound: "default",
      title: title,
      body: message,
      data: {
        title: title,
        message: message,
      },
    },
  ];

  // Send the push notifications
  expo
    .sendPushNotificationsAsync(messages)
    .then((ticketIds) => {
      console.log(`Notifications sent: ${ticketIds}`);
      res.send({ success: true });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: "Failed to send push notification" });
    });
});
router.post("/alluser", (req, res) => {
  User.find({}, (err, events) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(events);
  });
});
module.exports = router;
