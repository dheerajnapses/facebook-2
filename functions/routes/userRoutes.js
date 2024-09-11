const express = require('express');
const { followUser, unfollowUser, checkUserAuth, getAllFriendRequests, getAllUsersForRequest, getAllMutualFriends, getAllUsers, deleteUserFromRequest, getUserProfile, createOrUpdateBio,  } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); 
const { multerMiddleware } = require('../config/cloudinary'); 
const { updateProfile, updateCoverPhoto } = require('../controllers/updateUserController');

const router = express.Router();

// Route to follow a user
router.post('/follow', authMiddleware, followUser);

// Route to unfollow a user
router.post('/unfollow', authMiddleware, unfollowUser);

// Route for remove  users (excluding me and my friends) to send a request
router.post('/friend-to-remove', authMiddleware, deleteUserFromRequest);


//get all users 
router.get('/', authMiddleware,getAllUsers)

//get all user profile
router.get('/profile/:userId', authMiddleware,getUserProfile)

//check auth middleware
router.get('/check-auth', authMiddleware,checkUserAuth)

// Route for fetching users who follow me (friend requests to follow back)
router.get('/friend-requests', authMiddleware, getAllFriendRequests);

// Route for fetching all users (excluding me and my friends) to send a request
router.get('/users-to-request', authMiddleware, getAllUsersForRequest);

// Route for fetching all friends of the logged-in user (users I follow)
router.get('/mutual-friends', authMiddleware, getAllMutualFriends);


// Route for updating user profile (with profile picture)
router.put('/profile/:userId', authMiddleware, multerMiddleware.single('profilePicture'), updateProfile);

// Route for updating user cover photo
router.put('/profile/cover-photo/:userId', authMiddleware, multerMiddleware.single('coverPhoto'), updateCoverPhoto);


//route for Create or Update User Bio
router.put('/bio/:userId',authMiddleware,createOrUpdateBio)


module.exports = router;
