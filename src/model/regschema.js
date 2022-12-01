const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    password:String,
    username:{
        type:String,
        unique:true
    }
})
userSchema.pre("save",async function(next) {
    this.password = await bcrypt.hash(this.password,10);
    next();
})
const Register = new mongoose.model("Register",userSchema);


module.exports = Register;