import express from "express";
import * as middleware from "../utils/middleware.js";
import { User } from "../models/user.js";
import { Post } from "../models/post.js";

const router = express.Router();

router.get("/", ...middleware.out, async (req, res, next) => {
    try {    
        const users = await User.find()
            .sort({ createdOn: 1 })
            .limit(5);

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
        const posts = await Post.find()
            .sort({ createdOn: 1 })
            .limit(15);

        res.render("home", {
            csrfToken: req.csrfToken(),
            posts
        });
    } catch (error) {
        next(error);
    }
});

export default router;