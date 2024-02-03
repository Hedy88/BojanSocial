import express from "express";
import * as middleware from "../utils/middleware.js";

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

export default router;
