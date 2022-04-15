//requires
const exp = require("constants");
const express = require("express");
const req = require("express/lib/request");
const upload = require("express-fileupload");
const path = require("path");
const { execPath } = require("process");
let session = require("express-session");
const fs = require("fs");

//app setup
const myBlog = express();
const port = 5020;

//Setup Session
myBlog.use(
  session({
    secret: "thisismyrandomkeysuperrandomsecret",
    resave: false,
    saveUninitialized: true,
  })
);

//view engine setup
myBlog.use(express.urlencoded({ extended: true }));
myBlog.set("views", path.join(__dirname, "views"));
myBlog.use(express.static(__dirname + "/public"));
myBlog.set("view engine", "ejs");
myBlog.use(upload());

//Create Object Destructuring for Express Validator
const { check, validationResult } = require("express-validator");
myBlog.use(express.urlencoded({ extended: true }));

//Setup DB Connection
const mongoose = require("mongoose");
const { render } = require("express/lib/response");
mongoose.connect("mongodb://localhost:27017/personalBlog", {
  UseNewUrlParser: true,
  UseUnifiedTopology: true,
});

//Setup DB Model

const Post = mongoose.model("post", {
  title: String,
  description: String,
  imageName: String,
  image: {
    data: Buffer,
    contentType: String,
  },
});

const Admin = mongoose.model("Admin", {
  username: String,
  password: String,
});

//------------------- Validation Functions --------------------

//------------------- Set up different routes (pages) --------------------

//Home Page Get
myBlog.get("/", (req, res) => {
  Post.find({}).exec((err, posts) => {
    console.log(err);
    res.render("home", { posts: posts });
  });
});

//Admin Panel Get
myBlog.get("/adminPanel", (req, res) => {
  if (req.session.userLoggedIn) {
    Post.find({}).exec((err, posts) => {
      console.log(err);
      res.render("adminPanel", { posts: posts });
    });
  } else {
    res.redirect("login");
  }
});

//Admin Panel Post
myBlog.post("/addNewPost", (req, res) => {
  let title = req.body.title;
  let description = req.body.editor1;
  let image = req.files.image;
  let imageName = image.name;
  let imagePath = "public/_uploadedImages/" + imageName;
  let imagePathDB = "_uploadedImages/" + imageName;
  image.mv(imagePath, (err) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      let postData = {
        title: title,
        description: description,
        imageName: imagePathDB,
      };

      let post = new Post(postData);
      post.save().then(() => {
        console.log("Data saved in Database.");
      });
    }
    Post.find({}).exec((err, posts) => {
      console.log(err);
      res.render("adminPanel", { posts: posts });
    });
  });
});

//Login Page Get
myBlog.get("/login", (req, res) => {
  Post.find({}).exec((err, posts) => {
    console.log(err);
    res.render("login", { posts: posts });
  });
});

//Login Page Post
myBlog.post("/login", (req, res) => {
  let user = req.body.username;
  let pass = req.body.password;

  Admin.findOne({ username: user, password: pass }).exec((err, admin) => {
    console.log(`Error: ${err}`);
    console.log(`Admin: ${admin}`);

    if (admin) {
      req.session.username = admin.username;
      req.session.userLoggedIn = true;

      res.redirect("/adminPanel");
    } else {
      res.render("login", {
        error: "Login Failed. Enter Correct Username and Password",
      });
    }
  });
});

//Gets Page to add new Post
myBlog.get("/addNewPost", (req, res) => {
  Post.find({}).exec((err, posts) => {
    console.log(err);
    res.render("addNewPost", { posts: posts });
  });
});

myBlog.get("/nav/:id", (req, res) => {
  console.log(req.params);
  let id = req.params.id;
  console.log(id);
  Post.findOne({ _id: id }).exec((err, blogPost) => {
    console.log(`Error: ${err}`);
    console.log(`Post: ${blogPost}`);
    if (blogPost) {
      res.render("post", { blogPost: blogPost });
    } else {
      res.send("No Post by this ID in Database.");
    }
  });
});

//Delete a post
myBlog.get("/delete/:id", (req, res) => {
  if (req.session.userLoggedIn) {
    let id = req.params.id;
    console.log(id);
    Post.findByIdAndDelete({ _id: id }).exec((err, post) => {
      console.log(`Error: ${err}`);
      console.log(`Post: ${post}`);
      if (post) {
        res.render("delete", { message: "Record Deleted Successfully" });
      } else {
        res.render("delete", { message: "Record not deleted" });
      }
    });
  } else {
  }
});

//Edit Page
myBlog.get("/edit/:id", (req, res) => {
  if (req.session.userLoggedIn) {
    let id = req.params.id;
    console.log(id);
    Post.findOne({ _id: id }).exec((err, post) => {
      console.log(`Error: ${err}`);
      console.log(`Post: ${post}`);
      if (post) {
        res.render("edit", { post: post });
      } else {
        res.send("No Post by this ID in Database.");
      }
    });
  }
});

//Edit post
myBlog.post("/edit/:id", (req, res) => {
  let id = req.params.id;

  let title = req.body.title;
  let description = req.body.editor1;
  let image = req.files.image;
  let imageName = image.name;
  let imagePath = "public/_uploadedImages/" + imageName;
  let imagePathDB = "_uploadedImages/" + imageName;

  let postData;

  image.mv(imagePath, (err) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      postData = {
        title: title,
        description: description,
        imageName: imagePathDB,
      };
    }
  });

  Post.findOne({ _id: id }).exec((err, post) => {
    post.title = title;
    post.description = description;
    post.imageName = imagePathDB;
    post.save();
  });

  Post.find({}).exec((err, posts) => {
    console.log(err);
    res.render("adminPanel", { posts: posts });
  });
});

//Logout Page Get
myBlog.get("/logout", (req, res) => {
  req.session.username = "";
  req.session.userLoggedIn = false;
  res.send("Admin Logged Out");
});

//display the port on which app is running in terminal
myBlog.listen(port, () => console.info(`App listening on port ${port}`));
