import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  // const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const savePost = (url) => {
    fetch("/createpost", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        title: title,
        body: body,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#66bb6a red lighten-1" });
        } else {
          M.toast({
            html: "posted-  suucessfully",
            classes: "#66bb6a green lighten-1",
          });
          navigate("/");
        }
      });
  };

  const postDetails = () => {
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
        // setUrl(data.url);
        savePost(data.url)
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className="card input-field"
      style={{
        margin: "100px auto",
        maxWidth: "700px",
        padding: "20px",
        textAlign: "center",
        height: "300px",
        paddingTop: "50px",
        border: "solid 2px",
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
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
        onClick={() => postDetails()}
      >
        Submit
      </button>
    </div>
  );
};
export default CreatePost;
