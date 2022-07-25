import "./UscSlots.css";
import ReactTimeslotCalendar  from "../react-timeslot-calendar";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { auth, logout, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  getTimeslots, updateTimeslots, updateCapacity, checkCapacity
} from '../api/timeslots'
import{
  createBookings
} from '../api/bookings'
import { useState, useEffect } from "react";
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav, NavDropdown } from "react-bootstrap";
import { query, collection, getDocs, where } from "firebase/firestore";




function UscSlots() {
 
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
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
  const [timeslots, setTimeslots] = useState([])
  const [disabled, setDisabled] = useState([])

  function compare(a,b) {
  
    if (parseInt(a[0]) <parseInt( b[0])) {
      return -1;
    }

    else if (parseInt(a[0]) >parseInt( b[0])) {
      return 1;
    }

    else {
      return 0;
    }

  }

  useEffect(() => {
    getTimeslots("usc").then((slots) => {
      var temp = []
      for (var slot in slots) {
        if (slots[slot]['capacity'] > 0) {
          //console.log(slots[slot]['capacity']);
          temp.push([slots[slot]['start'].toString(), slots[slot]['end'].toString()])
        }
      }


      temp.sort(compare)
      setTimeslots(temp)
    })
  }, [])

  useEffect(() => {
    checkCapacity("usc").then((detail) => {
      var temp = []
      for (const item in detail) {
        if (detail[item]["capacity"] === 0) {
            delete detail[item]['capacity']
           temp.push(detail[item]);
        }
      }
      setDisabled(temp)
    })
  }, [])

  



const [startDate, setStart] = useState(0);
const [endDate, setEnd] = useState(0);
const [startTime, setStarttime] = useState(0);
const [day, setDay] = useState(0);
const [double, setDouble] = useState(undefined);


  function handleSubmit() {
    if (double === undefined || double !== day["day"]) {
      updateCapacity("usc", day, {'startDate': day["day"], 'format': 'MMMM Do YYYY, h:mm:ss A'}, true)
      createBookings(user.uid, "usc" , {'start': startDate, 'end': endDate})
      updateTimeslots("usc", startTime, false);
      setDouble(day["day"])
      console.log(double)
      alert("Booking has been made")
    }

    else {
        alert("Please only book one slot only once")
    }
  }

  function takeNote(s ,e, d, f) {
    setStart({ startDate: s });
    setEnd({ endDate: e });
    setStarttime({startTime: d});
    setDay({day: f});
  }

  var test = 'June 30th 2022, 9:00:00 AM';
  const test2 = [{
    startDate: test,
    format: 'MMMM Do YYYY, h:mm:ss A',
}]
 
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
    <h1  class= "bg-light fw-normal fs-20 bold text-center">University Sports Center Gym</h1>
    <h2 class= "bg-light  fw-normal fs-20 bold text-center">Operating Hours: 7am - 9pm</h2>
      <ReactTimeslotCalendar
        initialDate={moment().format("YYYY-MM-DD")}
        let
        timeslots={timeslots} 
        onSelectTimeslot = {(allTimeslots, lastSelectedTimeslot) => {
          takeNote(lastSelectedTimeslot.startDate.format('MMMM Do YYYY, h:mm:ss A'), lastSelectedTimeslot.endDate.format('MMMM Do YYYY, h:mm:ss A'), lastSelectedTimeslot.startDate.hour(), lastSelectedTimeslot.startDate.format('MMMM Do YYYY, h:mm:ss A'));// MomentJS object.
        }}
        disabledTimeslots = {disabled}
      />
      </div>

      <div class="mt-md-4 text-center">
        <button class="btn btn-primary text-uppercase fw-bold" onClick={handleSubmit}>Submit
        </button>
      </div>
      </div>
    
  );
}

export default UscSlots;