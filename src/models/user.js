import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const UserSchema = new mongoose.Schema({
  _id: ObjectId,

  id: {
    type: String,
    trim: true,
  },

  username: {
    type: String,
    trim: true,
    required: "an username is required",
    minLength: 3,
    maxLength: 15,
  },

  displayName: {
    type: String,
    trim: true,
    minLength: 3,
    maxLength: 60,
  },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    maxLength: 100,
    required: "an email address is required",
    match: [EMAIL_REGEX, "a valid email address is required"],
  },

  passwordHash: String,

  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  isOwner: { type: Boolean, default: false },
  createdOn: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: 0 },

  profile: {
    css: { type: String, trim: true, default: "" },
    bio: {
      type: String,
      trim: true,
      default: "I'm too lazy to change the default bio!",
      maxLength: 255
    },
    song: {
      enabled: { type: Boolean, default: false },
      name: { type: String, trim: true },
      mime: { type: String, trim: true, default: "audio/mp3" }
    }
  },

  ratelimits: {
    lastPostCreation: { type: Date }
  },

  // Serbian stock market
  money: { type: Number, default: 1000 },
});

export const User = mongoose.model("User", UserSchema);

export const getUserByEmail = async (email) => {
  if (typeof email != "string") return null;

  email = email.trim().replace(/\.$/g, "");
  let user = await User.findOne({ email });

  if (!user) return null;

  return user;
};

export const getUserByUsername = async (username) => {
  if (typeof username != "string") return null;

  username = username.trim();
  let user = await User.findOne({ username });

  if (!user) return null;

  return user;
};

export const getNewUsers = async () => {
  const users = await User.find({ isBanned: false })
    .sort({ createdOn: -1 })
    .limit(10);

  if (!users) return null;

  return users;
};
