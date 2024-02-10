import express from "express";
import * as middleware from "../utils/middleware.js";
import mongoose from "mongoose";
import { Post } from "../models/post.js";

const router = express.Router();

/*
    error 1 = "your post needs to be less then 255 characters"
    error 2 = "you can't just post nothing!"
*/
router.post("/actions/post", ...middleware.user, async (req, res, next) => {
  try {
    let { content } = req.body;
    content = content.trim();

    try {
      const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        author: req.currentUser._id,
        content,
        postType: "normal",
        reactions: [
          {
            author: req.currentUser._id,
            reactionType: "like",
          },
        ],
      });

      await post.save();
      return res.redirect("/home");
    } catch (error) {
        return res.redirect(`/home?postError=${Object.values(error.errors)[0].properties.message}`);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/actions/posts/like", ...middleware.userNoCSRF, async (req, res, next) => {
  try {
    const postId = req.query.postId;

    if (postId == undefined) {
      return res.json({
        ok: false,
        error: "The request was malformed, try again"
      })
    }

    const post = await Post.findOne({ _id: new mongoose.Types.ObjectId(postId) });

    if (!post) {
      return res.json({
        ok: false,
        error: "The request was malformed, try again."
      });
    }

    // check if user has already liked the post, if yes remove them
    if (post.reactions.some(reaction => reaction.author._id.toString() == req.currentUser._id)) {
      const postIndex = post.reactions.findIndex((reaction => reaction.author._id.toString() == req.currentUser._id));

      post.reactions.splice(postIndex, 1);
      await post.save();
    } else {
      post.reactions.push({
        author: req.currentUser._id,
        reactionType: "like"
      });

      await post.save();
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
