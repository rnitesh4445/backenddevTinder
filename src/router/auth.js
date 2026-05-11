const express = require('express');
const router = express.Router();

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userAuth=require("../middleware/auth")
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    const hasedPassword=await bcrypt.hash(password,10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password:hasedPassword
    });

    await user.save();

    res.send("User registered successfully");
  } catch (err) {
    res.status(500).send("Error saving user: " + err.message);
  }
});

router.post("/login",async(req,res)=>{
  try{
    const {emailId,password}=req.body;
    const user=await User.findOne({emailId})
    const isMatch=await bcrypt.compare(password,user.password);
    if(!user)
    {
      throw  new Error ("invalid credinatial")
    }
  
    else if(!isMatch)
    {
      throw  new Error("invalid credintial")
    }
    else{
     const token =jwt.sign({_id:user.id},"devTender@project")
  
      res.cookie("token",token)
      console.log(token);
    
    res.send("login succesfull!!!!!!!!!!")

    }
  }
  catch(err){
      console.error("something went wrong",err);
  }
})

router.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    })
    res.send("logout successful")
})

module.exports=router;