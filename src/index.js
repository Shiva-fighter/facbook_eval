const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

const connect = ()=>{
    return mongoose.connect("mongodb+srv://shiva:shiva_123@cluster0.hhzhd.mongodb.net/facebook?retryWrites=true&w=majority");
}

// ---------------------------------------------user model------------------------------------------------

const userSchema =new mongoose.Schema({
    first_name:{type:String,require:true, minlength:"3", maxlength:"30"},
    last_name:{type:String, require:false},
    age:{type:Number, min:1, max:150},
    email:{type:String, unique:true, require:true},
    postId:{type:mongoose.Schema.Types.ObjectId, ref:"post", require:true},
    commentId:{type:mongoose.Schema.Types.ObjectId, ref:"comment", require:true},
    profileImages:[{type:String}]
},{
    timestamps:true
});

const User = mongoose.model("user",userSchema);


// -----------------------------------post model-----------------------------------------------------------

const postSchema  = new mongoose.Schema({

    body:{type:String, require:false},
    likes:{type:Number, default:0},
    images:{type:String , require:false},
    commentId:{type:mongoose.Schema.Types.ObjectId, ref:"comment", require:true}
    
},{
    timestamps:true
});

const Post = mongoose.model("post",postSchema);


// -------------------------------------Postlike Model---------------------------------------------------


const PostlikeSchema = new mongoose.Schema({
postId:{type:mongoose.Schema.Types.ObjectId, ref:"post", require:true},
userId:{type:mongoose.Schema.Types.ObjectId, ref:"user", require:true}

});

const Postlike = mongoose.model("postlike",PostlikeSchema);


// ---------------------------------------- Comment Model----------------------------------------------------


const commentSchema = new mongoose.Schema({
    body:{type:String, require:true},

}, {
    timestamps:true
});

const Comment = mongoose.model("comment", commentSchema);


app.post("/post", async(req,res)=>{
    try{
        const post = await Post.create(req.body);
        return res.status(201).send(post);

    }catch(err){
        return res.status(500).send(err.message);
    }
});




app.post("/user", async(req,res)=>{
    try{
        const user = await User.create(req.body);
        return res.status(201).send(user);

    }catch(err){
        return res.status(500).send(err.message);
    }
});




app.get("/user", async(req,res)=>{
    try{
        const user = await User.find().lean().exec();
        return res.status(201).send(user);

    }catch(err){
        return res.status(500).send(err.message);
    }
});



app.post("/comment", async(req,res)=>{
    try{
        const comment = await Comment.create(req.body);
        return res.status(201).send(comment);

    }catch(err){
        return res.status(500).send(err.message);
    }
});


app.get("/user", async(req,res)=>{
    try{
        const page = req.query.page || 1;
        const size = req.query.page || 1;

        const query ;
        const user = await User.find(query).skip((page - 1) * size).limit(size).lean().exec();
        return res.status(201).send(user);
       

    }catch(err){
        return res.status(500).send(err.message);
    }
});




app.delete("/user/:id", async(req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        return res.status(200).send(user);
    }
    catch(err){
        console.log(err.message);
    }
})





app.listen(8001, async(req,res)=>{
    try{
        await connect();
        console.log("listenin port 8001");
    }
    catch(err){
        console.error(err.message);
    }
  
});