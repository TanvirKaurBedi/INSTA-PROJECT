const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin");

router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json({ posts: posts });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getsubscribedpost", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.followings } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json({ posts: posts });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((mypost) => {
      res.json({ mypost: mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic } = req.body;
  // console.log(`postbody= ${pic}`);

  if (!title || !body || !pic) {
    return res.status(422).json("please fill all the fields");
  }
  req.user.password = undefined;
  const posts = new Post({
    title: title,
    body: body,
    pic: pic,
    postedBy: req.user,
  });
  posts
    .save()
    .then((result) => {
      res.json({ posts: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});
router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },

    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      return res.json(result);
    }
  });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        return res.json(result);
      }
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      } else if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});
router.delete("/deletecomment/:postid/:commentid", requireLogin, (req, res) => {
  const { postid, commentid } = req.params;
  Post.findOneAndUpdate(
    { _id: postid },
    {
      $pull: {
        comments: { _id: commentid },
      },
    },
    { new: true }
  ).then((result) => {
    return res.json(result);
  });
  // Post.findOne({ _id: postid })
  //   .populate("comments")
  //   .exec((err, post) => {
  //     if (err || !post) {
  //       return res.status(422).json({ error: err });
  //     }else{
  //       const comment = post.comments.find(x=> x._id == commentid)
  //       comment.remove();
  //       return res.json({success: true})
  //     }
  //     // const postComment = post.comments
  //     //   .findOne({ _id: commentid })
  //     //   .then((comment) => {
  //     //     comment
  //     //       .remove()
  //     //       .then((result) => {
  //     //         res.json(result);
  //     //       })
  //     //       .catch((err) => {
  //     //         console.log(err);
  //     //       });
  //     //   });
  //   });
});
module.exports = router;
