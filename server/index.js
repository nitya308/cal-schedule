const express = require("express");
const { run } = require("./lib");
require('dotenv').config()

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
const https = require('https');

// let calendarIds = ["nitya.agarwala@gmail.com", "nitya.agarwala.25@dartmouth.edu"];
// let emailAddresses = ["nitya.agarwala@gmail.com", "nitya.agarwala.25@dartmouth.edu"];

app.post("/schedule", (req, res) => {
  let calendarIds = req.body.calendarIds;
  let emailAddresses = req.body.emailAddresses;
  let eventName = req.body.eventName;
  let eventDuration = req.body.eventDuration;
  // console.log(calendarIds, emailAddresses, eventName);
  run(eventName, eventDuration, calendarIds, emailAddresses)
    .then((result) => { console.log("RESULT:", result); res.status(200).json(result) })
    .catch((err) => { console.log("ERROR", err); res.status(500).json(err) });
});

// get route 
app.get("/lookup", (req, res) => {
  search = req.query.search;
  let theUrl = 'https://api-lookup.dartmouth.edu/v1/lookup?q=' + search;
  // console.log(theUrl);
  https.get(theUrl, (resp) => {
    let data = '';
    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      let usersArray = JSON.parse(data).users;
      // console.log(usersArray);
      const nameOptions = usersArray.map((user) => {
        return { value: user.mail, label: user.displayName };
      });
      // console.log("Name options:", nameOptions);
      res.status(200).json(nameOptions);
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
    res.status(500).json(err);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});
