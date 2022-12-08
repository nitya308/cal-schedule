const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const { parseISODate } = require('./dateparse');

// The file token.json stores the user's access and refresh tokens, and is created automatically when the authorization flow completes for the first time.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
};

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
};

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
};

// STEPS:
// Given: array of email addresses
// 1. Get all calendar ids for each user
// 2. Get free busy times for each user!
// 3. Merge them into one array
// 4. Calculate common free interval
// 5. Return 3 possible intervals to user
// 6. Create event at selected interval and send invites

// STEP 2
// Get free busy times for each user
async function getFreeBusyTimes(auth, eventName, eventDuration, calendarIds, emailAddresses) {
  const timeMin = new Date();
  timeMin.setDate(timeMin.getDate() + 1);
  const timeMax = new Date();
  timeMax.setDate(timeMax.getDate() + 2);

  const requestBody = {
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    items: calendarIds.map((id) => {
      return { id: id };
    }),
  };

  const calendar = google.calendar({ version: 'v3', auth });
  const res = await calendar.freebusy.query({
    resource: requestBody,
  });

  // console.log(res.data.calendars);
  var intervals = mergeDates(res.data.calendars);

  const secondsDuration = eventDuration * 60;
  var freeTimes = mergeFreeBusyTimes(intervals, secondsDuration);

  var startTime = freeTimes[0][0];

  let end = parseISODate(startTime);
  end.setSeconds(end.getSeconds() + secondsDuration);
  let stringdate = end.toISOString();
  let endTime = stringdate.substring(0, 19) + "Z";

  const event = await createEvent(auth, startTime, endTime, eventName, emailAddresses);
  // console.log("event returned here:", event);
  return event;
};

// STEP 3
// Merge dates into one array
function mergeDates(calendars) {
  const intervals = [];
  //loop over all objects in calendars
  for (const idx in calendars) {
    cal = calendars[idx]
    if (typeof cal.busy !== 'undefined') {
      console.log("Busy,", cal.busy);
      cal.busy.forEach(busy => {
        intervals.push({
          start: busy.start,
          end: busy.end
        })
      });
    }
  }
  console.log("All intervals together", intervals);
  return intervals;
}

// STEP 4
// Merge free busy times for all users
function mergeFreeBusyTimes(intervals, secondsDuration) {
  // Creating a current date to start looking at one day from current time
  let curr = new Date();
  curr.setDate(curr.getDate() + 1);
  let stringdate = curr.toISOString();
  let cur = stringdate.substring(0, 19) + "Z";
  // console.log(cur);

  // Sort by start time
  intervals.sort((a, b) => {
    return parseISODate(a.start) - parseISODate(b.start);
  });

  const freeTimes = [];

  for (let i = 0; i < intervals.length; i++) {
    let s = intervals[i].start
    stemp = parseISODate(s);
    curtemp = parseISODate(cur);
    // console.log(stemp, curtemp)
    if (stemp > curtemp && (stemp - curtemp) > secondsDuration) {
      freeTimes.push([cur, s])
    }
    cur = intervals[i].end
  }

  console.log("Free times:", freeTimes);
  return freeTimes;
};

// STEP 6
// Create event at selected interval (first interval for now) and send invites
async function createEvent(auth, start, end, eventName, emailAddresses) {
  const calendar = google.calendar({ version: 'v3', auth });

  // map calendarIds to email addresses
  const emails = emailAddresses.map((id) => {
    return { email: id };
  });

  var toCreateEvent = {
    'summary': eventName,
    'start': {
      'dateTime': start,
      'timeZone': 'America/Danmarkshavn',
    },
    'end': {
      'dateTime': end,
      'timeZone': 'America/Danmarkshavn',
    },
    'attendees': emails,
  };

  const result = await calendar.events.insert({
    auth: auth,
    calendarId: 'nitya.agarwala@gmail.com',
    resource: toCreateEvent,
  })
    .then((response) => { return response.data; })
    .catch((err) => { return err });

  return result;
};

// Function to run everything
async function run(eventName, eventDuration, calendarIds, emailAddresses) {
  return authorize()
    .then((auth) => {
      return getFreeBusyTimes(auth, eventName, eventDuration, calendarIds, emailAddresses)
        .then((res) => { return res; });
    });
};

module.exports = { run };
