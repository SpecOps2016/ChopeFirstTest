import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { fetchSignInMethodsForEmail, getAuth, onAuthStateChanged } from "firebase/auth";
import { getBookings, getName } from "./api/bookings";
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav, NavDropdown } from "react-bootstrap";
import { updateHandle } from './api/bookings'
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import "./Telegram.css";

function Telegram() {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");

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
  const [userid, setID] = useState("");
  const [handle, setHandle] = useState([])
 // const [user, setUser] = useState(|)
  const navigate = useNavigate();

  useEffect(() =>onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      setID(user.uid)
      // ...
    } else {
      // User is signed out
      // ...
      return navigate("/");
    }
  })
  );

  

  const [postData, setPostData] = useState("");

  function handleSubmit() {
      updateHandle(userid, handle)
      console.log(userid)
      console.log(handle)
      alert("Confirmed!")
  }

  
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
    <div class="container">
    <div class="row">   
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card border-0 shadow rounded-3 my-5">
          <div class="card-body p-4 p-sm-5">
            <div class="card-header">
              <h2 class="card-title text-center align-baseline mb-5 fw-light fs-5">Receive Updates</h2>
            </div>
            <div class="card-body no-padding">
              <div class="item">
                  <div class="row">
                  <div class="d-flex justify-content-center">
                    Click Here To Receive Updates on Telegram!
                  </div>
                  <a href="https://t.me/chopefirst" class="d-flex justify-content-center">Telegram Channel</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
        </div>
    
)};
export default Telegram;