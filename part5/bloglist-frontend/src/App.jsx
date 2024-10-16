import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [blogs, setBlogs] = useState([]);
  const blogFormRef = useRef();

  const [messageStyle, setMessageStyle] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");

      setMessageStyle("success");
      setMessage(`successfully logged in`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (exception) {
      setMessageStyle("error");
      setMessage("Wrong username or password");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);

    setMessageStyle("success");
    setMessage(`successfully logged out`);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const createBlog = async (event) => {
    event.preventDefault();

    const newBlog = {
      title: title,
      author: author,
      url: url,
    };

    try {
      const createdBlog = await blogService.create(newBlog);

      setTitle("");
      setAuthor("");
      setUrl("");

      blogFormRef.current.toggleVisibility();

      setMessageStyle("success");
      setMessage(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`
      );
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (error) {
      console.log(error);

      setMessageStyle("error");
      setMessage(`error adding blog`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  if (!user)
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification message={message} messageStyle={messageStyle} />

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message} messageStyle={messageStyle} />

      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>

      <br />

      <Togglable buttonLabel={"new blog"} ref={blogFormRef}>
        <h2>create new</h2>
        <form onSubmit={createBlog}>
          <div>
            title:
            <input
              type="text"
              value={title}
              name="title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author:
            <input
              type="text"
              value={author}
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url:
            <input
              type="text"
              value={url}
              name="url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
      </Togglable>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
