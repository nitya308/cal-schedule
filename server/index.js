const express = require("express");
const { run } = require("./lib");
require('dotenv').config()

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

// let calendarIds = ["nitya.agarwala@gmail.com", "nitya.agarwala.25@dartmouth.edu"];
// let emailAddresses = ["nitya.agarwala@gmail.com", "nitya.agarwala.25@dartmouth.edu"];

app.post("/schedule", (req, res) => {
  let calendarIds = req.body.calendarIds;
  let emailAddresses = req.body.emailAddresses;
  let eventName = req.body.eventName;
  console.log(calendarIds, emailAddresses, eventName);
  run(eventName, calendarIds, emailAddresses)
    .then((result) => { console.log("RESULT:", result); res.status(200).json(result) })
    .catch((err) => { console.log("ERROR", err); res.status(500).json(err) });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});
