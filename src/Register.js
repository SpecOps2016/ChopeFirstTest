import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "./firebase";
import "./Register.css";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useNavigate();
  const register = () => {
    if (!name) alert("Please enter name");
    if (!email.toLowerCase().includes("@u.nus.edu")) alert("Please only register with your NUS email");
    if (email.includes("@u.nus.edu")){
    registerWithEmailAndPassword(name, email, password);
    }
  };
  useEffect(() => {
    if (loading) return;
    if (user) history("/home", { replace: true });
  }, [user, loading]);
  return (
    <div class="container">
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card border-0 shadow rounded-3 my-5">
          <div class="card-body p-4 p-sm-5">
            <h5 class="card-title text-center mb-5 fw-light fs-5">Register</h5>
              <div class="form-floating mb-3">
              <input
                type="text"
                value={name}
                class="form-control"
                id ="floatingName"
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
              />
              <label for="floatingName">Full Name</label>
              </div>
              <div class="form-floating mb-3">
              <input
                type="text"
                value={email}
                class="form-control"
                id ="floatingEmail"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail Address"
              />
              <label for="floatingEmail">E-mail Address</label>
              </div>
              <div class="form-floating mb-3">
              <input
                type="password"
                value={password}
                class="form-control"
                id ="floatingPassword"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <label for="floatingPassword">Password</label>
              </div>
              <div class="d-grid mb-2">
                <button class="btn btn-primary btn-register text-uppercase fw-bold"  onClick={register}>Register</button>
              </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
export default Register;