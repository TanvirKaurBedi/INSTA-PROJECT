import React, { useState, useEffect } from "react";
import { userDetail } from "../../getUserToken";
import { Link } from "react-router-dom";

const SubscribedUserPosts = () => {
  const userdetail = userDetail();
  const user = JSON.parse(userdetail);
  console.log(`user5=${user}`);
  const [data, setData] = useState([]);
  const [commentText, setCommentText] = useState("");
  useEffect(() => {
    fetch("/getsubscribedpost", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        console.log(`result: ${result.posts}`);
        setData(result.posts);
      });
  }, []);
  console.log(data);
  const likepost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        console.log(result);
        const newpost = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newpost);
      });
  };
  const unlikepost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        const newpost = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newpost);
      });
  };
  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text: text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          }
          return item;
        });
        setData(newData);
        setCommentText("");
      });
  };
  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };
  const deleteComment = (postid, commentid) => {
    fetch(`/deletecomment/${postid}/${commentid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((updatedPost) => {
        const updatedPosts = data.map((post) => {
          if (post._id == postid) return updatedPost;
          return post;
        });
        setData(updatedPosts);
      });
  };

  return (
    <div className="home">
      {data.map((item) => {
        // debugger;
        // var x = item.likes.includes(user._id);
        return (
          <div className="card homeCard toCenterCardContent">
            <h5 className="postedByName">
              <Link
                to={
                  item.postedBy._id !== user._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                }
              >
                {item.postedBy.name}
              </Link>{" "}
              {item.postedBy._id === user._id && (
                <i
                  className="material-icons cursorChange"
                  style={{ float: "right" }}
                  onClick={() => {
                    deletePost(item._id);
                  }}
                >
                  delete
                </i>
              )}
            </h5>

            <img src={item.pic} alt={"photo not available"}></img>

            <div className="card-content">
              <i
                className="material-icons cursorChange"
                style={{ color: "red" }}
              >
                favorite
              </i>

              {item.likes.includes(user._id) ? (
                <>
                  <i
                    className="small material-icons cursorChange"
                    onClick={() => {
                      unlikepost(item._id);
                    }}
                  >
                    thumb_down
                  </i>
                </>
              ) : (
                <>
                  <br />
                  <i
                    className="small material-icons cursorChange"
                    onClick={() => {
                      likepost(item._id);
                    }}
                  >
                    thumb_up
                  </i>
                </>
              )}

              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((comment) => {
                return (
                  <h6>
                    <span style={{ fontWeight: "500" }}>
                      {comment.postedBy.name}
                    </span>
                    {` ${comment.text}`}{" "}
                    <i
                      className="material-icons cursorChange"
                      style={{ float: "right" }}
                      onClick={() => {
                        deleteComment(item._id, comment._id);
                      }}
                    >
                      delete
                    </i>
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(commentText, item._id);
                }}
              >
                <input
                  type="text"
                  placeholder="add a comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default SubscribedUserPosts;
