const express = require("express");
require("dotenv").config();
const moment = require("moment");

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
io.on("connection", (socket) => {
  console.log("USER CONNECTED - ", socket.id);

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED - ", socket.id);
  });

  socket.on("eventName", (data) => {
    console.log("eventName - ", data);
    io.emit("eventName", data);
  });
  socket.on("send-data", (selected) => {
    console.log(selected);
    socket.broadcast.emit("broadcast-selected-data", selected);
  });
});
router.post("/addevent", async (req, res) => {
  console.log("sent by client - ", req.body);
  // return
  const { eventId, name, date, isPrivate, fname } = req.body;
  const dateString = new Date(date);
  const formattedDate = moment(dateString).format("dddd, MMMM DD, YYYY");
  console.log(formattedDate);
  const event = new Event({
    eventId: eventId,
    name: name,
    date: formattedDate,
    isPrivate: isPrivate,
    fname: fname,
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
      event: { eventId, name, date, isPrivate, fname },
    });
  } catch (err) {
    console.log(err);
  }
});
router.post("/setuserevents", async (req, res) => {
  const { id, name, date, isPrivate, fname } = req.body;
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
      user.allevents.push({ id, name, formattedDate, isPrivate, fname });
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
      allevents: saveduser.allevents,
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

  const { selected } = req.body;
  selected.forEach((item) => {
    console.log(item);
    //  io.sockets.emit("send-data", item);

    // process the data here
  });

  // Send a success response
  res.json({ message: "Data sent successfully" });
});
httpServer.listen(3002);

module.exports = router;
