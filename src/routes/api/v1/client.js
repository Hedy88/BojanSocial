import express from "express";
import mongoose from "mongoose";
import * as middleware from "../../../utils/middleware.js";
import { User, getNewUsers, getUserByUsername } from "../../../models/user.js";
import { getAUserFriends } from "../../../models/friend.js";
import { getAUserPosts, Post, fetchPost, createPost } from "../../../models/post.js";
import { isLessThen10SecondsAgo } from "../../../utils/time.js";

const router = express.Router();

router.get("/client/get_new_users", ...middleware.api, async (req, res, next) => {
    try {
      const users = await getNewUsers();

      if (users) {
        res.status(200);

        res.json({
          ok: true,
          users: [
            ...users.map((user) => {
              return { username: user.username };
            }),
          ]
        });
      } else {
        res.status(500);

        res.json({
          ok: false,
          error: "Something went wrong..."
        });
      }
    } catch (error) {
        next(error);
    }
});

router.get("/client/get_all_users", ...middleware.api, async (req, res, next) => {
  try {
    const users = await User.find({ isBanned: false })
      .sort({ createdOn: -1 });

    if (users) {
      res.status(200);

      res.json({
        ok: true,
        users: [
          ...users.map((user) => {
            return { username: user.username };
          }),
        ]
      });
    } else {
      res.status(500);

      res.json({
        ok: false,
        error: "Something went wrong..."
      });
    }
  } catch (error) {
      next(error);
  }
});


router.get("/client/@:username/get_user_info", ...middleware.api, async (req, res, next) => {
  try {
    const user = await getUserByUsername(req.params.username);

    if (user) {
      const friends = await getAUserFriends(user._id);
      const posts = await getAUserPosts(user._id);

      res.status(200);

      return res.json({
        ok: true,
        user: {
          _id: user._id,

          username: user.username,
          displayName: user.displayName,
          email: user.email,

          isAdmin: user.isAdmin,
          isBanned: user.isBanned,
          isOwner: user.isOwner,

          createdOn: user.createdOn,
          lastLogin: user.lastLogin,

          profile: user.profile,
          money: user.money,

          friends: [
            ...friends.map((friend) => {
              return { username: friend.user.username };
            }),
          ],

          posts: [
            ...posts.map((post) => {
              return {
                _id: post._id,
                content: post.content,
                reactions: [
                  ...post.reactions.map((reaction) => {
                    return {
                      author: reaction.author.username,
                      reactionType: reaction.reactionType
                    }
                  })
                ]
              }
            })
          ],
        }
      });
    } else {
      res.status(500);

      return res.json({
        ok: false,
        error: "User doesn't exist"
      });
    }
  } catch (error) {
      next(error);
  }
});

router.get("/client/get_all_posts", ...middleware.api, async (req, res, next) => {
  try {
    let page = 0;

    if (typeof req.query.page != "undefined") {
      page = parseInt(req.query.page);

      if (isNaN(page)) {
        res.status(500);

        return res.json({
          ok: false,
          error: "Malformed request."
        });
      }
    }

    const posts = await Post.find()
      .sort({ createdOn: -1 })
      .populate("reactions.author")
      .populate("author")
      .limit(8)
      .skip(8 * page);

    if (posts) {
      res.status(200);

      res.json({
        ok: true,
        pages: (Math.round((await Post.countDocuments()) / 8)),
        posts: [
          ...posts.map((post) => {
            return {
              _id: post._id,
              username: post.author.username,
              displayName: post.author.displayName,
              content: post.content,
              createdOn: (Math.floor(post.createdOn / 1000)),
              reactions: [
                ...post.reactions.map((reaction) => {
                  return {
                    author: reaction.author.username,
                    reactionType: reaction.reactionType
                  }
                })
              ],

            };
          }),
        ]
      });
    } else {
      res.status(500);

      return res.json({
        ok: false,
        error: "Something went wrong..."
      });
    }
  } catch (error) {
      next(error);
  }
});

router.get("/client/get_post/:id", ...middleware.api, async (req, res, next) => {
  try {
    try {
      new mongoose.Types.ObjectId(req.params.id);
    } catch {
      res.status(500);

      return res.json({
        ok: false,
        error: "Malformed Request"
      });
    }

    const post = await fetchPost(new mongoose.Types.ObjectId(req.params.id));

    if (post) {
      res.status(200);

      res.json({
        ok: true,
        post: {
          _id: post._id,
          username: post.author.username,
          displayName: post.author.displayName,
          content: post.content,
          createdOn: (Math.floor(post.createdOn / 1000)),
          reactions: [
            ...post.reactions.map((reaction) => {
              return {
                author: reaction.author.username,
                reactionType: reaction.reactionType
              }
            })
          ],
        },
      });
    } else {
      res.status(500);

      res.json({
        ok: false,
        error: "Post wasn't found."
      });
    }
  } catch (error) {
      next(error);
  }
});

router.post("/client/post", ...middleware.userNoCSRF, async (req, res, next) => {
  try {
    let { content } = req.body;

    if (typeof content == "undefined") {
      res.status(500);

      return res.json({
        ok: false,
        error: "Malformed request"
      });
    } else {
      content = content.trim();
    }

    try {
      if (req.currentUser.ratelimits.lastPostCreation != null) {
        const ratelimitCheck = isLessThen10SecondsAgo(req.currentUser.ratelimits.lastPostCreation);

        if (ratelimitCheck) {
          return res.json({
            ok: false,
            error: "Please wait 10 seconds before posting again.",
          });
        }
      }

      await createPost(req.currentUser._id, content);

      req.currentUser.ratelimits.lastPostCreation = new Date();
      await req.currentUser.save();

      return res.json({ ok: true });
    } catch (error) {
      return res.json({
        ok: false,
        error: Object.values(error.errors)[0].properties.message
      });
    }
  } catch (error) {
    next(error);
  }
});



export default router;
