const jwt=require("jsonwebtoken");
const User=require("../models/user")

const userAuth=async(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token)
        {
            throw new Error("token is not present")
        }
        const decode=jwt.verify(token,"devTender@project")
        const {_id}=decode;
        const user=await User.findById(_id);
        if(!user)
        {
            throw new Error("user is not present")
        }
        req.user=user;
        next();
    }
    catch(err){
        res.status(500).send("something went wrong"+err.message)
    }
}
module.exports=userAuth;
