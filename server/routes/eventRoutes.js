const express = require("express");
require("dotenv").config();
const moment = require("moment");
const { Expo } = require("expo-server-sdk");

const expo = new Expo();
const router = express.Router();
const mongoose = require("mongoose");
const Event = mongoose.model("event");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const { createServer } = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const httpServer = createServer();

const io = new Server(httpServer, {
  /* options */
});
const expoPushToken = "ExponentPushToken[ThiiGiEPnxQy-yWoqEhPiK]";

io.on("connection", (socket) => {
  console.log("USER CONNECTED - ", socket.id);

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED - ", socket.id);
  });

  socket.on("eventNames", (data) => {
    console.log("eventNames - ", data);
    io.emit("eventName", data);
  });
  socket.on("send-data", (selected) => {
    console.log(selected);
    socket.broadcast.emit("broadcast-selected-data", selected);
  });
  socket.on("send_notification", (data) => {
    //io.emit("send_notification", data);

    console.log(data);

    if (!expo.isExpoPushToken(expoPushToken)) {
      console.error(
        `Push token ${expoPushToken} is not a valid Expo push token`
      );
      return;
    }

    const message = {
      to: expoPushToken,
      sound: "default",
      title: data.title,
      body: data.body,
    };

    expo
      .sendPushNotificationsAsync([message])
      .then((ticket) => {
        console.log(ticket);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});
router.post("/addevent", async (req, res) => {
  console.log("sent by client - ", req.body);
  // return
  const {
    eventId,
    name,
    date,
    isPrivate,
    fname,
    pic,
    email,
    deviceToken,
    desc,
  } = req.body;
  const dateString = new Date(date);
  const formattedDate = moment(dateString).format("dddd, MMMM DD, YYYY");
  console.log(formattedDate);
  const event = new Event({
    pic: pic,
    eventId: eventId,
    desc: desc,
    name: name,
    date: formattedDate,
    isPrivate: isPrivate,
    fname: fname,
    email: email,
    deviceToken: deviceToken,
  });

  try {
    await event.save();
    const token = jwt.sign({ _id: event._id }, process.env.JWT_SECRET);
    // const id = _id;
    // // const { _id, userName, email } = savedUser;

    // res.send({
    //   message: "Event Added Successfully",
    //   token,
    //   event: { eventId, name, date, isPrivate },

    // });
    // socket.on("eventName", function () {
    //   io.sockets.emit("eventName", event);
    // });
    io.sockets.emit("eventName", event);
    return res.status(200).send({
      message: "Event Added Successfully",
      token,
      event: { eventId, name, date, isPrivate, fname, pic, email, deviceToken },
    });
  } catch (err) {
    console.log(err);
  }
});
router.post("/setuserevents", async (req, res) => {
  const { id, name, date, isPrivate, fname, desc } = req.body;
  const dateString = new Date(date);
  const formattedDate = moment(dateString).format("dddd, MMMM DD, YYYY");
  console.log(formattedDate);
  console.log("Event ID RECEIVED - ", id);
  User.findById({ _id: id })
    .then((user) => {
      // user.allevents.map((item) => {
      //   if (item.id == id) {
      //     user.allevents.pull(item);
      //   }
      // });
      user.allevents.push({ id, name, formattedDate, isPrivate, fname, desc });
      user.save();
      res.status(200).send({ message: "Event saved successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(422).send(err.message);
    });
});

router.post("/events", (req, res) => {
  // const { isPrivate } = req.body;
  console.log("isPrivate - ", 0);
  Event.find({ isPrivate: false }, (err, events) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(events);
  });
});
router.post("/eventuserdata", (req, res) => {
  const { id } = req.body;

  User.findOne({ _id: id }).then((saveduser) => {
    if (!saveduser) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }
    //    console.log(saveduser);

    let data = {
      _id: saveduser._id,
      userName: saveduser.userName,
      name: saveduser.name,
      email: saveduser.email,
      profile_pic_name: saveduser.profile_pic_name,
      bio: saveduser.bio,
      links: saveduser.links,
      followers: saveduser.followers,
      following: saveduser.following,
      allmessages: saveduser.allmessages,
      deviceToken: saveduser.deviceToken,
      allevents: saveduser.allevents,
      accevents: saveduser.accevents,
      acceventsfrom: saveduser.acceventsfrom,
    };

    // console.log(data);

    res.status(200).send({
      user: data,
      message: "User Found",
    });
  });
});
router.post("/send-data", (req, res) => {
  console.log(req.body);

  const { selected, mess } = req.body;
  selected.forEach((item) => {
    console.log(item.user.deviceToken);
    console.log(mess);
    const messages = [
      {
        to: item.user.deviceToken,
        sound: "default",
        title: "New Event Shared By",
        body: mess,
        data: {
          title: "New Event Shared By",
          message: mess,
        },
      },
    ];

    // Send the push notifications
    expo
      .sendPushNotificationsAsync(messages)
      .then((ticketIds) => {
        console.log(`Notifications sent: ${ticketIds}`);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send({ error: "Failed to send push notification" });
      });
  });

  // Send a success response after the loop has completed processing all items
  res.json({ message: "Data sent successfully" });
});

router.post("/accetpEvent", (req, res) => {
  const { acceptfrom, acceptto } = req.body;
  console.log(acceptfrom, acceptto);
  if (!acceptfrom || !acceptto) {
    return res.status(422).json({ error: "Invalid Credentials" });
  }
  User.findOne({ email: acceptfrom })
    .then((mainuser) => {
      if (!mainuser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      } else {
        if (mainuser.accevents.includes(acceptto)) {
          console.log("already following");
        } else {
          mainuser.accevents.push(acceptto);
          mainuser.save();
        }
        // console.log(mainuser);

        User.findOne({ email: acceptto })
          .then((otheruser) => {
            if (!otheruser) {
              return res.status(422).json({ error: "Invalid Credentials" });
            } else {
              if (otheruser.acceventsfrom.includes(acceptfrom)) {
                console.log("Event already followed");
              } else {
                otheruser.acceventsfrom.push(acceptfrom);
                otheruser.save();
              }
              res.status(200).send({
                message: "Event Accepted",
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
router.post("/checkevent", (req, res) => {
  const { acceptfrom, acceptto } = req.body;
  console.log(acceptfrom, acceptto);
  if (!acceptfrom || !acceptto) {
    return res.status(422).json({ error: "Invalid Credentials" });
  }
  User.findOne({ email: acceptfrom })
    .then((mainuser) => {
      if (!mainuser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      } else {
        let data = mainuser.accevents.includes(acceptto);
        console.log(data);
        if (data == true) {
          res.status(200).send({
            message: "Event in following list",
          });
        } else {
          res.status(200).send({
            message: "Event not in following list",
          });
        }
      }
    })
    .catch((err) => {
      return res.status(422).json({ error: "Server Error" });
    });
});

// unfollow user
router.post("/unfollowevent", (req, res) => {
  const { acceptfrom, acceptto } = req.body;
  console.log(acceptfrom, acceptto);
  if (!acceptfrom || !acceptto) {
    return res.status(422).json({ error: "Invalid Credentials" });
  }
  User.findOne({ email: acceptfrom })
    .then((mainuser) => {
      if (!mainuser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      } else {
        if (mainuser.accevents.includes(acceptto)) {
          let index = mainuser.accevents.indexOf(acceptto);
          mainuser.accevents.splice(index, 1);
          mainuser.save();

          User.findOne({ email: acceptto })
            .then((otheruser) => {
              if (!otheruser) {
                return res.status(422).json({ error: "Invalid Credentials" });
              } else {
                if (otheruser.acceventsfrom.includes(acceptfrom)) {
                  let index = otheruser.acceventsfrom.indexOf(acceptfrom);
                  otheruser.acceventsfrom.splice(index, 1);
                  otheruser.save();
                }
                res.status(200).send({
                  message: "Event unaccepted",
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

httpServer.listen(3002);

module.exports = router;
