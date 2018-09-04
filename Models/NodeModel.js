var mongoose=require("mongoose");

var NodeSchema=new mongoose.Schema({
    timestamp:{
        type:Date,
        default:Date.now
    },
    data:String,
    nodeNumber:String,
    nodeId:mongoose.Schema.ObjectId,
    referenceNodeId:String,
    childeReferenceNodeId:String,
    gensisReferenceNodeId:String,
    hashValue:String    
    
});
module.exports=mongoose.model("Node",NodeSchema);