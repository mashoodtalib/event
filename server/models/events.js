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
    date: {
      type: Date,
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
