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
  // console.log("localstorage user", user);
  const [mypics, setPics] = useState([]);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");


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

  // console.log("mypics", mypics);

  useEffect(() => {
    // debugger;
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "rinu");
      fetch("https://api.cloudinary.com/v1_1/rinu/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // savePost(data.url)
          console.log("updateProfilePicooooo", data);

          fetch('/updateprofilepic', {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
              pic: data.url
            })
          }).then((res) => res.json())
            .then((result) => {
              // console.log("updateProfilePic", result)
              localStorage.setItem("user", JSON.stringify({ ...user, pic: result.pic }));
              setUrl(result.pic);
            });
        })
        .catch((err) => console.log(err));
    }
  }, [image])

  const updateProfilePic = (file) => {
    setImage(file);
  }


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
              style={{ width: "190px", height: "190px", borderRadius: "90px" }}
              src={user.pic}
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
            <div className="file-field input-field Update-Pic-Btn">
              <div className="btn ">
                <span>Update Profile Pic</span>
                <input
                  type="file"
                  multiple
                  onChange={(e) => updateProfilePic(e.target.files[0])}
                />
              </div>
              <div className="file-path-wrapper">
                <input
                  className="file-path validate"
                  type="text"
                  placeholder="Upload one or more files"
                />
              </div>
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
