import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "./firebase";
import "./Reset.css";
function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);
  return (
    <div class="container">
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card border-0 shadow rounded-3 my-5">
          <div class="card-body p-4 p-sm-5">
            <h5 class="card-title text-center mb-5 fw-light fs-5">Reset Password</h5>
              <div class="form-floating mb-3">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail Address"
                class="form-control"
                id ="floatingEmail"
              />
              <label for="floatingEmail">E-mail Address</label>
              </div>
              <div class="d-grid mb-2">
                <button class="btn btn-primary btn-forgot text-uppercase fw-bold"  onClick={() => sendPasswordReset(email)}>Send Password Reset Email</button>
              </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
export default Reset;