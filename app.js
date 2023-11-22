const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch((err) => console.log(err));

mongoose.connect(
  "mongodb+srv://sarthak2232:SIrQ9rZEBiOWLcaM@cluster0.j87obzj.mongodb.net/blogDB"
);

async function main() {
  try {
    const postSchema = new mongoose.Schema({
      title: { type: String },
      content: { type: String },
    });

    const Post = mongoose.model("Post", postSchema);

    app.get("/",async function (req, res) {
      const posts=await Post.find();

      res.render("home", {
        newPostItems: posts,
      });
    });

    app.get("/about", function (req, res) {
      res.render("about");
    });

    app.get("/contact", function (req, res) {
      res.render("contact");
    });

    app.get("/compose", function (req, res) {
      res.render("compose");
    });

    app.post("/compose",function (req, res) {
      const post = new Post({
        title: req.body.postTitle,
        content: req.body.postContent,
      });
      post.save();
      res.redirect("/");
    });

    app.get("/posts/:postId",async function (req, res) {
      const requestedPostId = req.params.postId;
      const findPost= await Post.findOne({_id: requestedPostId});
      res.render("post", {
        postTitle: findPost.title,
        postContent: findPost.content,
        });
    });
    app.post("/delete",async function(req,res){
      const deletePost=req.body.deletePost;
      await Post.deleteOne({_id: deletePost});
      res.redirect("/");
    });

    app.listen(3000, function () {
      console.log("Server started on port 3000");
    });
  } catch (error) {
    console.log(error);
  } finally {
    //mongoose.connection.close();
  }
}
