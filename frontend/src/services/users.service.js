import axiosInstance from "./url.service";

// Get all posts
export const getAllUserAsFriends = async () => {
    try {
      const response = await axiosInstance.get('/users/friend-requests');
      return response?.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  };


  export const getAllFriendsSeggestion = async () => {
    try {
      const response = await axiosInstance.get('/users/users-to-request');
      return response?.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  };


  export const followUser = async (userId) => {
    try {
      const response = await axiosInstance.post('/users/follow', { userIdToFollow: userId });
      console.log(response.data)
      return response?.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  };
  
  export const unfollowUser = async (userId) => {
    try {
      const response = await axiosInstance.post('/users/unfollow',{ userIdToUnfollow: userId });
      return response?.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  };

  export const deleteUserfromRequest = async (userId) => {
    try {
      const response = await axiosInstance.post('/users/friend-to-remove',{ requestSenderId: userId });
      return response?.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  };



  export const fetchUserProfile = async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/profile/${userId}`);
      return response?.data?.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };



  export const fetchUserMutualFriends = async () => {
    try {
      const response = await axiosInstance.get('/users/mutual-friends');
      return response?.data?.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };


  export const updateUserProfile = async (userId,updateData) => {
    try {
      const response = await axiosInstance.put(`/users/profile/${userId}`,updateData);
      console.log(response)
      return response?.data?.data;
    } catch (error) {
      console.error('Error update user profile:', error);
      throw error;
    }
  };


  export const updateCoverPhoto = async (userId,updateData) => {
    try {
      const response = await axiosInstance.put(`/users/profile/cover-photo/${userId}`,updateData);
      return response?.data?.data;
    } catch (error) {
      console.error('Error update user profile:', error);
      throw error;
    }
  };


  export const createOrUpdateBio = async (userId,bioData) => {
    try {
      const response = await axiosInstance.put(`/users/bio/${userId}`,bioData);
      console.log(response)
      return response?.data?.data;
    } catch (error) {
      console.error('Error update user profile:', error);
      throw error;
    }
  };
