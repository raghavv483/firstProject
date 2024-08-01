const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv").config();
const bcrypt=require("bcrypt");

const adminsSchema=mongoose.Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'password is required']
    }
},{
    timestamp:true
});


module.exports = mongoose.model('admins', adminsSchema);  