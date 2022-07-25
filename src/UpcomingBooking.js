import "./UpcomingBooking.css";
import moment from "moment";
import {
  getTimeslots, updateTimeslots, updateCapacity
} from './api/timeslots'
import{
  createBookings , getBookings, deleteBooking
} from './api/bookings'
import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Container, Nav, NavDropdown } from "react-bootstrap";
import { auth, logInWithEmailAndPassword, signInWithGoogle, db, logout } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import{
  updateAvail
} from './api/telegram';
import Navbar from 'react-bootstrap/Navbar';



function UpcomingBooking() {
  const [timeslots, setTimeslots] = useState([])
  const [keys, setKeys] = useState([])
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const[userid, setID] = useState("") 

  const fetchUserName = async () => {
    try {
      setID(user.uid);
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);

  const navigate = useNavigate();
  onAuthStateChanged(auth, (user) => {
    if (user) {
    console.log(userid);
    getBookings().then((slots) => {
      var temp = []
      for (var slot in slots) {
        if (slots[slot]['userId'] === user.uid) {
          temp.push(slots[slot]);
          console.log(Object.keys(slots));
          console.log(slots[slot]);
          // console.log(slots[slot]['venue']);
          // console.log(slots[slot]['timeslot']['start']);
          // console.log(slots[slot]['timeslot']['end']);
          // console.log(slots[slot]['timeslot']['date']);
          // temp.push([slots[slot]['start'].toString(), slots[slot]['end'].toString()])
        }
      }
      setTimeslots(temp)
      setKeys(Object.keys(slots))
    } )
  } else {
    return navigate("/");
  }
  }, [])

  console.log(timeslots);

  const renderCard = (card, index) => {
    function handleSubmit() {
      console.log(keys[index], keys)
      deleteBooking(keys[index]).then(value => {
        var temp = timeslots.slice();
        temp.splice(index, 1)
        updateTimeslots('krmpsh', 'slot1', true)
        setTimeslots(temp);
        updateAvail("Slot available at " + card.venue + " at " + card.timeslot.start.startDate);
        updateCapacity(card.venue, {"day": card.timeslot.start.startDate}, {'startDate': card.timeslot.start.startDate, 'format': 'MMMM Do YYYY, h:mm:ss A'}, false)
      })
    }

    console.log(card.timeslot.start.startDate.toString());

    return (
      <div class="padding-bottom mt-4"> 
      <Card style={{ width: "18rem" }} key={index} className="box mx-auto">
        <Card.Body>
          <Card.Title>Booking</Card.Title>
          <Card.Text>Location: {card.venue}</Card.Text>
          <Card.Text>Start: {card.timeslot.start.startDate.toString()}</Card.Text>
          <Card.Text>End: {card.timeslot.end.endDate.toString()} </Card.Text>
          <Button variant="primary" onClick={handleSubmit}>Delete</Button>
        </Card.Body>
      </Card>
      </div>
    );
  };

  return (
    <div>
     <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/home">ChopeFirst</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">Facilities</Nav.Link>
            <Nav.Link as={Link} to="/telegram">Receive Updates On Telegram</Nav.Link>
            <NavDropdown title="Account" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/upcomingBooking">Upcoming Bookings</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/activities">Activities</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/statistics">Statistics</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Contact us</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>Sign out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <div className="bg-light border-top mt-4">
    <h1  class= "bg-light fw-normal fs-20 bold text-center mt-2">Upcoming Bookings</h1>
    <h2 class= "bg-light  fw-normal fs-20 bold text-center mb-4">Below are your upcoming bookings</h2>
    </div>
    <div className="grid text-center">{timeslots.map(renderCard)}</div>;
  
  </div>
  );
};

export default UpcomingBooking;