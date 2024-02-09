import express from "express";
import multer from "multer";
import { promises as fs } from "fs";
import sharp from "sharp";

import * as middleware from "../utils/middleware.js";
import { getUserByUsername } from "../models/user.js";
import { logger } from "../utils/logger.js";

const upload = multer({ dest: "upload/" });
const router = express.Router();

router.get("/settings", ...middleware.user, async (req, res, next) => {
  try {
    let errorMessage;

    if (typeof req.query.error != "undefined") {
      errorMessage = req.query.error;
    }

    res.render("settings", {
      csrfToken: req.csrfToken(),
      errorMessage,
    });
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

          return res.redirect("/settings");
        } catch (error) {
          return res.redirect(`/settings?error=${Object.values(error.errors)[0].properties.message}`);
        }
      }
    } else {
      return res.redirect("/settings");
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
        return res.redirect("/settings?error=Your bio must be less then 255 characters");
      }

      if (user) {
        try {
          user.profile.bio = req.body["content"].trim();
          await user.save();

          return res.redirect("/settings");
        } catch (error) {
          return res.redirect(`/settings?error=${Object.values(error.errors)[0].properties.message}`);
        }
      }
    } else {
      return res.redirect("/settings");
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

          return res.redirect("/settings");
        } catch (error) {
          return res.redirect(`/settings?error=${Object.values(error.errors)[0].properties.message}`);
        }
      }
    } else {
      return res.redirect("/settings");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/actions/settings/changeProfilePicture", ...middleware.userNoCSRF, upload.single("profilePicture"), async (req, res, next) => {
  try {
    if (req.file) {
      const data = await fs.readFile(req.file.path);

      if (req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpeg") {
        await fs.unlink(req.file.path);
        return res.redirect("/settings?error=This image format is not supported by the server.");
      } else {
        sharp(data)
          .resize({ width: 512, height: 512 })
          .toFormat("png")
          .png({ quality: 90, compressionLevel: 9 })
          .toFile(`${global.PROJECT_ROOT}/data/pfp/${req.currentUser._id.toString()}.png`)
          .then(async () => {
            await fs.unlink(req.file.path);
            res.redirect("/settings");
          })
          .catch(async (err) => {
            logger.error(`Failed to process @${req.currentUser.username}'s profile picture. Error: ${err}`);
            await fs.unlink(req.file.path);
            return res.redirect("/settings?error=Failed to process your image");
          });
      }
    } else {
      return res.redirect("/settings");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/actions/settings/changeBanner", ...middleware.userNoCSRF, upload.single("bannerPicture"), async (req, res, next) => {
  try {
    if (req.file) {
      const data = await fs.readFile(req.file.path);

      if (req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpeg") {
        await fs.unlink(req.file.path);
        return res.redirect("/settings?error=This image format is not supported by the server.");
      } else {
        sharp(data)
          .resize({ width: 750, height: 200 })
          .toFormat("png")
          .png({ quality: 90, compressionLevel: 9 })
          .toFile(`${global.PROJECT_ROOT}/data/banners/${req.currentUser._id.toString()}.png`)
          .then(async () => {
            await fs.unlink(req.file.path);
            return res.redirect("/settings");
          })
          .catch(async (err) => {
            logger.error(`Failed to process @${req.currentUser.username}'s profile picture. Error: ${err}`);
            await fs.unlink(req.file.path);
            return res.redirect("/settings?error=Failed to process your image");
          });
      }
    } else {
      return res.redirect("/settings");
    }
  } catch (error) {
    next(error);
  }
});

export default router;
