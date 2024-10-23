const commentsRouter = require("express").Router();
const Blog = require("../models/blog");

commentsRouter.get("/:id/comments", async (request, response) => {
  try {
    const id = request.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    response.json(blog.comments);
  } catch (error) {
    response.status(500).json({ error: "Something went wrong" });
  }
});

commentsRouter.post("/:id/comments", async (request, response) => {
  try {
    const id = request.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    blog.comments = blog.comments.concat(request.body);
    await blog.save();

    response.status(201).json(blog);
  } catch (error) {
    response.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = commentsRouter;
