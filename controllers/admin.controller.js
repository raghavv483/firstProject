const express = require('express');  
const router = express.Router();  
const User=require("../models/user")
const bcrypt=require("bcrypt");
const JWT=require("jsonwebtoken");
const mongoose=require("mongoose");
const ApiResponse=require("../utils/apiResponse");
const ApiError=require("../utils/apiError");


const login=async function(req, res, next) {  
    const{email,password}=req.body;
    if(!admin){
        res.status(404);
        throw new Error("You are not a admin");
    }
    if(!email||!password){
        res.status(404);
        throw new Error("Something went wrong");
    }
    

}