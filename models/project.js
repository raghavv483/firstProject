const mongoose=require("mongoose");

const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt")



const projectSchema=mongoose.Schema({
    Project_name: {
        type: String,
        required: [true, 'Project_name is required'],
    },
    Github_url: {
        type: String,
        required: [true, 'Github_url is required'],
    },
    thumbnail: {
        type:String,
        required: true,
    },
   
    Live_hosted_link:{
        type:String,
    },
    TechStack_used:{
        type:String,
    },
},{
    timestamp:true
});

module.exports=mongoose.model("Project",projectSchema);