// controlers/blogs.js:
const blogsRouter = require('express').Router() // Creates a new Express router instance for blog routes
const Blog = require('../models/blog') // Imports the Blog Mongoose Model from models/blog.js for database operations
const middleware = require('../utils/middleware') // Import middleware for userExtractor

// Route to fetch all blogs. Uses async/await and passes errors to middleware via next().
blogsRouter.get('/', async (request, response, next) => {
  try {
    // Find all blogs from the database
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
      id: 1,
    })
    // Send the fetched blogs back to the client. The response is returned as the blogs in a JSON format
    response.json(blogs)
  } catch (exception) {
    // If an error occurs during the database query, pass it to the error handling middleware
    next(exception)
  }
})

// Route to handle creation of a new blog. Uses async/await and passes errors to middleware via next().
blogsRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response, next) => {
    const body = request.body // Extract the data sent in the request body.

    const user = request.user // Get the user directly from the request object (populated by userExtractor)
    // Check if user is available. userExtractor will handle the non-existent user case amd token-related 401 errors.
    if (!user) {
      // This is a safety check: userExtractor handles token checking.
      return response
        .status(401)
        .json({ error: 'Operation requires a valid user token' })
    }
    // Create a new Mongoose document instance based on the request body data.
    const blog = new Blog({
      title: body.title,
      user: user._id, // user: body.user,  // user attribute now replaces author. Use user._id to identify from collection of users.
      url: body.url,
      likes: body.likes || 0, // Ensure likes defaults to 0 if not provided in the request
    })

    try {
      // The blogSchema defines 'title' and 'url' as required. Mongoose validation throws an error if they are missing.
      const savedBlog = await blog.save() // Saves the new blog document to the MongoDB database.
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      // Populate the user data before sending the response
      const populatedBlog = await savedBlog.populate('user', {
        username: 1,
        name: 1,
        id: 1,
      })
      // Send a 201 Created status code and the saved document back.
      response.status(201).json(populatedBlog)
    } catch (exception) {
      // Errors from validation (like missing title/url) or database connection are passed to error handling middleware.
      next(exception)
    }
  }
)

// Route to handle deletion of a blog.
blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    // Get the user directly from the request object (populated by userExtractor)
    const user = request.user
    const userId = user._id // The ID of the user requesting deletion

    try {
      const blogToDelete = await Blog.findById(request.params.id)

      if (!blogToDelete) {
        return response.status(204).json({ error: 'blog not found' })
      }

      // Check Ownership: compare the blog's creator ID with the ID of the requesting user.
      if (blogToDelete.user.toString() !== userId.toString()) {
        // if not ownership
        return response
          .status(401)
          .json({ error: 'only the creator can delete this blog' })
      }
      // Update User's Blog List
      user.blogs = user.blogs.filter(
        (blogId) => blogId.toString() !== blogToDelete._id.toString()
      )
      await user.save()
      // Delete the blog
      await Blog.findByIdAndDelete(request.params.id)

      response.status(204).end()
    } catch (exception) {
      next(exception)
    }
  }
)

// Route to increment likes.
blogsRouter.put('/:id/like', async (request, response, next) => {
  const blogId = request.params.id

  try {
    // $inc operator atomically increments the field
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $inc: { likes: 1 } },
      { new: true } // Return the updated document
    ).populate('user', { username: 1, name: 1, id: 1 }) // Repopulate user for consistency

    if (updatedBlog) {
      response.status(200).json(updatedBlog)
    } else {
      response.status(404).json({ error: 'Blog not found' })
    }
  } catch (exception) {
    // Pass errors (e.g., CastError from bad ID) to middleware
    next(exception)
  }
})

// Route to handle updating an existing blog.
blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body // The new data for the blog, from the request body.
  const blogId = request.params.id // The ID of the blog to be updated.
  // Create the blog object containing the new data. The request body contains the fields to be updated.
  const blog = {
    title: body.title,
    user: body.user, // user attribute now replaces author
    url: body.url,
    likes: body.likes,
  }
  try {
    // Find the blog by ID and update it with the new content.
    // { new: true } tells Mongoose to return the *new* updated document, not the original one.
    // { runValidators: true } ensures Mongoose runs the schema validation (e.g., required fields)
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, blog, {
      new: true,
      runValidators: true,
    })

    if (updatedBlog) {
      // Respond with 200 OK and the updated blog object
      response.json(updatedBlog)
    } else {
      // If findByIdAndUpdate returns null, the blog was not found. Sends 404 Not Found.
      response.status(404).end()
    }
  } catch (exception) {
    // Pass errors (e.g., CastError from bad ID, or Validation error from runValidators: true) to middleware
    next(exception)
  }
})

// Route to handle adding an anonymous comment. Endpoint: POST /api/blogs/:id/comments. Middleware.userExtractor omited to allow anonymous posting.
blogsRouter.post('/:id/comments', async (request, response, next) => {
  const { comment } = request.body // Extract the string from { "comment": "text" }
  const blogId = request.params.id

  // Validation: Ensure there is a comment, not just whitespace.
  if (!comment || comment.trim() === '') {
    return response.status(400).json({ error: 'comment content is required' })
  }

  try {
    // Use $push to add the comment string to the 'comments' array in MongoDB. { new: true } returns the document AFTER the update.
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $push: { comments: comment } },
      { new: true, runValidators: true }
    ).populate('user', { username: 1, name: 1, id: 1 }) // Repopulate user so frontend UI doesn't break

    if (updatedBlog) {
      response.status(201).json(updatedBlog)
    } else {
      response.status(404).json({ error: 'blog not found' })
    }
  } catch (exception) {
    next(exception)
  }
})

// Export the router module for use in app.js
module.exports = blogsRouter
