const User = require('../models/User');
const Bio = require('../models/UserBio');
const response = require('../utils/responseHandler'); // Custom response handler utility

// Follow a user
const followUser = async (req, res) => {
    const { userIdToFollow } = req.body; // ID of the user to follow
    const userId = req.user.userId; // ID of the current user (from JWT or session)

    // Prevent the user from following themselves
    if (userId === userIdToFollow) {
        return response(res, 400, 'You cannot follow yourself.');
    }

    try {
        // Find the user to follow and the current user in the database
        const userToFollow = await User.findById(userIdToFollow);
        const currentUser = await User.findById(userId);

        // Check if both users exist
        if (!userToFollow || !currentUser) {
            return response(res, 404, 'User not found.');
        }

        // Check if the user is already being followed
        if (currentUser.following.includes(userIdToFollow)) {
            return response(res, 400, 'You are already following this user.');
        }

        // Add the user to the current user's following list
        currentUser.following.push(userIdToFollow);

        // Add the current user to the user to follow's followers list
        userToFollow.followers.push(userId);

        // Update following and follower counts
        currentUser.followingCount += 1;
        userToFollow.followerCount += 1;

        // Save the updated current user and user to follow
        await currentUser.save();
        await userToFollow.save();

  
        return response(res, 200, 'User followed successfully.');
    } catch (error) {
        return response(res, 500, 'Server error.', error.message);
    }
};


// Unfollow a user
const unfollowUser = async (req, res) => {
    const { userIdToUnfollow } = req.body;
    const userId = req.user.userId;

    // Prevent the user from unfollowing themselves
    if (userId === userIdToUnfollow) {
        return response(res, 400, 'You cannot unfollow yourself.');
    }

    try {
        // Find both the current user and the user to unfollow
        const userToUnfollow = await User.findById(userIdToUnfollow);
        const currentUser = await User.findById(userId);

        // Check if both users exist
        if (!userToUnfollow || !currentUser) {
            return response(res, 404, 'User not found.');
        }

        // Ensure the current user is actually following the user to unfollow
        if (!currentUser.following.includes(userIdToUnfollow)) {
            return response(res, 400, 'You are not following this user.');
        }

        // Remove the user from the following list and update follower count
        currentUser.following = currentUser.following.filter(id => id.toString() !== userIdToUnfollow);
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== userId);

        currentUser.followingCount -= 1;
        userToUnfollow.followerCount -= 1;

        // Save the updates for both users
        await currentUser.save();
        await userToUnfollow.save();

        return response(res, 200, 'User unfollowed successfully.');
    } catch (error) {
        return response(res, 500, 'Server error.', error.message);
    }
};


const deleteUserFromRequest = async (req, res) => {
    try {
        const loggedInUserId = req.user.userId; 
        const {requestSenderId} =  req.body;; 

        // Find the logged-in user and the user who sent the request
        const loggedInUser = await User.findById(loggedInUserId);
        const requestSender = await User.findById(requestSenderId);

        if (!loggedInUser) {
            return response(res, 404, 'Logged-in user not found');
        }
        if (!requestSender) {
            return response(res, 404, 'User who sent the request not found');
        }

        // Check if the request sender is following the logged-in user (i.e., they sent a friend request)
        const isRequestSent = requestSender.following.includes(loggedInUserId);

        if (!isRequestSent) {
            return response(res, 400, 'No friend request from this user');
        }

        // Remove the logged-in user's ID from the request sender's following list
        requestSender.following = requestSender.following.filter(user => user.toString() !== loggedInUserId);

        // Remove the request sender's ID from the logged-in user's followers list
        loggedInUser.followers = loggedInUser.followers.filter(user => user.toString() !== requestSenderId);

        // Update follower and following counts
        loggedInUser.followerCount = loggedInUser.followers.length;
        requestSender.followingCount = requestSender.following.length;

        // Save both users
        await loggedInUser.save();
        await requestSender.save();

        // Return a successful response
        return response(res, 200, `Friend request from ${requestSender.username} deleted successfully`);
    } catch (error) {
        console.error('Error deleting friend request:', error);
        return response(res, 500, 'Server error', error.message);
    }
};



// Check if the user is authenticated and return user details
const checkUserAuth = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Ensure the user is authenticated
        if (!userId) {
            return response(res, 401, 'Unauthorized, please log in.');
        }

        // Fetch the user details and exclude sensitive data like the password
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return response(res, 404, 'User not found.');
        }

        return response(res, 200, 'User retrieved successfully', user);
    } catch (error) {
        return response(res, 500, 'Server error.', error.message);
    }
};

