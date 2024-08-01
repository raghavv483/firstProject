const express = require('express');  
const router = express.Router();  
const Admin=require("../models/admins");
const bcrypt=require("bcrypt");
const JWT=require("jsonwebtoken");
const mongoose=require("mongoose");
const ApiResponse=require("../utils/apiResponse");
const ApiError=require("../utils/apiError");
const generateAccessAndRefreshToken = async(userId) => {

    try {
        const user = await User.findById(userId);
        
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refresh_token = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
       console.log(error)
        // throw new ApiError(500, "Something went wrong while generating refresh and access token.");
    }
};


const adminlogin=async (req,res)=>{
    const{email,password}=req.body;
    if(!email||!password){
        throw new Error("something1 went wrong");
    }
    const admin = await Admin.findOne({email})
    if(admin) res.json({success:true,message:"check this"})
   // console.log("hello window")
    if(!admin){
        //throw new Error("something2 went wrong");
        //console.log("You are not a admin");
        res.json({success:false,message:"You are not a admin"})
    }
}
module.exports={adminlogin}