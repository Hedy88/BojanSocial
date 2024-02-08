import express from "express";
import * as middleware from "../utils/middleware.js";
import { User } from "../models/user.js";
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


export default router;
