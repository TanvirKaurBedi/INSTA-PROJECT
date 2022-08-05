import { React, useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

const getUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user;
  //   console.log(`userrr=>${user.name}`);
};

const UserProfile = () => {
  const user = getUser();
  const [userProfile, setProfile] = useState(null);
  const [showFollow, setShowFollow] = useState(true);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  console.log(userid);
  useEffect(() => {
    // debugger;
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        console.log("Profile data", result);
        setProfile(result);
      });
  }, []);
  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({
          type: "UPDATE",
          payload: {
            followings: result.followings,
            followers: result.followers,
          },
        });
        debugger;
        console.log("follow data", result);
        localStorage.setItem("user", JSON.stringify(result));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, user._id],
            },
          };
        });
      });
    setShowFollow(false);
  };
  const UnFollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        localStorage.setItem("user", JSON.stringify(result));

        // console.log("unfollow-data", result),
        setProfile((prevState) => {
          const newFollowers = prevState.user.followers.filter((item) => {
            return item != user._id;
          });
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollowers,
            },
          };
        });
        setShowFollow(true);
      });
  };

  useEffect(() => {
    const isFollowing = user?.followings?.find((x) => x == userid)
      ? true
      : false;

    setShowFollow(!isFollowing);
  }, []);

  return (
    <>
      {userProfile ? (
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
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={user.pic}
              ></img>
            </div>
            <div>
              <h1>{userProfile.user.name}</h1>
              <h5>{userProfile.user.email}</h5>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h6>{userProfile.posts.length} posts &nbsp;</h6>
                <h6>{userProfile.user.followers.length} followers &nbsp;</h6>
                <h6>{userProfile.user.followings.length} followings</h6>
              </div>
              {showFollow ? (
                <button
                  className="waves-effect waves-dark btn-small follow-btn"
                  onClick={() => {
                    followUser();
                  }}
                >
                  + Follow
                </button>
              ) : (
                <button
                  className="waves-effect waves-dark btn-small follow-btn"
                  onClick={() => {
                    UnFollowUser();
                  }}
                >
                  - UnFollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
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
      ) : (
        <h2>Loading.....!!!</h2>
      )}
    </>
  );
};
export default UserProfile;
