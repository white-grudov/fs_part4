const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'Test Blog 1',
        author: 'Test Author 1',
        url: 'http://www.testurl1.com',
        likes: 1
    },
    {
        title: 'Test Blog 2',
        author: 'Test Author 2',
        url: 'http://www.testurl2.com',
        likes: 2
    }
]

const nonExistingId = async () => {
  const blog = new Blog({ 
    title: '...',
    author: '...'
   })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}