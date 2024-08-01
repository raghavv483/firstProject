const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv").config();
const bcrypt=require("bcrypt");


const userSchema=mongoose.Schema({
    userProject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                // Regex to validate email ending with @lnmiit.ac.in
                return /^[a-zA-Z0-9._%+-]+@lnmiit\.ac\.in$/.test(v);
            },
            message: props => `${props.value} is not a valid institute email. Only emails ending with @lnmiit.ac.in are allowed.`
        }
    },

    fullName: {
        type: String,
        required: [true, 'fullname is required'],
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function(v) {
                // Regex to check password strength
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            },
            message: props => `Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.`
        }
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v === this.password;
            },
            message: 'Passwords do not match.'
        }
    },

    refresh_token:{
        type:String,
    },

},{
    timestamp:true
});
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    //console.log("pre ",this.password);
    next();
});

userSchema.methods = {
     comparePassword : async function(plainTextPassword) {  
        try {  
            if (!this.password || !plainTextPassword) {  
                throw new Error('Missing password(s) for comparison');  
            }  
    
            // Compare hashed password with the plaintext  
            const isMatch = await bcrypt.compare(plainTextPassword, this.password);  
         //   console.log(this.password,plainTextPassword)
            console.log(isMatch); // true if passwords match, false otherwise  
            return isMatch; // Return the result of comparison  
        } catch (error) {  
            console.error('Error comparing passwords:', error);  
            return false; // or throw the error based on your preference  
        }  
    },
    generateAccessToken: function(){
    return jwt.sign(
        
        {
        _id: this._id,
        email:this.email,
        fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "10d"
        }
    )
},
    generateRefreshToken: function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "1d"
        }
    )
},
}

module.exports = mongoose.model('User', userSchema);  