require('dotenv').config();

const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const Event = require("./models/Event");

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDb connection error:", error);
  });

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.get("/api/events", async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event Not Found" });
    }

    res.json({ message: "Event Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.json({
      message: "Event Added Successfully!",
      event: newEvent
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding event", error: error.message });
  }
});

app.put("/api/events/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event Not Found" });
    }

    res.json({
      message: "Event Updated Successfully!",
      event: updatedEvent
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
});

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});