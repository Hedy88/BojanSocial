import express from "express";
import * as middleware from "../utils/middleware.js";
import { getUserByUsername } from "../models/user.js";

const router = express.Router();

router.get("/settings", ...middleware.user, async (req, res, next) => {
  try {
    let errorMessage;

    if (typeof req.query.error != "undefined") {
        errorMessage = req.query.error;
    }

    res.render("settings", {
      csrfToken: req.csrfToken(),
      errorMessage
    })
  } catch (error) {
    next(error);
  }
});

router.post("/actions/settings/changeDisplayName", ...middleware.user, async (req, res, next) => {
  try {
    if (typeof req.body["displayName"] != "undefined") {
      const user = await getUserByUsername(req.currentUser.username);

      if (user) {
        try {
          if (req.body["displayName"].trim() != "") {
            user.displayName = req.body["displayName"].trim();
          } else user.displayName = user.username;

          await user.save();

          res.redirect("/settings");
        } catch (error) {
          res.redirect(`/settings?error=${Object.values(error.errors)[0].properties.message}`);
        }
      }
    } else {
      res.redirect("/settings");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/actions/settings/changeBio", ...middleware.user, async (req, res, next) => {
  try {
    if (typeof req.body["content"] != "undefined") {
      const user = await getUserByUsername(req.currentUser.username);

      if (req.body["content"].trim().length > 255) {
        res.redirect("/settings?error=Your bio must be less then 255 characters")
      }

      if (user) {
        try {
          user.profile.bio = req.body["content"].trim();
          await user.save();

          res.redirect("/settings");
        } catch (error) {
          res.redirect(`/settings?error=${Object.values(error.errors)[0].properties.message}`);
        }
      }
    } else {
      res.redirect("/settings");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/actions/settings/changeCSS", ...middleware.user, async (req, res, next) => {
  try {
    if (typeof req.body["content"] != "undefined") {
      const user = await getUserByUsername(req.currentUser.username);

      if (user) {
        try {
          user.profile.css = req.body["content"];
          await user.save();

          res.redirect("/settings");
        } catch (error) {
          res.redirect(`/settings?error=${Object.values(error.errors)[0].properties.message}`);
        }
      }
    } else {
      res.redirect("/settings");
    }
  } catch (error) {
    next(error);
  }
});

export default router;
