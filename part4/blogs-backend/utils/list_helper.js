const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let sum = 0;

  blogs.forEach((blog) => {
    sum += blog.likes;
  });

  return sum;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {};

  if (blogs.length === 1)
    return {
      title: blogs[0].title,
      author: blogs[0].author,
      likes: blogs[0].likes,
    };

  let favoriteBlog = blogs[0];

  blogs.forEach((blog) => {
    if (blog.likes > favoriteBlog.likes) favoriteBlog = blog;
  });

  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
