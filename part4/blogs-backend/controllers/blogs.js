const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const user = await User.findOne();

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
  const id = request.params.id;
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
