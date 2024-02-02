import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const PostSchema = new mongoose.Schema({
    _id: ObjectId,

    author: {
        type: ObjectId, 
        ref: "User", 
    },

    content: {
        type: String,
        required: "you can't just post nothing",   
        maxLength: 255
    },

    reactions: [
        {
            author: {
                type: ObjectId,
                ref: "User",
            },

            // "like", "dislike"
            reactionType: String,
        }
    ],

    createdOn: { type: Date, default: Date.now },
});

export const Post = mongoose.model("Post", PostSchema);