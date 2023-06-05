//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Built this garbage where I write my nonsense thoughts because I don't like posting them on social media.";
const aboutContent = "I'm nobody.";
const contactContent = "email: bryansuello@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//let posts = [];

app.get("/", function(req, res){
  // res.render("home", {
  //   startingContent: homeStartingContent,
  //   posts: posts
  //   });

  // outdated 
  // Post.find({}, function(err, posts){
  //    res.render("home", {
  //      startingContent: homeStartingContent,
  //      posts: posts
  //      });
  //  })
  Post.find().then(posts =>{
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
        });
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody
  // };
  // posts.push(post);
const post = new Post ({
   title: req.body.postTitle,
   content: req.body.postBody
 });
  // post.save();
  // res.redirect("/");
post.save()
    .then(() => {
      console.log('Post added to DB.');
      res.redirect('/');
    })
    .catch(err => {
      res.status(400).send("Unable to save post to database.");
    });
});

app.get("/posts/:postId", function(req, res){
  //const requestedTitle = _.lowerCase(req.params.postName);
  const requestedPostId = req.params.postId;

  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);
  //   if (storedTitle === requestedTitle) {
  //     res.render("post", {
  //       title: post.title,
  //       content: post.content
  //     });
  //   }
  // });

  Post.findOne({_id : requestedPostId})
    .then((foundpost) =>{
    res.render("post", {title : foundpost.title, content : foundpost.content});
  })

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});



//mongoose
mongoose.connect("mongodb+srv://bryansuello:ukr1zjct5@cluster0.9bhawvq.mongodb.net/blogDB", {useNewUrlParser: true});
const postSchema = {
   title: String,
   content: String
};
const Post = mongoose.model("Post", postSchema);

