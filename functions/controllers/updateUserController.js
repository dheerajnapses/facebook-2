const User = require('../models/User');
const response = require('../utils/responseHandler'); 
const { uploadFileToCloudinary} = require('../config/cloudinary');


const updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId; 
        console.log(userId);
        const { username, gender, dateOfBirth } = req.body;
        const file = req.file; // Assume `req.file` contains the uploaded profile picture
        let profilePicture = null;

        // Handle profile picture upload if a file is provided
        if (file) {
            const uploadResult = await uploadFileToCloudinary(file); // Assume you have a function to handle Cloudinary upload
            profilePicture = uploadResult.secure_url;
        }

        // Update user's profile
        const update = await User.updateOne(
            { _id: userId },
            {
                $set: {
                    username,
                    gender,
                    dateOfBirth,
                    ...(profilePicture && { profilePicture }), // Only update if a new profile picture is uploaded
                },
            },
        );

          // Fetch the updated user
          const updatedUser = await User.findById(userId);

        // Check if the user is found
        if (!updatedUser) {
            return response(res, 404, 'User not found');
        }

        return response(res, 200, 'Profile updated successfully', updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        return response(res, 500, 'Server error', error.message);
    }
};


const updateCoverPhoto = async (req, res) => {
    try {
        const userId = req.params.userId; 
        const file = req.file; // Assume `req.file` contains the uploaded cover photo
        let coverPhoto = null;

        // Handle cover photo upload if a file is provided
        if (file) {
            const uploadResult = await uploadFileToCloudinary(file); // Cloudinary upload logic
            coverPhoto = uploadResult.secure_url;
        }

        if (!coverPhoto) {
            return response(res, 400, 'No cover photo provided.');
        }

        // Update user's cover photo
        const updatedUser = await User.updateOne(
            { _id: userId },
            {
                $set: {
                    coverPhoto,
                },
            },
        );
        return response(res, 200, 'Cover photo updated successfully', updatedUser);
    } catch (error) {
        console.error('Error updating cover photo:', error);
        return response(res, 500, 'Server error', error.message);
    }
};


module.exports = { updateCoverPhoto,updateProfile};
