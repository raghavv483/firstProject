const express = require('express');  
const router = express.Router();  
const User=require("../models/user")
const bcrypt=require("bcrypt");
const JWT=require("jsonwebtoken");
const mongoose=require("mongoose");
const ApiResponse=require("../utils/apiResponse");
const ApiError=require("../utils/apiError");
const nodemailer=require("nodemailer");
const dotenv=require("dotenv");
const generateAccessAndRefreshToken = async(userId) => {

    try {
        const user = await User.findById(userId);
        
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refresh_token = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token.");
    }
};


const signupUser = async function(req, res, next) {  
    try {  
        const { email, fullName, password, username,confirmPassword} = req.body;
      
        const userExists = await User.findOne({ email }); 
      
        if (userExists) {  
            return res.status(409).json({ error: "User with this email already exists" });  
        }  
      
        console.log(confirmPassword)
        const user = await User.create({  
            fullName,   
            email,  
            password,
            username,
            confirmPassword,
            
        });  
        const createdUser = await User.findById(user._id).select("-password -refreshToken");  
        console.log(createdUser)

        if (!createdUser) {  
            return res.status(500).json({ error: "User registration failed, please try again" });  
        }  

        return res.json({msg:"User created Successfully",
            success:true
        })   
    } catch (error) {  
        console.error("Registration error:", error);  
        return res.status(500).json({ error: "An unexpected error occurred" });  
    }  
};
const login=async (req,res)=>{
    const{email,password}=req.body;
    if(!email||!password){
        throw new Error("something1 went wrong");
    }
    const user = await User.findOne({email})
    if(!user){
        throw new Error("something2 went wrong");
    }
    
    const isPassword=await user.comparePassword(password);

    if(!isPassword){
        throw new Error("something3 went wrong");
    }
    const {accessToken, refreshToken}=await generateAccessAndRefreshToken(user._id);
    //console.log(accessToken,"     ",refreshToken);
    const loggedUser= await User.findById(user._id).select(" -password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            
                {
                    user: loggedUser, accessToken, refreshToken,success:true
                },
                 
            
        ); 
}
const logoutUser = async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // removes field from document
            }
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logout successfull !!!."
            )
        );
};


module.exports={logoutUser,signupUser,login};