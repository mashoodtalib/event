const express = require("express");
const port = 3000;
const cors = require("cors");
const multer = require("multer");
const app = express();
const bodyParser = require("body-parser");
//
const fs = require("fs");
const path = require("path");

require("./db");
require("./models/User");
require("./models/Message");
require("./models/events");
require("./models/image");

const authRoutes = require("./routes/authRoutes");
const requireToken = require("./Middlewares/AuthTokenRequired");
const uploadMediaRoutes = require("./routes/uploadMediaRoutes");
const messageRoutes = require("./routes/messageRoutes");
const eventRoutes = require("./routes/eventRoutes");
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();

const io = new Server(httpServer, {
  /* options */
});

app.use(cors());
app.use(bodyParser.json());
app.use(authRoutes);
app.use(uploadMediaRoutes);
app.use(messageRoutes);
app.use(eventRoutes);

app.get("/", requireToken, (req, res) => {
  // console.log(req.user);
  res.send(req.user);
});
io.on("connection", (socket) => {
  // console.log("USER CONNECTED - ", socket.id);

  socket.on("disconnect", () => {
    //  console.log("USER DISCONNECTED - ", socket.id);
  });

  socket.on("join_room", (data) => {
    // console.log("USER WITH ID - ", socket.id, "JOIN ROOM - ", data.roomid);
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    //  console.log("MESSAGE RECEIVED - ", data);

    io.emit("receive_message", data);

    // else {
    //   const imageData = data.image.replace(/^data:image\/\w+;base64,/, "");
    //   const buf = new Buffer(imageData, "base64");
    //   const imageName = `${new Date().getTime()}.png`;
    //   require("fs").writeFile(`./images/${imageName}`, buf, () => {
    //     io.emit("receive_message", {
    //       type: "image",
    //       url: `/uploads/${imageName}`,
    //     });
    //   });
    // }
  });
  socket.on("send-image", (image) => {
    console.log(`Received image: ${image.name}`);
    io.emit("receive_image", image);
  });
});

httpServer.listen(3001);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
