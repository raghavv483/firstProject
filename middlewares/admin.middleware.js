const express = require('express');  
const app = express();  
const bodyParser = require('body-parser');  
const admin=require("../models/admins")

let users = []; //user data  
let projects = []; // project data  

const adminMiddleware = async(req, res, next) => {  
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const admin = await admin.findById(decodedToken?._id).select(" -password -refreshToken");
    
    if (!admin) {
        throw new ApiError(401, "Invalid access token");
    }
    req.admin = admin;
        next();
};  



//ger all users
app.get('/admin/users', adminMiddleware, (req, res) => {  
  res.json(users);  
});  

// edit project  
app.put('/admin/projects/:projectId', adminMiddleware, (req, res) => {  
  const { projectId } = req.params;  
  const updatedDetails = req.body; 

  const projectIndex = projects.findIndex(project => project.id === projectId);  
  
  if (projectIndex !== -1) {  
    projects[projectIndex] = { ...projects[projectIndex], ...updatedDetails }; // Update project  
    res.json({ message: 'Project updated', project: projects[projectIndex] });  
  } else {  
    res.status(404).json({ message: 'Project not found' });  
  }  
});  

// delete project  
app.delete('/admin/projects/:projectId', adminMiddleware, (req, res) => {  
  const { projectId } = req.params;  

  projects = projects.filter(project => project.id !== projectId); // Remove project  
  res.json({ message: 'Project deleted successfully' });  
});  

