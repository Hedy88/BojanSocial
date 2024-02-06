import express from "express";
import * as middleware from "../utils/middleware.js";

const router = express.Router();

router.get("/admin", ...middleware.adminOnly, async (req, res, next) => {
    try {
        res.render("admin", {
            csrfToken: req.csrfToken(),
        });
    } catch (error) {
        next(error);
    }
});


export default router;
