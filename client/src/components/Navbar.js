import React from "react";
import { Link, useNavigate } from "react-router-dom";

const getUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user;
};
const NavBar = () => {
  const navigate = useNavigate();
  const user = getUser();
  const Renderlist = () => {
    console.log(`user ARE = ${user}`);
    if (user) {
      return (
        <>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/createpost">Create Post</Link>
          </li>
          <li>
            <Link to="/myFollowingsPost">My Followings Posts</Link>
          </li>
          <button
            className="btn waves-effect waves-light #e53935 red darken-1 btn-small "
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">SignUp</Link>
          </li>
        </>
      );
    }
  };
  return (
    <nav>
      <div className="nav-wrapper">
        <Link to={user ? "/" : "/login"} className="brand-logo-new">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {Renderlist()}
        </ul>
      </div>
    </nav>
  );
};
export default NavBar;
