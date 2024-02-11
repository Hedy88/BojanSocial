import express from "express";
import * as middleware from "../utils/middleware.js";
import mongoose from "mongoose";
import { Post } from "../models/post.js";
import xml from "xml";
import sanitizeHtml from 'sanitize-html';

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

// rss feed
router.get("/posts/all.rss", ...middleware.any, async (req, res, next) => {
  try {
    const posts = Post.find()
    .sort({ createdOn: -1 })
    .populate("author")
    .limit(15);

    const feedObject = {
      rss: [
        {
          _attr: {
            version: "2.0",
            'xmlns:atom': "http://www.w3.org/2005/Atom",
          }
        },
        {
          channel: [
            {
              "atom:link": {
                _attr: {
                  href: `http://${req.get('host')}/posts/all.rss`,
                  rel: "self",
                  type: "application/rss+xml"
                }
              }
            },
            { title: "Bojan Social" },
            { link: `http://${req.get('host')}/` },
            {
              image: [
                { url: `http://${req.get('host')}/img/BojanSocialIcon.png` },
                { title: "Bojan Social" },
                { link: `http://${req.get('host')}/` },
              ],
            },
            { description: "all posts" },
            { language: "en-us" },

            ...(await posts).map((post) => {
              return {
                item: [
                  { title: `@${post.author.username} just posted!` },
                  { pubDate: post.createdOn.toUTCString() },
                  { link: `http://${req.get('host')}/post/${post._id.toString()}` },
                  { description: { _cdata: `${post.content}` } }
                ]
              }
            }),
          ]
        }
      ]
    };

    const xmlText = '<?xml version="1.0" encoding="UTF-8"?>' + xml(feedObject);

    res.status(200);
    res.set("Content-Type", "application/rss+xml");
    res.end(xmlText);
  } catch (error) {
    next(error);
  }
});

router.get("/posts/all.json", ...middleware.any, async (req, res, next) => {
  try {
    const posts = Post.find()
    .sort({ createdOn: -1 })
    .populate("author")
    .populate("reactions.author")
    .limit(15);

    const apiJson = {
      ok: true,
      posts: [
        ...(await posts).map((post) => {
          return {
            author: {
              username: `${post.author.username}`,
              displayName: `${sanitizeHtml(post.author.displayName, { allowedTags: [], allowedAttributes: {}, disallowedTagsMode: "escape" })}`,
            },
            content: `${sanitizeHtml(post.content, { allowedTags: [], allowedAttributes: {}, disallowedTagsMode: "escape" })}`,
            postedOn: `${Math.floor(post.createdOn / 1000)}`,
            reactions: [
              ...post.reactions.map((reaction) => {
                return {
                  author: {
                    username: `${reaction.author.username}`,
                    displayName: `${sanitizeHtml(reaction.author.displayName, { allowedTags: [], allowedAttributes: {}, disallowedTagsMode: "escape" })}`,
                  },
                  reactionType: reaction.reactionType
                }
              })
            ]
          }
        })
      ]
    };

    res.json(apiJson);
  } catch (error) {
    next(error);
  }
});

router.get("/posts/friends.json", ...middleware.any, async (req, res, next) => {
  try {
    const apiJson = {
      ok: false,
      error: "this is still a work in progress!"
    };

    res.json(apiJson);
  } catch (error) {
    next(error);
  }
});

router.get("/posts/popular.json", ...middleware.any, async (req, res, next) => {
  try {
    const apiJson = {
      ok: false,
      error: "this is still a work in progress!"
    };

    res.json(apiJson);
  } catch (error) {
    next(error);
  }
});

export default router;
