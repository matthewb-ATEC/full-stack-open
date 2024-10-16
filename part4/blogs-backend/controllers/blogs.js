const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const user = request.user;
  const blog = new Blog({ ...request.body, user: user });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const user = request.user;
  const id = request.params.id;
  const blog = await Blog.findById(id);

  if (blog.user.toString() !== user.id.toString())
    return response
      .status(401)
      .json({ error: "cannot delete blogs created by other users" });

  await Blog.findByIdAndDelete(id);

  user.blogs = user.blogs.filter((blog) => blog._id.toString() !== id);
  await user.save();

  response.status(200).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;

  const { likes, author, title, url } = request.body;

  // Ensure user is not changed and other fields are updated
  const blog = await Blog.findById(id);

  if (!blog) {
    return response.status(404).json({ error: "Blog post not found" });
  }

  const updatedBlog = {
    user: blog.user,
    likes,
    author,
    title,
    url,
  };

  const result = await Blog.findByIdAndUpdate(id, updatedBlog, { new: true });
  response.status(200).json(result);
});

module.exports = blogsRouter;
