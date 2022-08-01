import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
const getUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user;
  console.log(`userrr=>${user.name}`);
};
const Profile = () => {
  const userdetails = useContext(UserContext);
  console.log("userdetails", userdetails);
  const user = getUser();
  console.log("u", user);
  const [mypics, setPics] = useState([]);

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        console.log("myprofileposts", result);
        setPics(result.mypost);
      });
  }, []);
  return (
    <>
      <div style={{ maxWidth: "550px", margin: "0px auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "18px 0px",
            borderBottom: "solid 1px grey",
          }}
        >
          <div>
            <img
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              src="https://images.unsplash.com/photo-1655847001912-20a783d10888?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4NXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
            ></img>
          </div>
          <div>
            <h1>{user.name}</h1>
            <h5>{user.email}</h5>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h6>{mypics.length} posts &nbsp;</h6>
              <h6>{user.followers.length} followers &nbsp;</h6>
              <h6>{user.followings.length} followings</h6>
            </div>
          </div>
        </div>
        <div className="gallery">
          {mypics.map((item) => {
            return (
              <img
                className="profileImages"
                src={item.pic}
                alt={item.title}
              ></img>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Profile;
