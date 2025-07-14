const express = require("express");
const bodyParser = require("body-parser");
const app = express();
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const { v4: uuidv4 } = require('uuid'); // Add at the top
// npm install uuid (run this in terminal if not done yet)

// In-memory store
let posts = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("home", { posts });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = {
    id: uuidv4(), // Add unique id
    title: req.body.posttitle,
    content: req.body.postBody
  };
  posts.push(post);
  res.redirect("/");
});

// Change route to use postId instead of title
app.get("/posts/:postId", (req, res) => {
  const post = posts.find(p => p.id === req.params.postId);
  if (post) {
    res.render("post", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

app.get("/edit/:postId", (req, res) => {
  const post = posts.find(p => p.id === req.params.postId);
  if (!post) return res.status(404).send("Post not found");
  res.render("edit", { post });
});

app.post("/edit/:postId", (req, res) => {
  const post = posts.find(p => p.id === req.params.postId);
  if (post) {
    post.title = req.body.posttitle;
    post.content = req.body.postBody;
  }
  res.redirect("/");
});

app.post("/delete/:postId", (req, res) => {
  const postId = req.params.postId;
  const index = posts.findIndex(p => p.id === postId);
  if (index !== -1) {
    posts.splice(index, 1);
  }
  res.redirect("/");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});