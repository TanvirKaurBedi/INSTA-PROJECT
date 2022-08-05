import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";
const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const postData = () => {
    fetch("/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        debugger;
        console.log(`data=${data}`);
        if (data.error) {
          M.toast({ html: data.error, classes: "#f44336 red" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          // dispatch({ type: "getUserDetails", payload: data.user });
          M.toast({
            html: "signed-in-suucessfully",
            classes: "#66bb6a green lighten-1",
          });
          navigate("/");
        }
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-2"
          onClick={() => {
            postData();
          }}
        >
          Submit
        </button>
        <br />
        <br />
        <Link to="/Signup" className="switch">
          Don't have an account?
        </Link>
      </div>
    </div>
  );
};
export default Login;
