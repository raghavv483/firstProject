
const mongoose=require("mongoose");
const connect = async ()=>{
    try{
        const response=await mongoose.connect(`${process.env.MONGOURL}`)
        //console.log(response.connection)
        console.log("Mongo connected");
    }
    catch{
        console.log("mongo connection failed errror");
        process.exit(1);
    }
}

module.exports={connect};