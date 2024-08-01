const express=require("express");
const path=require("path");
const projectRoutes=require('./routes/projectRoutes');
const cors = require("cors");

const db=require("./db/dbConnect");


const app=express();
app.use(cors());


app.set("view engine", "ejs");  
app.set("views", path.join(__dirname, "views"));  
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  
app.use(express.static(path.join(__dirname, 'views')));
app.use("/",projectRoutes);

db.connect();

app.post('/register', (req, res) => {
  const { fullName, email, password } = req.body;

  res.status(200).json({ message: 'Registration successful' });


  res.status(400).json({ message: 'Error registering user' });
});

const port=3000;
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});