// Get all users who have sent friend requests (followers not yet followed back)
const getAllFriendRequests = async (req, res) => {
    try {
        const loggedInUserId = req.user.userId;

        // Find the logged-in user and retrieve their followers and following
        const loggedInUser = await User.findById(loggedInUserId).select('followers following');

        if (!loggedInUser) {
            return response(res, 404, 'Logged-in user not found.');
        }

        // Find users who follow the logged-in user but are not followed back
        const usersToFollowBack = await User.find({
            _id: { 
                $in: loggedInUser.followers, // Users who follow the logged-in user
                $nin: loggedInUser.following // Exclude users the logged-in user already follows
            }
        }).select('username profilePicture email followerCount');

        return response(res, 200, 'Users to follow back fetched successfully', usersToFollowBack);
    } catch (error) {
        return response(res, 500, 'Server error.', error.message);
    }
};

// Get all users available for friend requests
const getAllUsersForRequest = async (req, res) => {
    try {
        const loggedInUserId = req.user.userId;

        // Find the logged-in user and retrieve their following list and followers
        const loggedInUser = await User.findById(loggedInUserId).select('following followers');

        if (!loggedInUser) {
            return response(res, 404, 'Logged-in user not found.');
        }

        // Find users who are neither following nor followers of the logged-in user
        const usersForFriendRequest = await User.find({
            _id: {
                $ne: loggedInUserId,
                $nin: [...loggedInUser.following, ...loggedInUser.followers], // Exclude both following and followers
            }
        }).select('username profilePicture email followerCount');

        return response(res, 200, 'Users for friend request fetched successfully', usersForFriendRequest);
    } catch (error) {
        return response(res, 500, 'Server error.', error.message);
    }
};

// Get all mutual friends (users the logged-in user is following and who are also following the logged-in user)
const getAllMutualFriends = async (req, res) => {
    try {
        const loggedInUserId = req.user.userId;

        // Find the logged-in user
        const loggedInUser = await User.findById(loggedInUserId)
            .select('following followers')
            .populate('following', 'username profilePicture email followerCount followingCount')
            .populate('followers', 'username profilePicture email followerCount followingCount'); 

        if (!loggedInUser) {
            return response(res, 404, 'Logged-in user not found.');
        }

        // Create a Set of user IDs that the logged-in user is following
        const followingUserIds = new Set(loggedInUser.following.map(user => user._id.toString()));

        // Filter the followers to get only those who are also being followed by the logged-in user
        const mutualFriends = loggedInUser.followers.filter(follower =>
            followingUserIds.has(follower._id.toString())
        );

        return response(res, 200, 'Mutual friends fetched successfully', mutualFriends);
    } catch (error) {
        return response(res, 500, 'Server error.', error.message);
    }
};


// Get all users (for admin purposes or general browsing)
const getAllUsers = async (req, res) => {
    try {
        // Fetch all users and their necessary details
        const users = await User.find().select('username profilePicture email followerCount');

        return response(res, 200, 'Users fetched successfully', users);
    } catch (error) {
        return response(res, 500, 'Server error.', error.message);
    }
};

const createOrUpdateBio = async (req, res) => {
    const { userId } = req.params;
    const { bioText, liveIn, relationship, workplace, education, phone, hometown } = req.body;
  
    try {
      // Try to update the bio if it exists
      let bio = await Bio.findOneAndUpdate(
        { user: userId },
        {
          bioText,
          liveIn,
          relationship,
          workplace,
          education,
          phone,
          hometown
        },
        { new: true, runValidators: true }
      );
  
      // If bio doesn't exist, create a new one
      if (!bio) {
        bio = new Bio({
          user: userId,
          bioText,
          liveIn,
          relationship,
          workplace,
          education,
          phone,
          hometown
        });
  
        await bio.save();
        
        // Optionally, update the User model with the bio reference
        await User.findByIdAndUpdate(userId, { bio: bio._id });
      }
  
      return response(res, 200, 'Bio saved successfully', bio);
    } catch (error) {
      console.error('Error saving bio:', error);
      return response(res, 500, 'Internal Server Error', error.message);
    }
  };
  
// Get user profile data
const getUserProfile = async (req, res) => {
    try {
      const { userId } = req.params; // Profile's user ID from URL params
      const loggedInUserId = req.user.userId; // Logged-in user ID from token/session
  
      // Find the user by userId
      const userProfile = await User.findById(userId).populate('bio').exec();
  
      if (!userProfile) {
        return response(res, 404, 'Logged-in user not found.');
      }
  
      // Check if the logged-in user is the profile owner
      const isOwner = loggedInUserId === userId;

      return response(res,201,'Profile fetched successfully',{
        profile: userProfile,
        isOwner,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };



  

// Exporting all user-related controller functions
module.exports = { 
    followUser, 
    unfollowUser,
    checkUserAuth,
    getAllFriendRequests,
    getAllUsersForRequest,
    deleteUserFromRequest,
    getAllMutualFriends,
    getAllUsers,
    getUserProfile,
    createOrUpdateBio
};

