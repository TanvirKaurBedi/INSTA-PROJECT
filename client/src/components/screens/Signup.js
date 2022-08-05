import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";

const SignUp = () => {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    if (url) {
      uploadDetails();
    }
  }, [url])

  const uploadPic = () => {
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
        setUrl(data.url);
        // savePost(data.url)
      })
      .catch((err) => console.log(err));
  }

  const uploadDetails = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalid email", classes: "#f44336 red" });
      return;
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        password: password,
        email: email,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#f44336 red" });
        }
        M.toast({ html: data.message, classes: "#66bb6a green lighten-1" });
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const postData = () => {
    if (image) {
      uploadPic();
    }
    else {
      uploadDetails();
    }
  };

  return (
    <>
      <div className="mycard">
        <div className="card auth-card">
          <h2>Instagram</h2>
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="file-field input-field">
            <div className="btn">
              <span>UPLOAD IMAGE</span>
              <input
                type="file"
                multiple
                onChange={(e) => setImage(e.target.files[0])}
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
          <Link to="/login" className="switch">
            Already have an account?
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignUp;
