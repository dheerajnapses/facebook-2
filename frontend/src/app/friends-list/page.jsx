'use client';
import { useEffect } from 'react';
import FriendRequest from './FriendRequest';
import Sidebar from '../components/Sidebar';
import FriendsSuggestion from './FriendsSuggestion';
import useFriendsStore from '@/Store/userFriendsStore';
import { FriendCardSkeleton, NoFriendsMessage } from "@/lib/Skeleton";
import { deleteUserfromRequest } from '@/services/users.service';

const Page = () => {
  const {
    friendRequests,
    friendSuggestions,
    isLoading,
    fetchFriendRequests,
    fetchFriendSuggestions,
    follow,
  } = useFriendsStore();

  useEffect(() => {
    fetchFriendRequests();
    fetchFriendSuggestions();
  }, []);

  const handleAction = async (action, userId) => {
    if (action === 'confirm') {
      await follow(userId);
      await fetchFriendRequests();
      await fetchFriendSuggestions();
    } else if (action === 'delete') {
      await deleteUserfromRequest(userId);
      await fetchFriendRequests();
      await fetchFriendSuggestions();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="ml-0 md:ml-64 mt-16 p-6">
        <h1 className="text-2xl font-bold mb-6">Friend Requests</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Conditional rendering for friend requests */}
          {isLoading ? (
            <FriendCardSkeleton />
          ) : friendRequests.length === 0 ? (
            <NoFriendsMessage />
          ) : (
            friendRequests?.map((friend) => (
              <FriendRequest
                key={friend?._id}
                friendRequests={friend}
                isLoading={isLoading}
                onAction={handleAction}
              />
            ))
          )}
        </div>

        <h1 className="text-2xl font-bold mt-6 mb-6">People You May Know</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Conditional rendering for friend suggestions */}
          {isLoading ? (
            <FriendCardSkeleton />
          ) : friendSuggestions.length === 0 ? (
            <NoFriendsMessage />
          ) : (
            friendSuggestions?.map((friend) => (
              <FriendsSuggestion
                key={friend?._id}
                friendSuggestions={friend}
                isLoading={isLoading}
                onAction={handleAction}
                
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;
