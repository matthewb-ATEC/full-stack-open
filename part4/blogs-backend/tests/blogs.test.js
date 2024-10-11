const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

describe("blogs", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test("are returned as json", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("has a unique identifier property named id", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogs = response.body;

    blogs.forEach((blog) => {
      assert.ok(blog.id, "Blog object does not have an `id` property");
      assert.strictEqual(
        typeof blog.id,
        "string",
        "`id` is not of type string"
      );
    });
  });

  test("creating a new blog increases the number of blogs", async () => {
    await api
      .post("/api/blogs")
      .send(helper.newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await helper.blogsInDb();

    assert.strictEqual(response.length, helper.initialBlogs.length + 1);
  });

  test("creates new blog posts with accurate information", async () => {
    const response = await api
      .post("/api/blogs")
      .send(helper.newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const responseBlog = {
      title: response.body.title,
      author: response.body.author,
      url: response.body.url,
      likes: response.body.likes,
    };

    assert.deepStrictEqual(responseBlog, helper.newBlog);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
