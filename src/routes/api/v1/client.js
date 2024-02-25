import express from "express";
import mongoose from "mongoose";
import * as middleware from "../../../utils/middleware.js";
import { User, getNewUsers, getUserByUsername } from "../../../models/user.js";
import { getAUserFriends } from "../../../models/friend.js";
import { getAUserPosts, getLatestPosts, fetchPost } from "../../../models/post.js";

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
    const posts = await getLatestPosts();

    if (posts) {
      res.status(200);

      res.json({
        ok: true,
        posts: [
          ...posts.map((post) => {
            return {
              _id: post._id,
              username: post.author.username,
              displayName: post.author.displayName,
              content: post.content,
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

      res.json({
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

export default router;
