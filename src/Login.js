import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/home");
  }, [user, loading]);
  return (
    <div class="container">
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card border-0 shadow rounded-3 my-5">
          <div class="card-body p-4 p-sm-5">
            <h5 class="card-title text-center mb-5 fw-light fs-5">ChopeFirst</h5>
              <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control" id="floatingInput" placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label for="floatingInput">Email Address</label>
              </div>
              <div class="form-floating mb-3">
              <input
                type="password"
                class="form-control" id="floatingPassword" placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label for="floatingPassword">Password</label>
              </div>
              <div class="d-grid mb-2">
                <button class="btn btn-primary btn-login text-uppercase fw-bold"  onClick={() => email.toLowerCase().includes("@u.nus.edu") ? logInWithEmailAndPassword(email, password) : alert("Please only sign in with your NUS email")}>Sign
                  in</button>
              </div>
              <hr class="my-4"></hr>
              <div class="d-grid mb-2">
                <Link to="/reset" class="btn btn-primary btn-login text-uppercase fw-bold">Forgot Password</Link>
              </div>
              <div class="d-grid">
               <Link to="/register" class="btn btn-primary btn-login text-uppercase fw-bold">Register Now</Link> .
              </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
export default Login;