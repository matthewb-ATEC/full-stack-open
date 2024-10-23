import { ListItemText } from '@mui/material'

const Blog = ({ blog }) => {
  return <ListItemText primary={blog.title} secondary={blog.author} />
}

export default Blog
