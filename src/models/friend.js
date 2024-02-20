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
      // "pending", "confirmed"
      default: "pending"
    },

    sentOn: { type: Date, default: Date.now },
});

export const Friend = mongoose.model("Friend", FriendSchema);

export const getAUserFriends = async (userObjectId) => {
  const friends = await Friend.find({ sentTo: userObjectId, status: "confirmed" })
    .populate("sentTo")
    .populate("user");

  if (!friends) return null;

  return friends;
};

export const getAUserFriendRequests = async (userObjectId) => {
  const friends = await Friend.find({ sentTo: userObjectId, status: "pending" })
    .populate("sentTo")
    .populate("user");

  if (!friends) return null;

  return friends;
};
