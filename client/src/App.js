import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import Invites from './components/Invites';
import axios from 'axios';

function App() {

  const [name, setName] = useState("");
  const [disable, setDisable] = useState(false);
  const [eventData, setEventData] = useState([]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // map all attendees in eventData to a div with their name and email
  const returnAttendeeInfo = (attendee) => {
    return (
      <li><div>{attendee.email + ":  " + ((attendee.responseStatus === "needsAction") ? "Pending" : attendee.responseStatus)}</div></li>
    );
  };

  const renderEventData = () => {
    if (eventData.length === 0) {
      return <div></div>
    }
    let year = eventData.start.dateTime.substring(0, 4);
    let monthidx = eventData.start.dateTime.substring(5, 7);
    let month = months[parseInt(monthidx) - 1];
    let day = eventData.start.dateTime.substring(8, 10);

    let startTime = eventData.start.dateTime.substring(11, 16);
    let endTime = eventData.end.dateTime.substring(11, 16);

    return (
      <div style={{ lineHeight: 2.5, paddingTop: 10 }}>
        <div> {day + " " + month + ", " + year + " at " + startTime + " - " + endTime + " hours"}</div>
        <div> <span style={{fontWeight: 600}}>Title: </span>{eventData.summary} </div>
        <div style={{fontWeight: 600}}> {"Attendees:"} </div>
        <ul>
          {eventData.attendees.map((attendee) => returnAttendeeInfo(attendee))}
        </ul>
        <div> <span style={{fontWeight: 600}}>View Event: </span> <a href={eventData.htmlLink} target="_blank" rel="noreferrer">at this link</a></div>
      </div>
    );

  };

  const sendRequest = async (emails) => {
    setDisable(true);
    // send request to backend with name and emails
    console.log(name);
    console.log(emails);
    const createEventObject = {
      eventName: name,
      calendarIds: emails,
      emailAddresses: emails,
    };
    axios.post('/schedule', createEventObject)
      .then((res) => {
        console.log(res.data);
        setEventData(res.data);
      }).catch((error) => {
        console.log(error)
      });
  }

  return (
    <Container>
      <div style={styles.heading}>Cal-Schedule</div>
      <Row>
        <Col sm style={{ padding: 10 }}>
          <div style={styles.subtitle}>What are you trying to plan?</div>
          <div>Event Name: </div>
          <input type="text" value={name} onChange={handleNameChange} disabled={disable} />
          {/* Component to add people's names will go here! */}
          <div style={{ height: 50 }}></div>
          <div style={styles.subtitle}>Who do you want to invite?</div>
          <div>Attendees: </div>
          <Invites disabled={disable} createEvent={sendRequest}></Invites>
        </Col>

        {/* Right column displays event */}

        <Col sm style={{ padding: 10, marginLeft: '5%' }}>
          <div>Your Event has been scheduled for:</div>
          {renderEventData()}
        </Col>
      </Row>

      {/* create new event button */}
      <button style={{ float: 'right' }} onClick={() => { setEventData([]); setName(""); setDisable(false) }}>
        Create Another Event
      </button>
    </Container>
  );
}

const styles = {
  heading: {
    textAlign: 'center',
    padding: 20,
    fontSize: 30,
  },
  subtitle: {
    fontStyle: 'italic',
  }
};

export default App;
