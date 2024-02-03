import express from "express";
import * as middleware from "../utils/middleware.js";

const router = express.Router();

router.get("/settings", ...middleware.user, async (req, res, next) => {
  try {
    res.render("settings", {
      csrfToken: req.csrfToken(),
    })
  } catch (error) {
    next(error);
  }
});

export default router;
