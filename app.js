const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 5000;
const upload = multer();

const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/node-tut", ()=>{
  console.log("Connected to Database");
  app.listen(PORT, ()=>{
    console.log(`Example app listening on localhost:${PORT}`);
  });
});

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended:true } ));
app.use(upload.array());
app.use(express.static('public'));

const friendSchema = new Schema({
  name:{
    type: String,
    required: true,
  },
  age:{
    type: Number,
    default: 0
  }
}, { timestamps:true });

const Friend = mongoose.model("Friend", friendSchema);

app.get("/new-friend/:name/:age", (req, res)=>{

  let name = req.params.name;
  let age = req.params.age;

  let friend_to_add = new Friend({
    name: name,
    age: age
  })

  friend_to_add.save((err, Friend)=>{
    if(err){
      res.render("error", { error:err })
    }
    else{
      res.send(Friend);
    }
  })
})

app.get("/all-friend", (req, res)=>{
  Friend.find((err, Friends)=>{
    if(err){
      res.render("error", { error:err })
    }else{
      res.send(Friends);
    }
  })
})

app.get("foo", (req, res)=>{
  res.send({message:"Hello, I Am Omkar!"});
})

app.get("/", (req, res)=>{
  Friend.find((err, Friends)=>{
    if(err){
      res.render("error", { error:err })
    }else{
      res.render("index", { 'friends':Friends })
    }
  })
});

app.post("/", (req, res)=>{

  console.log(req.body);
  let name = req.body.name;
  let age = req.body.age;

  let friend_to_add = new Friend({
    name: name,
    age: age
  });

  friend_to_add.save((err, Friend)=>{
    if(err){
      res.render("error", { error:err })
    }else{
      res.redirect("/")
    }
  })
})

app.get("/home", (req, res)=>{
  res.redirect("/")
});

app.get("/delete/:id", (req,res)=>[
  Friend.findByIdAndRemove(req.params.id, function(err, response){
     if(err){
       res.render("error", { error:"Error in deleting record id " + req.params.id })
     }
     else{
       res.redirect("/")
     }
  })
])

app.get("/update/:id", (req, res)=>{
  res.render("update");
});

app.post("/update/:id", (req, res)=>{
  let friend_to_update_id = req.params.id;

  let name = req.body.name;
  let age = req.body.age;

  Friend.findByIdAndUpdate(friend_to_update_id, { name:name, age:age }, (err, Response)=>{
    if(err){
      res.render("error", { error: err })
    }else{
      res.redirect("/home")
    }
  });
})

app.use((req, res)=>{
  res.status(404);
  res.render("404")
})
