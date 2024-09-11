import create from 'zustand';
import { createPost, getPosts, likePost, addComment, createStoryPost, getAllStoryPosts, getPostByUserId, sharePost } from '@/services/post.service';
import { toast } from 'react-hot-toast';

export const usePostStore = create((set) => ({
  posts: [],
  userPosts: [],
  storyPosts:[],
  loading: false,
  error: null,

  // Fetch posts
  fetchPosts: async () => {
    set({ loading: true });
    try {
      const posts = await getPosts();
      set({ posts, loading: false });
    } catch (error) {
      set({ error, loading: false });
      toast.error('Failed to load posts');
    }
  },
    // Fetch posts
    fetchUserPost: async (userId) => {
      set({ loading: true });
      try {
        const userPosts = await getPostByUserId(userId);
        set({ userPosts, loading: false });
      } catch (error) {
        set({ error, loading: false });
        toast.error('Failed to load posts');
      }
    },

    // Fetch story posts
    fetchStoryPosts: async () => {
      set({ loading: true });
      try {
        const storyPosts = await getAllStoryPosts();
        set({ storyPosts, loading: false });
      } catch (error) {
        set({ error, loading: false });
        toast.error('Failed to load posts');
      }
    },

   //post cration
  handleCreatePost: async (postData) => {
    set({ loading: true });
    try {
      const newPost = await createPost(postData);
      set((state) => ({
        posts: [newPost, ...state.posts],
        loading: false,
      }));
      toast.success('Post created successfully');
    } catch (error) {
      set({ error, loading: false });
      toast.error('Failed to create post');
    }
  },

  //story post 
  handleCreateStoryPost: async (postData) => {
    set({ loading: true });
    try {
      const newStoryPost = await createStoryPost(postData);
      set((state) => ({
        storyPosts: [newStoryPost, ...state.storyPosts],
        loading: false,
      }));
      toast.success('Story Created successfully');
    } catch (error) {
      set({ error, loading: false });
      toast.error('Failed to create story');
    }
  },

  // Like a post
  handleLikePost: async (postId) => {
    try {
      await likePost(postId);
      toast.success('Post liked');
    } catch (error) {
      set({ error });
      toast.error('Failed to like post');
    }
  },

   // Like a post
   handleSharePost: async (postId) => {
    try {
      await sharePost(postId);
      toast.success('post shared successfully');
    } catch (error) {
      set({ error });
      toast.error('Failed to share post');
    }
  },

  // Add a comment to a post
// usePostStore.js
handleAddComment: async (postId, text) => {
    try {
      const newComment = await addComment(postId, { text });
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        ),
      }));
      toast.success('Comment added successfully');
    } catch (error) {
      set({ error });
      toast.error('Failed to add comment');
    }
  },
  

}));
