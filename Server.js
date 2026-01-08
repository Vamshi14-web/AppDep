const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 2233;

let app = express();
app.use(cors());
app.use('/profilePic',express.static('profilePic'));

const path = require("path");

app.use(express.static(path.join(__dirname, "client/build")));

app.use("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
      cb(null,'profilePic')
    },
    filename:(req, file, cb)=>{
    cb(null,`${Date.now()}_${file.originalname}`)
    }
});
const upload = multer({storage:storage});

app.post("/signup",upload.single("profilePic"),async(req,res)=>{
    console.log(req.body);
    let  hashedPassword = await bcrypt.hash(req.body.password,10)
    try{
        let users = new user({
         firstName:req.body.firstName,
         lastName:req.body.lastName,
         email:req.body.email,
         password:hashedPassword,
         age:req.body.age,
         mobileNo:req.body.mobileNo,
         profilePic:req.file.path 
        });
        await user.insertMany([users]);
        console.log("Inserted Successfully");
        res.json({status:"Success",msg:"Account Created Successfully"});
    }catch(err){
        console.log("Unable to Insert");
        res.json({status:"failed",msg:"Unable to Create"});
    }
});

// app.post("/validateToken",upload.none(),async(req,res)=>{

//     let decryptedCredintials = jwt.verify(req.body.token,"brn");
//     console.log(decryptedCredintials);
    
//     let userArr = await user.find().and([{email:decryptedCredintials.email}]);
    
//     if(userArr.length>0){
//         if(decryptedCredintials.password === userArr[0].password){
//             let dataToSend = {
//                 firstName:userArr[0].firstName,
//                 lastName:userArr[0].lastName,
//                 email:userArr[0].email,
//                 age:userArr[0].age,
//                 mobileNo:userArr[0].mobileNo,
//                 profilePic:userArr[0].profilePic,
                
//             }
//             res.json({status:"Success",msg:"credintials are correct",data:dataToSend});
//         }else{
//             res.json({status:"Failure",msg:"Invalid Password"});
//         }
//     }else{
//            res.json({status:"Failure",msg:"user doesn't exist"});
//     }
// });

app.post("/validateToken", upload.none(), async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, "brn");

    const userArr = await user.find().and([{ email: decoded.email }]);

    if (userArr.length === 0) {
      return res.json({ status: "Failure", msg: "user doesn't exist" });
    }

    res.json({
      status: "Success",
      msg: "Token valid",
      data: {
        firstName: userArr[0].firstName,
        lastName: userArr[0].lastName,
        email: userArr[0].email,
        age: userArr[0].age,
        mobileNo: userArr[0].mobileNo,
        profilePic: userArr[0].profilePic
      }
    });
  } catch (err) {
    res.json({ status: "Failure", msg: "Invalid token" });
  }
});

app.post("/login",upload.none(),async(req,res)=>{
    let userArr = await user.find().and([{email: req.body.email}]);
    if (userArr.length === 0) {
  return res.json({ status: "Failure", msg: "user doesn't exist" });
  }
    let token = jwt.sign({email:req.body.email},"brn");
   
    let isValidPassword = await bcrypt.compare(req.body.password,userArr[0].password)

        if(isValidPassword === true){
            let dataToSend = {
                firstName:userArr[0].firstName,
                lastName:userArr[0].lastName,
                email:userArr[0].email,
                age:userArr[0].age,
                mobileNo:userArr[0].mobileNo,
                profilePic:userArr[0].profilePic,
                token:token
                
            }
            res.json({status:"Success",msg:"credintials are correct",data:dataToSend});
        }else{
            res.json({status:"Failure",msg:"Invalid Password"});
        }
});

app.patch("/updateProfile",upload.single("profilePic"),async (req,res)=>{
    console.log(req.body);
    try{
    if(req.body.firstName.trim().length>0){
        await user.updateMany({email:req.body.email},{firstName:req.body.firstName})
    };
    if(req.body.lastName.trim().length>0){
        await user.updateMany({email:req.body.email},{lastName:req.body.lastName})
    };
    // if(req.body.password.trim().length>0){
    //     await user.updateMany({email:req.body.email},{password:req.body.password})
    // };
    if(req.body.age > 0){
        await user.updateMany({email:req.body.email},{age:req.body.age})
    };
    if(req.body.mobileNo > 0){
        await user.updateMany({email:req.body.email},{mobileNo:req.body.mobileNo})
    };
    if(req.file){
        await user.updateMany({email:req.body.email},{profilePic:req.file.path})
    };
    res.json({status:"Success",msg:"User updated Successfully"})
}catch(err){
res.json({status:"Failur",msg:"Nothing id updated"})
}
});

app.listen(port,()=>{
    console.log(`Listening to Port ${port}`);
});

let userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    password:String,
    age:Number,
    mobileNo:Number,
    profilePic:String
});

let user = new mongoose.model("user",userSchema,"user");

let connectToMDB = async()=>{
    try{
        await mongoose.connect(process.env.MDBURL);
        console.log("Successfully Connected to MDB");
    }catch(err){
        console.log("Unable to Connect");
    }
};
connectToMDB();