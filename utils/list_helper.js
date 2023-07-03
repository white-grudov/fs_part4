const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (max, item) => {
        return max.likes > item.likes
            ? max
            : item
    }
    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}

const mostBlogs = (blogs) => {
    const blogCounts = {}
  
    for (const blog of blogs) {
      if (blog.author in blogCounts) {
        blogCounts[blog.author]++
      } else {
        blogCounts[blog.author] = 1
      }
    }
  
    const [author, blogsCount] = Object.entries(blogCounts).reduce(
      (max, curr) => (curr[1] > max[1] ? curr : max),
      ['', 0]
    )
  
    return { author, blogs: blogsCount }
  } 

  const mostLikes = (blogs) => {
    const authorLikes = {}
  
    for (const blog of blogs) {
      if (blog.author in authorLikes) {
        authorLikes[blog.author] += blog.likes
      } else {
        authorLikes[blog.author] = blog.likes
      }
    }
  
    const [author, likes] = Object.entries(authorLikes).reduce(
      (max, curr) => (curr[1] > max[1] ? curr : max),
      ['', 0]
    )
  
    return { author, likes }
  }

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}