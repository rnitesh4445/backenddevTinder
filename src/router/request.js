const express=require("express");
const requestRouter=express.Router();
const userAuth=require("../middleware/auth")
const ConnectionRequestModel=require("../models/connectionRequest")
const User=require("../models/user")


requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
  try{
    const fromUserId=req.user._id;
    const toUserId=req.params.toUserId;
    const status=req.params.status;
    const allowedStatuses=["interested","ignored"]
    if(!allowedStatuses.includes(status)){
        return res.status(400).json({message:"Invalid status. "+status+" is not allowed."})
    }
    const existingConnectionRequest=await ConnectionRequestModel.findOne(
      {
        $or:[
            {fromUserId, toUserId},
            {fromUserId:toUserId, toUserId:fromUserId}
          ],
       
      }

    )
    if(existingConnectionRequest){
        return res.status(400).json({message:"Connection request already exists between these users."})
    }
    const connectionRequest=new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
    })
    const data=await connectionRequest.save();
    res.json({message:"Connection request sent successfully!", data})
  }
  catch(err){
    res.status(500).send("something went wrong"+err.message)
}
})
requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const requestId=req.params.requestId;
        const loggedInUser=req.user;
        const status=req.params.status;
        const allowedStatuses=["accepted","rejected"]
        if(!allowedStatuses.includes(status)){
            return res.status(400).json({message:"Invalid status. "+status+" is not allowed."})
        }
        const connectionRequest=await ConnectionRequestModel.findOne(
          {
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
          }
        )
if(!connectionRequest){
    return res.status(404).json({message:"Connection request not found or already reviewed."})
}
connectionRequest.status=status;
await connectionRequest.save();

res.json({message:"Connection request reviewed successfully!", connectionRequest.status})
    }
    catch(err){
        res.status(500).send("something went wrong"+err.message)
    }
})
module.exports=requestRouter;