const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const body = request.body
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: 'User unauthorized' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: 'User unauthorized' });
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'Only the creator can delete the blog' });
  }

  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter