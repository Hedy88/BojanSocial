import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const IPBanSchema = new mongoose.Schema({
    _id: ObjectId,

    ip: {
        type: String,
        trim: true,
        required: "an IP address is required"
    },

    bannedOn: { type: Date, default: Date.now },
    reason: { type: String, required: "a reason is required" },
});

export const IPBan = mongoose.model("IPBan", IPBanSchema);