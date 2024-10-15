const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response
      .status(400)
      .json({ error: "No users found in the database" });
  }

  const blog = new Blog({ ...request.body, user: user._id });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response
      .status(400)
      .json({ error: "no users found in the database" });
  }

  const id = request.params.id;
  const blog = await Blog.findById(id);

  if (blog.user.toString() !== user.id.toString())
    return response
      .status(401)
      .json({ error: "cannot delete blogs created by other users" });

  await Blog.findByIdAndDelete(id);

  response.status(200).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const newBlog = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(id, newBlog, { new: true });
  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
