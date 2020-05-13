//jshint esversion: 6
const express = require ('express'),
      app = express(),
      bodyParser = require('body-parser'),
      expressSanitizer = require('express-sanitizer'),
      mongoose = require('mongoose'),
methodOverride = require('method-override');

//APP CONFIG
mongoose.connect('mongodb://localhost/restful_blog_app',{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.use(express.static("Public"));

//MONGOOSE MODEL CONFIG
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

let Blog = mongoose.model("blog", blogSchema);
/*
 * Blog.create({
 *     title: "Fallen",
 *     image:"https://media.gettyimages.com/photos/hanging-out-2-picture-id172663152?s=2048x2048",
 *     body: "The Super lady wonder"
 * })
 * */
// ROUTES

app.get("/", (req, res)=>{
  res.redirect("/blogs");
});

app.get("/blogs", (req, res)=>{
    Blog.find({}, (err, blogs)=>{
	if(err){
	  console.log(err);
	}else{
	  res.render("index",{blogs: blogs});
	}
    });
});

// route for a new post
app.get("/blogs/new", (req, res)=>{
    res.render("new");
});

// create route
app.post("/blogs", (req, res)=>{
    let blogData = req.body.blog ;
  console.log(blogData.body);
    blogData.body = req.sanitize(blogData.body);
    console.log(blogData.body);
    Blog.create(blogData, (err, newBlog)=>{
	if(err){
	    res.render("new");
	}else{
	    res.redirect("/blogs");
	}
    });
});


// show route
app.get("/blogs/:id", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
	if(err){
	    res.redirect("/blogs");
	}else{
	  res.render("show", {foundBlog: foundBlog});
	}
   });
});

// edit route

app.get("/blogs/:id/edit", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
	if(err){
	    res.redirect("/blogs");
	}else{
	  res.render("edit", {foundBlog: foundBlog});
	}
});
});

// update route
app.put("/blogs/:id", (req,res)=>{
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
	if(err){
	    console.log(err);
	    res.redirect("/blogs");
	}else{
	    res.redirect("/blogs/"+req.params.id);
	}
    });
});

// delete route
app.delete("/blogs/:id", (req, res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
	if(err){
	    res.redirect("/blogs");
	}else{
	    res.redirect("/blogs");
	}
    });
});

app.listen(4000, ()=>{
    console.log("The Blog Post App Server has started");
});
