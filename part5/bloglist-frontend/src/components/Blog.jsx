import { useState } from "react";
import blogsService from "../services/blogs";

const Blog = ({ blog, setBlogs, blogs }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const increaseLikes = async () => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
      };

      const returnedBlog = await blogsService.update(blog.id, updatedBlog);

      // Update the blogs state with the updated blog post
      setBlogs(blogs.map((b) => (b.id !== blog.id ? b : returnedBlog)));
    } catch (error) {
      console.log("Error updating likes: ", error);
    }
  };

  const deleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        blogsService.deleteBlog(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
      } catch (error) {
        console.log("Error deleting blog", error);
      }
    }
  };

  if (!showDetails)
    return (
      <div style={blogStyle}>
        <div>
          {blog.title}{" "}
          <button
            onClick={() => {
              setShowDetails(true);
            }}
          >
            view
          </button>
        </div>
      </div>
    );

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
        <button
          onClick={() => {
            setShowDetails(false);
          }}
        >
          hide
        </button>
      </div>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes} <button onClick={increaseLikes}>like</button>
      </div>
      <div>{blog.author}</div>
      <button onClick={deleteBlog}>remove</button>
    </div>
  );
};

export default Blog;
