import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const ShareSchema = mongoose.Schema({
    _id: ObjectId,

    boughtBy: {
        type: ObjectId,
        ref: "User",
    },

    boughtFor: Number,
});

const EmployeeSchema = mongoose.Schema({
    _id: ObjectId,

    employee: {
        type: ObjectId,
        ref: "User"
    },

    role: {
        type: String,
        default: "Normal"
    },

    joinedOn: { type: Date, default: Date.now },
});

const CompanySchema = mongoose.Schema({
    _id: ObjectId,

    name: {
        type: String,
        trim: true,
        required: "a company name is required",
        minLength: 3,
        maxLength: 15,
    },

    owner: {
        type: ObjectId, 
        ref: "User",
    },

    shareLimit: {
        type: Number,
        defualt: 1000,
    },

    shares: [ ShareSchema ],
    employees: [ EmployeeSchema ]
});

export const Company = mongoose.model("Company", CompanySchema);