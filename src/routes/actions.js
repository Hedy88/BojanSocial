import express from "express";
import * as middleware from "../utils/middleware.js";
import mongoose from "mongoose";
import { Post } from "../models/post.js";

const router = express.Router();

/*
    error 1 = "your post needs to be less then 255 characters"
    error 2 = "you can't just post nothing!"
*/
router.post("/actions/post", ...middleware.user, async (req, res, next) => {
    try {    
        let { content } = req.body;
        content = content.trim();

        if (content.length > 255) {
            res.redirect("/home?actionsPostError=1");
        } 

        if (content.length <= 0) {
            res.redirect("/home?actionsPostError=2");
        }

        const post = new Post({
            _id: new mongoose.Types.ObjectId(),
            author: req.currentUser._id,
            content,
            reactions: [{
                author: req.currentUser._id,
                reactionType: "like",
            }]
        });

        await post.save();

        res.redirect("/home");
    } catch (error) {
        next(error);
    }
});

export default router;