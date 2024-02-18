import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const FriendSchema = new mongoose.Schema({
    _id: ObjectId,

    user: {
      type: ObjectId,
      ref: "User",
    },

    sentTo: {
      type: ObjectId,
      ref: "User"
    },

    status: {
      type: String,
      // "pending", "confirmed", "denied"
      default: "pending"
    },

    sentOn: { type: Date, default: Date.now },
});

export const Friend = mongoose.model("Friend", FriendSchema);
