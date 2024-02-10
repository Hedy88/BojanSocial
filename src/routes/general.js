import express from "express";
import fs from "fs";
import * as middleware from "../utils/middleware.js";
import { User, getUserByUsername } from "../models/user.js";
import { Post } from "../models/post.js";

const router = express.Router();

router.get("/", ...middleware.out, async (req, res, next) => {
    try {
        const users = await User.find()
            .sort({ createdOn: -1 })
            .limit(6);

        res.render("index", {
            csrfToken: req.csrfToken(),
            users
        });
    } catch (error) {
        next(error);
    }
});

router.get("/home", ...middleware.user, async (req, res, next) => {
    try {
        let postErrorMessage;

        if (typeof req.query.postError != "undefined") {
            postErrorMessage = req.query.postError;
        }

        const posts = await Post.find()
            .sort({ createdOn: -1 })
            .populate("reactions")
            .populate("author")
            .populate("repost")
            .limit(15);

        res.render("home", {
            csrfToken: req.csrfToken(),
            postErrorMessage,
            posts
        });
    } catch (error) {
        next(error);
    }
});

router.get("/users", ...middleware.any, async (req, res, next) => {
  try {
    const users = await User.find()
      .sort({ createdOn: -1 });

    res.render("users", {
      csrfToken: req.csrfToken(),
      users
    });
  } catch (error) {
      next(error);
  }
});

router.get("/@:username/css", ...middleware.any, async (req, res, next) => {
    try {
        const user = await getUserByUsername(req.params.username);

        if (user) {
            res.set('Content-Type', 'text/css');
            res.end(user.profile.css);
        } else {
            return res.redirect("/");
        }
    } catch (error) {
        next(error);
    }
});

router.get("/@:username/pfp", ...middleware.any, async (req, res, next) => {
  try {
      const user = await getUserByUsername(req.params.username);

      if (user) {
        if (fs.existsSync(`${global.PROJECT_ROOT}/data/pfp/${user._id.toString()}.png`)) {
          res.sendFile(`${global.PROJECT_ROOT}/data/pfp/${user._id.toString()}.png`);
        } else {
          res.sendFile(`${global.PROJECT_ROOT}/data/pfp/default.png`)
        }
      } else {
        return res.redirect("/");
      }
  } catch (error) {
      next(error);
  }
});

router.get("/@:username/banner", ...middleware.any, async (req, res, next) => {
  try {
      const user = await getUserByUsername(req.params.username);

      if (user) {
        if (fs.existsSync(`${global.PROJECT_ROOT}/data/banners/${user._id.toString()}.png`)) {
          res.sendFile(`${global.PROJECT_ROOT}/data/banners/${user._id.toString()}.png`);
        } else {
          res.sendFile(`${global.PROJECT_ROOT}/data/banners/default.png`)
        }
      } else {
        return res.redirect("/");
      }
  } catch (error) {
      next(error);
  }
});

router.get("/@:username", ...middleware.any, async (req, res, next) => {
  try {
      const user = await getUserByUsername(req.params.username);

      if (user) {
        if (user.isBanned) {
          return res.redirect("/");
        }

        const posts = await Post.find({ author: user._id })
          .populate("author")
          .sort({ createdOn: -1 });

        res.render("profile", {
          csrfToken: req.csrfToken(),
          user,
          posts
        });
      } else {
        return res.redirect("/");
      }
  } catch (error) {
      next(error);
  }
});

router.get("/@:username/song", ...middleware.any, async (req, res, next) => {
  try {
      const user = await getUserByUsername(req.params.username);

      if (user && user.profile.song.enabled) {
        res.status(200);
        res.set("Content-Type", user.profile.song.mime);
        res.sendFile(`${global.PROJECT_ROOT}/data/songs/${user._id.toString()}.bin`);
      } else {
        return res.redirect("/");
      }
  } catch (error) {
      next(error);
  }
});

router.get("/about", ...middleware.any, async (req, res, next) => {
    try {
        res.render("about", {
            csrfToken: req.csrfToken(),
        });
    } catch (error) {
        next(error);
    }
});

export default router;
