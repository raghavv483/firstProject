const express = require('express');  
const router = express.Router();  
const app=express();
const path=require("path");
require("../controllers/user.controller");
const upload=require("../middlewares/multer.middleware.js")
const verifyJWT=require("../middlewares/auth.middleware.js");
const {
    addProject,deleteProject,editProject,viewProjects,viewAllUsersAndProjects
}=require("../controllers/dashboard.js");
const {logoutUser,signupUser,login} = require('../controllers/user.controller');
const {adminlogin}=require("../controllers/admin.controller.js")

app.set("view engine", "ejs");  
app.set("views", path.join(__dirname, "views"));  
app.use(express.static(path.join(__dirname, 'public')));

// app.get("/singin", function(req, res) {
//     res.render("/login.ejs");  // signin is example you can give your ejs file
// });

router.post("/register", signupUser );  

router.route("/login").post(upload.none(), login);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/admin/login").post(adminlogin);

router.route("/project/create").post(
    upload.fields([
        
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    addProject)
router.route("/admin/users").get(viewAllUsersAndProjects)
router.route("/project/list").get(verifyJWT,viewProjects)
router.route("/project/update/:project_id").put(verifyJWT,editProject)
router.route("/project/delete/:project_id").delete(verifyJWT,deleteProject)

module.exports=router;