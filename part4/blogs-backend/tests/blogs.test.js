const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const User = require("../models/user");
const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const jwt = require("jsonwebtoken");
const app = require("../app");
const api = supertest(app);

describe("blogs", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  describe("get", () => {
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
  });

  describe("post", () => {
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
  });

  describe("delete", () => {
    test("removing a blog reduces the number of blogs", async () => {
      const blogs = await helper.blogsInDb();

      await api.delete(`/api/blogs/${blogs[0].id}`).expect(200);

      const response = await helper.blogsInDb();

      assert.strictEqual(response.length, helper.initialBlogs.length - 1);
    });
  });

  describe("update", () => {
    test("the updated blog matches the changes passed to it", async () => {
      const blogs = await helper.blogsInDb();
      const blogForUpdate = helper.newBlog;

      const response = await api
        .put(`/api/blogs/${blogs[0].id}`)
        .send(blogForUpdate)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const { title, author, url, likes } = response.body;
      assert.deepStrictEqual({ title, author, url, likes }, blogForUpdate);
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
