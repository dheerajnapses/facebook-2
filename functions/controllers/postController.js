const Post = require('../models/Post');
const { uploadFileToCloudinary,removeLocalFile} = require('../config/cloudinary');
const response = require('../utils/responseHandler'); 
const Story = require('../models/Story');



const createPost = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { content } = req.body;
        const file = req.file;
        let mediaUrl = null;
        let mediaType = null;

        if (file) {
            const uploadResult = await uploadFileToCloudinary(file);
            mediaUrl = uploadResult.secure_url;
            mediaType = file.mimetype.startsWith('video') ? 'video' : 'image';
        }

        // Create and save new post
        const newPost = new Post({
            userId,
            content,
            mediaUrl,
            mediaType,
            likeCount: 0,
            commentCount: 0,
        });

        await newPost.save();
        return response(res, 201, 'Post created successfully', newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        return response(res, 500, 'Server error', error.message);
    }
};

//create a story post 
const createStoryPost = async (req, res) => {
    try {
        const userId = req.user.userId;
        const file = req.file;
        
        if(!file){
            return response(res, 400, 'file is required for story');
        }
        let mediaUrl = null;
        let mediaType = null;


        if (file) {
            const uploadResult = await uploadFileToCloudinary(file);
            mediaUrl = uploadResult.secure_url;
            mediaType = file.mimetype.startsWith('video') ? 'video' : 'image';
        }

        // Create and save new post
        const newStoryPost = new Story({
            user:userId,
            mediaUrl,
            mediaType,
        });

        await newStoryPost.save();

        return response(res, 201, 'Story Post created successfully', newStoryPost);
    } catch (error) {
        console.error('Error creating post:', error);
        return response(res, 500, 'Server error', error.message);
    }
};

//get all posts
const getPost = async (req, res) => {
    try {
        const posts = await Post.find()
        .populate('userId', '_id username profilePicture email')
        .populate({
            path: 'comments.user', 
            select: 'username profilePicture' 
        });
        return response(res, 201, 'Post get successfully', posts);
    } catch (error) {
        console.error('Error getting  post:', error);
        return response(res, 500, 'Server error', error.message);
    }
};


//get all posts
const getAllStoryPost = async (req, res) => {
    try {
        const posts = await Story.find()
        .populate('user', '_id username profilePicture email')
        return response(res, 201, 'Story Post get successfully', posts);
    } catch (error) {
        console.error('Error getting  post:', error);
        return response(res, 500, 'Server error', error.message);
    }
};

//getostbyUserId

const getPostsByUserId = async (req, res) => {
    const { userId } = req.params; // Get userId from request parameters

    try {
        // Validate userId (optional but recommended)
        if (!userId) {
            return response(res, 400, 'User ID is required');
        }
        const posts = await Post.find({ userId })
        .populate('userId')
        .populate({
            path: 'comments.user', 
            select: 'username profilePicture' 
        });
        return response(res, 200, 'Posts fetched successfully', posts);
    } catch (error) {
        console.error('Error fetching posts by user ID:', error);
        return response(res, 500, 'Server error', error.message);
    }
};
// Other methods (likePost, addComment, sharePost) remain the same
const likePost = async (req, res) => {
    const { postId } = req.params; 
    const userId = req.user.userId;

    try {
        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return response(res, 404, 'Post not found.');
        }

        // Check if the user has already liked the post
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // Remove the like
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
            post.likeCount = Math.max(0, post.likeCount - 1); // Ensure likeCount does not go negative
        } else {
            // Add the like
            post.likes.push(userId);
            post.likeCount += 1;
        }

        // Save the updated post
        const updatedPost = await post.save();

        return response(res, 200, hasLiked ? 'Post unliked successfully' : 'Post liked successfully', updatedPost);
    } catch (error) {
        console.error('Error liking post:', error);
        return response(res, 500, 'Server error', error.message);
    }
};


const addComment = async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return response(res, 404, 'Post not found.');
        }

        post.comments.push({ user: userId, text });
        post.commentCount += 1;

        await post.save();

        return response(res, 201, 'Comment added successfully', post);
    } catch (error) {
        return response(res, 500, 'Server error', error.message);
    }
};

const sharePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.userId; // Assuming you're getting the user's ID from a logged-in session or token

    try {
        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return response(res, 404, 'Post not found.');
        }

        // Check if the user has already shared the post
        const hasUserShared = post.share.includes(userId);

        if (!hasUserShared) {
            // If the user hasn't shared, add the userId to the 'share' array
            post.share.push(userId);
        }

        // Increment the share count (this happens regardless of whether the user has already shared)
        post.shareCount += 1;

        // Save the post
        await post.save();

        return response(res, 200, 'Post shared successfully', post);
    } catch (error) {
        return response(res, 500, 'Server error', error.message);
    }
};





module.exports = { createPost,getPost, getPostsByUserId,likePost, sharePost, addComment,createStoryPost ,getAllStoryPost};
