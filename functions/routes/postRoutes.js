const express = require('express');
const { multerMiddleware } = require('../config/cloudinary'); 
const { createPost, likePost, addComment, sharePost, getPost, getPostsByUserId, createStoryPost, getAllStoryPost } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
// Route to create a post
router.post('/posts',authMiddleware, multerMiddleware.single('media'), createPost);

// Route to create a post
router.post('/posts/story',authMiddleware, multerMiddleware.single('media'), createStoryPost);

// Route to like a post
router.post('/like/:postId', authMiddleware, likePost);

// Route to add a comment to a post
router.post('/comment/:postId', authMiddleware, addComment);

// Route to share a post
router.post('/share/:postId', authMiddleware, sharePost);


// Route to get a posts
router.get('/posts', authMiddleware, getPost);

// Route to get a posts
router.get('/posts/story', authMiddleware, getAllStoryPost);

// Route to get a posts
router.get('/posts/:userId', authMiddleware, getPostsByUserId);



module.exports = router;
