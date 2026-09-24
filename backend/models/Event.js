const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: String,
    category: String,
    date: String,
    time: String,
    location: String,
    description: String
}, {
    timestamps: true
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;