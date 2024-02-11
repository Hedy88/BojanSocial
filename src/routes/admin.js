import express from "express";
import * as middleware from "../utils/middleware.js";
import { User, getUserByUsername } from "../models/user.js";
import { Post } from "../models/post.js"

const router = express.Router();

router.get("/admin", ...middleware.adminOnly, async (req, res, next) => {
    try {
      const stats = {
        registeredUsers: await User.countDocuments(),
        postsCreated: await Post.countDocuments(),
        administrators: await User.countDocuments({ isAdmin: true })
      };

      res.render("admin", {
        csrfToken: req.csrfToken(),
        stats
      });
    } catch (error) {
        next(error);
    }
});

router.post("/actions/admin/banUser", ...middleware.adminOnly, async (req, res, next) => {
  try {
    let { username } = req.body;

    username = username.trim();

    if (!username) {
      return res.redirect("/admin");
    } else if (username == req.currentUser.username) {
      return res.redirect("/admin?error=You can't ban yourself");
    }

    const user = await getUserByUsername(username);

    if (!user) {
      return res.redirect("/admin?error=User does not exist");
    } else {
      user.isBanned = !user.isBanned;
      await user.save();

      return res.redirect("/admin");
    }
  } catch (error) {
      next(error);
  }
});


export default router;
