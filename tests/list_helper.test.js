const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]

    const biggerList = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f9',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copy',
            likes: 6,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f0',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson',
            likes: 7,
            __v: 0
        }
    ]

    test('of empty list is zero', () => {
        const emptyList = []
        const result = listHelper.totalLikes(emptyList)
        expect(result).toBe(0)
    })
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      expect(result).toBe(5)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(biggerList)
        expect(result).toBe(18)
    })
  })

  describe('favoriteBlog', () => {
    test('returns the blog with the most likes', () => {
      const blogs = [
        {
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          likes: 12,
        },
        {
          title: 'First class tests',
          author: 'Robert C. Martin',
          likes: 10,
        },
        {
          title: 'Writing reliable tests',
          author: 'Kent C. Dodds',
          likes: 6,
        },
      ]
  
      const result = listHelper.favoriteBlog(blogs)
  
      expect(result).toEqual({
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12,
      })
    })
  
    test('returns one of the top favorites when multiple blogs have the same most likes', () => {
      const blogs = [
        {
          title: 'First class tests',
          author: 'Robert C. Martin',
          likes: 15,
        },
        {
          title: 'Clean code',
          author: 'Robert C. Martin',
          likes: 12,
        },
        {
          title: 'Writing reliable tests',
          author: 'Kent C. Dodds',
          likes: 15,
        },
      ]
  
      const result = listHelper.favoriteBlog(blogs)
  
      expect(result).toEqual(
        expect.objectContaining({ likes: 15 })
      )
    })
  })

  describe('mostBlogs', () => {
    test('returns the author with the largest amount of blogs', () => {
      const blogs = [
        {
          title: 'Clean Code',
          author: 'Robert C. Martin',
          likes: 10,
        },
        {
          title: 'Test-Driven Development',
          author: 'Kent Beck',
          likes: 15,
        },
        {
          title: 'Clean Architecture',
          author: 'Robert C. Martin',
          likes: 8,
        },
        {
          title: 'Refactoring',
          author: 'Martin Fowler',
          likes: 12,
        },
        {
          title: 'Domain-Driven Design',
          author: 'Eric Evans',
          likes: 5,
        },
        {
          title: 'The Pragmatic Programmer',
          author: 'Andy Hunt',
          likes: 7,
        },
        {
          title: 'Clean Code',
          author: 'Robert C. Martin',
          likes: 6,
        },
      ]
  
      const result = listHelper.mostBlogs(blogs)
  
      expect(result).toEqual({
        author: 'Robert C. Martin',
        blogs: 3,
      })
    })
  
    test('returns any one of the top bloggers when multiple authors have the largest amount of blogs', () => {
      const blogs = [
        {
          title: 'Clean Code',
          author: 'Robert C. Martin',
          likes: 10,
        },
        {
          title: 'Test-Driven Development',
          author: 'Kent Beck',
          likes: 15,
        },
        {
          title: 'Clean Architecture',
          author: 'Robert C. Martin',
          likes: 8,
        },
        {
          title: 'Refactoring',
          author: 'Martin Fowler',
          likes: 12,
        },
        {
          title: 'The Pragmatic Programmer',
          author: 'Andy Hunt',
          likes: 7,
        },
        {
          title: 'Clean Code',
          author: 'Kent Beck',
          likes: 6,
        },
        {
          title: 'Refactoring',
          author: 'Robert C. Martin',
          likes: 9,
        },
      ]
  
      const result = listHelper.mostBlogs(blogs)
  
      expect(result.author).toBeTruthy()
      expect(result.blogs).toBeGreaterThanOrEqual(2)
    })
  })

  describe('mostLikes', () => {
    test('returns the author with the largest amount of likes', () => {
      const blogs = [
        {
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          likes: 12,
        },
        {
          title: 'First class tests',
          author: 'Robert C. Martin',
          likes: 10,
        },
        {
          title: 'Writing reliable tests',
          author: 'Kent C. Dodds',
          likes: 6,
        },
        {
          title: 'Clean Code',
          author: 'Robert C. Martin',
          likes: 8,
        },
        {
          title: 'Refactoring',
          author: 'Martin Fowler',
          likes: 5,
        },
      ]
  
      const result = listHelper.mostLikes(blogs)
  
      expect(result).toEqual({
        author: 'Robert C. Martin',
        likes: 18,
      })
    })
  
    test('returns any one of the top bloggers when multiple authors have the largest amount of likes', () => {
      const blogs = [
        {
          title: 'Clean Code',
          author: 'Robert C. Martin',
          likes: 10,
        },
        {
          title: 'Test-Driven Development',
          author: 'Kent Beck',
          likes: 15,
        },
        {
          title: 'Clean Architecture',
          author: 'Robert C. Martin',
          likes: 8,
        },
        {
          title: 'Refactoring',
          author: 'Martin Fowler',
          likes: 12,
        },
        {
          title: 'The Pragmatic Programmer',
          author: 'Andy Hunt',
          likes: 7,
        },
        {
          title: 'Clean Code',
          author: 'Kent Beck',
          likes: 12,
        },
        {
          title: 'Refactoring',
          author: 'Robert C. Martin',
          likes: 9,
        },
      ]
  
      const result = listHelper.mostLikes(blogs)
  
      expect(result.author).toBeTruthy()
      expect(result.likes).toBe(27)
    })
  })