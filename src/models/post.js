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

            // "like"
            reactionType: String,
        }
    ],

    createdOn: { type: Date, default: Date.now },
});

export const Post = mongoose.model("Post", PostSchema);

export const getAUserPosts = async (userObjectID) => {
  const posts = await Post.find({ author: userObjectID  })
    .populate("author")
    .populate("reactions.author")
    .sort({ createdOn: -1 });

  if (!posts) return null;

  return posts;
};

export const getLatestPosts = async () => {
  const posts = await Post.find()
    .sort({ createdOn: -1 })
    .populate("reactions.author")
    .populate("author")
    .limit(15);

  if (!posts) return null;

  return posts;
};

export const createPost = async (author, content) => {
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    author,
    content,
    reactions: []
  });

  await post.save();
};

export const fetchPost = async (postObjectId) => {
  const post = await Post.findOne({ _id: postObjectId })
    .populate("reactions.author")
    .populate("author");

  if (!post) return null;

  return post;
};
