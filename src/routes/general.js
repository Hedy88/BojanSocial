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
        let postErrorMessage;

        if (typeof req.query.postError != "undefined") {
            postErrorMessage = req.query.postError;
        }

        const posts = await Post.find()
            .sort({ createdOn: -1 })
            .populate("reactions")
            .populate("author")
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

router.get("/linkProtection", ...middleware.any, async (req, res, next) => {
    try { 
        if (typeof req.query.link == "undefined") {
            res.redirect("/");
        }
        
        res.render("linkProtection", {
            csrfToken: req.csrfToken(),
            link: req.query.link
        });
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