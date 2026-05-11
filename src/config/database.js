const mongoose=require("mongoose")
const connectDB=async()=>{
    await mongoose.connect("mongodb://rnitesh4445:test123@nitesh-shard-00-00.zt2do.mongodb.net:27017,nitesh-shard-00-01.zt2do.mongodb.net:27017,nitesh-shard-00-02.zt2do.mongodb.net:27017/test?ssl=true&replicaSet=atlas-o18rew-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Nitesh"
    )}
module.exports=connectDB;