import "./App.css";
import ReactDOM from "react-dom/client";
import React, { createContext, useEffect, useReducer } from "react";
import { reducer, initialState } from "./reducers/userReducer";
import NavBar from "./components/Navbar";

import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "./components/screens/Home";
import Profile from "./components/screens/profile";
import Signup from "./components/screens/Signup";
import Login from "./components/screens/login";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import SubscribedUserPosts from "./components/screens/SubscribedUserPosts";

export const UserContext = createContext();

// const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(`user = ${user}`);
    if (user) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, []);
  return (
    <Routes>
      <Route exact path="/" element={<Home />}></Route>;
      <Route path="/signup" element={<Signup />}></Route>;
      <Route path="/login" element={<Login />}></Route>;
      <Route exact path="/profile" element={<Profile />}></Route>;
      <Route path="/createpost" element={<CreatePost />}></Route>
      <Route path="/profile/:userid" element={<UserProfile />}></Route>

      <Route path="/myFollowingsPost" element={<SubscribedUserPosts />}></Route>

      <Route path="/myfollowingsposts" element={<SubscribedUserPosts />}></Route>

    </Routes>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <Router>
          <NavBar />
          <Routing />
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;
