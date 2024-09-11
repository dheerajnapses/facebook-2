import axiosInstance from './url.service';

// Create a new post
export const createPost = async (postData) => {
  try {
    const response = await axiosInstance.post('/users/posts', postData);
    return response?.data?.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const createStoryPost = async (postData) => {
  try {
    const response = await axiosInstance.post('/users/posts/story', postData);
    console.log(response)
    return response?.data?.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};


// Get all posts
export const getPosts = async () => {
  try {
    const response = await axiosInstance.get('/users/posts');
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/users');
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Get all posts
export const getAllStoryPosts = async () => {
  try {
    const response = await axiosInstance.get('/users/posts/story');
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Like a post
export const likePost = async (postId) => {
  try {
    const response = await axiosInstance.post(`/users/like/${postId}`);
    return response?.data?.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};


export const sharePost = async (postId) => {
  try {
    const response = await axiosInstance.post(`/users/share/${postId}`);
    return response?.data?.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

// Add a comment to a post
export const addComment = async (postId, comment) => {
  try {
    const response = await axiosInstance.post(`/users/comment/${postId}`, comment);
    return response?.data?.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};


// Get post by userId
export const getPostByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/posts/${userId}`);
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};


