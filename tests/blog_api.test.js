const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const user = new User({
        username: 'testuser',
        passwordHash: await bcrypt.hash('testpassword', 10),
        name: 'Test User',
    })

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        blogObject.user = user._id
        await blogObject.save()
    }

    await user.save();

    const payload = {
        username: user.username,
        id: user._id,
    }

    token = jwt.sign(payload, process.env.SECRET);
})


test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

afterAll(async () => {
    await mongoose.connection.close()
})

test('all blogs are returned', async () => {
    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)

    const contents = response.body.map(r => r.title)
    expect(contents).toContain(
        'Test Blog 2'
    )
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Test Blog 3',
        author: 'Test Author 3',
        url: 'http://www.testurl3.com',
        likes: 3
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(n => n.title)
    expect(contents).toContain(
        'Test Blog 3'
    )
})

test('blog without author is not added', async () => {
    const newBlog = {
        author: 'Test Author 4',
        likes: 4
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(resultBlog.body).toEqual({
        title: blogToView.title,
        author: blogToView.author,
        url: blogToView.url,
        likes: blogToView.likes,
        id: blogToView.id,
        user: blogToView.user.toString(), // Convert user object ID to string
    })
})

test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
    )

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).not.toContain(blogToDelete.title)
})

test('blog posts have "id" property instead of "_id"', async () => {
    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)

    expect(response.body[0].id).toBeDefined()
    expect(response.body[1].id).toBeDefined()
})

test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
        title: 'New Blog',
        author: 'John Smith',
        url: 'https://example.com/new-blog',
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)

    expect(response.body.likes).toBe(0)
})

test('update a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const newBlog = {
        title: 'Updated Blog',
        author: 'John Smith',
        url: 'https://example.com/updated-blog',
        likes: 10
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).toContain(newBlog.title)
})

test('adding a new blog fails with status code 401 Unauthorized if token is not provided', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 5,
  };

  await api.post('/api/blogs').send(newBlog).expect(401)
})

describe('User API', () => {
    test('creating a new user with missing username or password returns 400 status code', async () => {
        const newUser1 = {
            username: 'john',
            password: '',
            name: 'John Doe',
        }

        const response1 = await api
            .post('/api/users')
            .send(newUser1)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)

        const newUser2 = {
            username: '',
            password: 'password',
            name: 'John Doe',
        }

        const response2 = await api
            .post('/api/users')
            .send(newUser2)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
    })

    test('creating a new user with too short username or password returns 400 status code', async () => {
        const newUser1 = {
            username: 'jo',
            password: 'password',
            name: 'John Doe',
        }

        const response1 = await api
            .post('/api/users')
            .send(newUser1)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)

        const newUser2 = {
            username: 'john',
            password: 'pw',
            name: 'John Doe',
        }

        const response2 = await api
            .post('/api/users')
            .send(newUser2)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
    })

    test('creating a new user with a non-unique username returns 400 status code', async () => {
        const existingUser = new User({
            username: 'john',
            passwordHash: 'hashedpassword',
            name: 'John Doe',
        })

        await existingUser.save()

        const newUser = {
            username: 'john',
            password: 'password',
            name: 'John Smith',
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
    })
})