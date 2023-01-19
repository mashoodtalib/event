const express = require("express");
require("dotenv").config();

const router = express.Router();
const mongoose = require("mongoose");
const Event = mongoose.model("event");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();

const io = new Server(httpServer, {
  /* options */
});
io.on("connection", (socket) => {
  console.log("User connected");
  // do something when user connects
});
router.post("/addevent", async (req, res) => {
  console.log("sent by client - ", req.body);
  return
  const { eventId, name, date, isPrivate } = req.body;

  const event = new Event({
    eventId,
    name,
    date,
    isPrivate,
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
    // socket.on("newEvent", function () {
    //   io.sockets.emit("newEvent", event);
    // });
    //io.sockets.emit("newEvent", event);
    return res.status(200).send({
      message: "Event Added Successfully",
      token,
      event: { eventId, name, date, isPrivate },
    });
  } catch (err) {
    console.log(err);
  }
});
router.post("/setuserevents", async (req, res) => {
  const { id, name, date, isPrivate } = req.body;
  console.log("Event ID RECEIVED - ", id);
  User.findOne({ _id: id })
    .then((user) => {
      user.allevents.map((item) => {
        if (item.id == id) {
          user.allevents.pull(item);
        }
      });
      user.allevents.push({ id, name, date, isPrivate });
      user.save();
      res.status(200).send({ message: "Event saved successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(422).send(err.message);
    });
});

router.post("/events", (req, res) => {
  const { isPrivate } = req.body;
  console.log("isPrivate - ", isPrivate);
  Event.find({ isPrivate : isPrivate }, (err, events) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(events);
  });
});

httpServer.listen(3002);

module.exports = router;
