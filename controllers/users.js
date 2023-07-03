const blogsRouter = require('express').Router()
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
    response.json(users.map(user => user.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body;

    if (!password || password.length < 3) {
        return response.status(400).json({
            error: 'password must be at least 3 characters long'
        })
    }

    const passwordHash = await User.generatePasswordHash(password);

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = blogsRouter