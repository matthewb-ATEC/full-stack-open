const User = ({ user }) => {
  if (!user) return <div>User not found</div> // Handle user not being found
  if (!user.blogs) return <div>No blogs available</div> // Handle no blogs
  return (
    <div>
      <h1>{user.name}</h1>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
