const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const eventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    fname: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.model("event", eventSchema);
