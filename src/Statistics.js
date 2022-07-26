import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { fetchSignInMethodsForEmail, getAuth, onAuthStateChanged } from "firebase/auth";
import { getBookings, getName } from "./api/bookings";
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav, NavDropdown } from "react-bootstrap";
import "./Statistics.css";

function Statistics() {
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
  const [timeslots, setTimeslots] = useState([])
  const [disabled, setDisabled] = useState([])
  const [userid, setID] = useState("");
  const [coll, setColl] = useState([])
 // const [user, setUser] = useState(|)
  const navigate = useNavigate();

  useEffect(() =>onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      console.log(user)
      const uid = user.uid;
      const email = user.email;
      const name = getName(uid);
      getBookings().then(doc => {
        getName(uid).then(one =>{  
          console.log(one);
          var colle = [];      
          for (const item in doc) {
            if (doc[item]["userId"] === uid) {
              doc[item]["email"] = email;
              doc[item]["name"] = one;
              colle.push(doc[item]); 
          }
        }
        setColl(colle)
      }
        )
      })
      // ...
    } else {
      // User is signed out
      // ...
      return navigate("/");
    }
  })
  );

  

  const [postData, setPostData] = useState("");
  function GenerateData() {
        const determinant = {"krmpsh": 0, "outreach":0, "usc": 0, "utown": 0}
        coll.map(item => {
          if (item.timeslot.start.startDate.includes(new Date().toLocaleString('en-us', { month: 'long' }))) {
            determinant[item.venue] = determinant[item.venue] +1 
          }
        }
        )
        console.log(determinant)
      return (
        <div class="border-bottom mt-2"> 
          <p class="text-justify">
            Visitied Kent Ridge Fitness Gym in {new Date().toLocaleString('en-us', { month: 'long' })}: {determinant['krmpsh']} times
          </p>
          <p class="text-justify">
            Visitied Wellness Outreach Gym in {new Date().toLocaleString('en-us', { month: 'long' })}: {determinant['outreach']} times
          </p>
          <p class="text-justify">
            Visitied USC Gym in {new Date().toLocaleString('en-us', { month: 'long' })}: {determinant['usc']} times
          </p>
          <p class="text-justify">
            Visitied UTown Gym in {new Date().toLocaleString('en-us', { month: 'long' })} : {determinant['utown']} times
          </p>
        </div> 
      )
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
              <h2 class="card-title text-center align-baseline mb-5 fw-light fs-5">Statistics</h2>
            </div>
            <div class="card-body no-padding">
              <div class="item">
                  <div class="row">
                  <div>
                    <GenerateData />
                  </div>
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
export default Statistics;