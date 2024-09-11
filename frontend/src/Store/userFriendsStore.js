import { create } from 'zustand'
import { getAllFriendsSeggestion, getAllUserAsFriends, followUser, unfollowUser, fetchUserMutualFriends, deleteUserfromRequest } from '@/services/users.service'
import toast from 'react-hot-toast';

const useFriendsStore = create((set, get) => ({
  friendRequests: [],
  friendSuggestions: [],
  mutualFriends:[],
  isLoading: false,

  fetchFriendRequests: async () => {
    set({ isLoading: true });
    try {
      const response = await getAllUserAsFriends();
      set({ friendRequests: response.data });
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFriendSuggestions: async () => {
    set({ isLoading: true });
    try {
      const response = await getAllFriendsSeggestion();
      set({ friendSuggestions: response.data });
    } catch (error) {
      console.error("Error fetching friend suggestions:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  follow: async (userId) => {
    try {
      await followUser(userId);
      toast.success('you have followed successfully')
    } catch (error) {
      console.error("Error following user:", error);
    }
  },


  deleteUserRequest: async (userId) => {
    try {
      await deleteUserfromRequest(userId);
      toast.success('delete friend successfully')
    } catch (error) {
      console.error("Error dekete request user:", error);
    }
  },


// Fetch mutual friends
fetchMutualFriends: async () => {
  set({ loading: true });
  try {
    const mutualFriends = await fetchUserMutualFriends();
    set({ mutualFriends, loading: false });
  } catch (error) {
    set({ error, loading: false });
    toast.error('Failed to load mutual friends');
  }
},

unfollow: async (userId) => {
  try {
    await unfollowUser(userId);
    toast.success('unfollow friend successfully')
  } catch (error) {
    console.error("Error unfollowing user:", error);
  }
},


}));

export default useFriendsStore;