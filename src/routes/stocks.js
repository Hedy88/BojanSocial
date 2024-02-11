import express from "express";
import * as middleware from "../utils/middleware.js";

const router = express.Router();

router.get("/stocks", ...middleware.user, async (req, res, next) => {
  try {
    res.render("stocks", {
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
      next(error);
  }
});

export default router;
