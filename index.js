const express=require('express');
const path=require("path");
const bcrypt=require("bcrypt");
const collection=require("./config");

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('view engine','ejs');

app.use(express.static("public"));
app.get("/",(req,res)=>{
    res.render("login");
});


app.get("/signup",(req,res)=>{
    res.render("signup");
});

app.post("/signup",async(req,res)=>{
    const data={
        name:req.body.username,
        password:req.body.password
    }
    // check for user exist
    const existingUser=await collection.findOne({name:data.username});

    if(existingUser){

        res.send("User already exist you can login or use different username")
    }else{
        // hash format for password
        const saltRounds=10;//no of salt round for bcrypt
        const hashedPassword=await bcrypt.hash(data.password,saltRounds);
        data.password=hashedPassword;//replace hash password with original

    const userdata=await collection.insertMany(data);
    console.log(userdata);
    }

});

// Login user
app.post("/login",async(req,res)=>{
    try{

        const check=await collection.findOne({name:req.body.username})
        if(!check){
            res.send("username cannot found");
        
        }
        

        const isPasswordMatch=await bcrypt.compare(req.body.password,check.password);
    if(isPasswordMatch){
        res.render("home");
    }
    else{
        req.send("wrong password");
    }

    }catch{
        res.send("wrong details enter correctly")

    }

})


const port=5000;
app.listen(port,()=>{
    console.log('server running on port :',{port});
})