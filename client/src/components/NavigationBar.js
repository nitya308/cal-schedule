import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../images/logo.png'

export default function NavigationBar() {
  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand href="#home" style={styles.brand}>
          <img
            src={logo}
            className="d-inline-block"
            alt="logo"
            style={styles.img}
          />
          CalSchedule</Navbar.Brand>
        <Nav>
          {/* <Nav.Link href="#learn">Learn More</Nav.Link> */}
        </Nav>
        <Navbar.Text>helping Dartmouth students save time</Navbar.Text>
      </Container>
    </Navbar>)
};

const styles = {
  brand: {
    fontSize: 30,
  },
  img: {
    width: 70,
    padding: 10,
    paddingTop: 0
  },
  heading: {
    textAlign: 'center',
    padding: 20,
    fontSize: 30,
  },
  subtitle: {
    fontStyle: 'italic',
  }
};


