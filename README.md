# cal-schedule
**Author:** Nitya Agarwala  
**Created:** 2022
Automatically schedules meetings/events for Dartmouth students based on Google Calendar availability

## Basic Details:
**Languages:** JavaScript, NodeJS

## Main Features:
* **Dartmouth Directory Lookup** <br/>
Uses the Dartmouth Directory API to search for and fetch user names and email addresses based on search queries.
* **Fetching User Availability** <br/>
Uses the Google Calendar API to busy times for each user in list. Authenticates access to user's calendars and uses retrieved information to find earliest common avilable times within following week.
* **Creating GCal Event and Sending Invites to All Attendees** <br/>
Creates event with provided event title, duration and adds event to host's Google Calendar. Sends invites to all attendees entered by user and displays results with status of pending and confirmed attendees.


## Installation:

**Running this project locally** requires NodeJS and yarn/npm. To install the required packages, run the following command

```yarn install```

OR

```npm install```

## Structure:
Below is the basic structure of the frontend and backend. All calendar functionality is in lib.js in the backend.
```
 --client
    | -- src
    |   |-- components
    |   |   |-- Invites.js
    |   |-- App.js
    |   |-- index.js
    |
 -- server
    |-- index.js
    |-- lib.js
    |-- dateParse.js
-- package.json

 ```
 
 ## Dartmouth Directory Lookup: <br/>
 This is a wrapper for: https://lookup.dartmouth.edu/ <br/>
 All data is public and provided by Dartmouth. No data is stored by Cal-Schedule longer than needed to create and send invites to event.  <br/>
 I access data from the directory website using https requests and then extract user names and email addresses from the response as follows:
 ```
 app.get("/lookup", (req, res) => {
  search = req.query.search;
  let theUrl = 'https://api-lookup.dartmouth.edu/v1/lookup?q=' + search;
  
  https.get(theUrl, (resp) => {
    let data = '';
    
    // while data is being recieved
    resp.on('data', (chunk) => {
      data += chunk;
    });
    
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      // extracting array users for response
      let usersArray = JSON.parse(data).users;

      // creating an options array for the dropdown with a value and label for each user
      const nameOptions = usersArray.map((user) => {
        return { value: user.mail, label: user.displayName };
      });
      
      res.status(200).json(nameOptions);
    });
    
  }).on("error", (err) => {
    console.log("Error: " + err.message);
    res.status(500).json(err);
  });
});
 ```
 
## Finding Common Intervals:
Intervals are returned as an array of busy times with a ```startTime``` and ```endTime``` parameter. <br />
Available common intervals are found by merging and sorting busy time periods for all users. Then we check starting at 24 hours from the request for an available time block greater than user specified duration. <br />
For each current time, if the start of the next busy block is sufficently greater, we insert that interval into  ```freeTimes[] ```, else we se current to the end of the next busy block. <br />
To see the full code, open lib.js <br />

 ```
 function mergeFreeBusyTimes(intervals) {
 
  // Creating a current date to start looking at one day from current time
  let curr = new Date();
  curr.setDate(curr.getDate() + 1);
  let stringdate = curr.toISOString();
  let cur = stringdate.substring(0, 19) + "Z";

  // Sort busy intervals by start time
  intervals.sort((a, b) => {
    return parseISODate(a.start) - parseISODate(b.start);
  });

  const freeTimes = [];

  // Check for all avilable time blocks
  for (let i = 0; i < intervals.length; i++) {
    let s = intervals[i].start
    stemp = parseISODate(s);
    curtemp = parseISODate(cur);
    if (stemp > curtemp && (stemp - curtemp) > 1800000) {
      freeTimes.push([cur, s])
    }
    cur = intervals[i].end
  }

  // console.log("Free times:", freeTimes);
  return freeTimes;
 ```

## Future Features
* Working on identifying phrases and keywords in event names submitted by user. For example "Team Lunch" submitted as the event name would result in only searching for avialble times in the afternoon and on days when no users have anything with "lunch" scheduled in their calendars!
* Connecting a MongoDB database to store auth tokens for each user!

