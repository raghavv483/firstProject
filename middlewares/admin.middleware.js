const express = require('express');  
const app = express();  
const bodyParser = require('body-parser');  


let users = []; //user data  
let projects = []; // project data  

const adminMiddleware = (req, res, next) => {  
  const email = req.body.email; 
  
  if (adminEmails.includes(email)) {  
    next(); 
  } else {  
    res.status(403).json({ message: 'You are not a  Admin' });  
  }  
};  


app.post('/admin/login', (req, res) => {  
  const email = req.body.email;  

  if (adminEmails.includes(email)) {  
    res.status(200).json({ message: 'Login successful' });  
  } else {  
    res.status(401).json({ message: 'Invalid admin email' });  
  }  
});  

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

