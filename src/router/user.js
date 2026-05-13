const expresss=require('express');
const userAuth = require('../middleware/auth');
const userRouter=expresss.Router();
const  ConnectionRequest=require("../models/connectionRequest")


const UserSafeFields=["firstName","lastName","skills","profilePicture"];
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const userId=req.user._id;
        const connectionRequests=await ConnectionRequest.find(
            {
                toUserId:userId,
                status:"interested"
            }
        ).populate("fromUserId",UserSafeFields )
        
res.json({message:"Received connection requests fetched successfully!", data:connectionRequests})
    }
    catch(err){
        res.status(500).send("something went wrong"+err.message)
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{

    try{
        const userId=req.user._id;
        const connections=await ConnectionRequest.find(
            {
                $or:[
                    {fromUserId:userId, status:"accepted"},
                    {toUserId:userId, status:"accepted"}
                ]
            }
            ).populate("fromUserId toUserId",UserSafeFields)
            const data=connections.map((raw)=>
            {
                if(raw.fromUserId._id.toString()===userId.toString())
                {
                    return raw.toUserId;
                }
                else{
                    return raw.fromUserId;
                }
            }
                )
res.json({message:"Connections fetched successfully!", data})
    }
    catch(err){
        res.status(500).send("something went wrong"+err.message)
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const loggedInUserId=req.user._id;
        const connections=await ConnectionRequest.find(
            {
                $or:[
                    {fromUserId:loggedInUserId, toUserId:loggedInUserId}
                ],
            }
        ).select("fromUserId toUserId")

        const hideUserFromFeed=set();
        connections.forEach((conn)=>{
          
                hideUserFromFeed.add(conn.toUserId.toString())
                hideUserFromFeed.add(conn.fromUserId.toString())
        
        })

        const users=await User.find(
            {
                _id:{$nin:Array.from(hideUserFromFeed)},
                _id:{$ne:loggedInUserId}
            }


        ).select(UserSafeFields)
    }
    catch(err){
        res.status(500).send("something went wrong"+err.message)
    }


})
module.exports=userRouter;