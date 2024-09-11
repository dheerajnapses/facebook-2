'use client'
import React, { useEffect, useState } from 'react'
import VideoCard from './VideoCard'
import { Button } from "@/components/ui/button"
import {  ChevronLeft } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { usePostStore } from '@/Store/usePostStore'

const page = () => {
  const [likedPosts, setLikedPosts] = useState(new Set()); 


  const { posts, fetchPosts, handleLikePost, handleAddComment } = usePostStore();
  useEffect(() => {
    fetchPosts(); 
  }, [fetchPosts]);


  const handleLike = async (postId) => {
    // Toggle like state locally
    const updatedLikedPosts = new Set(likedPosts);
    if (updatedLikedPosts.has(postId)) {
      updatedLikedPosts.delete(postId);
    } else {
      updatedLikedPosts.add(postId);
    }
    setLikedPosts(updatedLikedPosts);
    try {
      // Call the API to update the like status
      await handleLikePost(postId);
  
      // Optionally fetch updated posts
      await fetchPosts();
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
      // Rollback the local state if the API call fails
      setLikedPosts(likedPosts);
    }
  };

    // Filter posts to only include those with mediaType 'video'
    const videoPosts = posts.filter(post => post.mediaType === 'video');
  
    return (
        <div className="mt-12 min-h-screen">
          <Sidebar />
          <main className=" ml-0 md:ml-64 p-6">
            <Button variant="ghost" className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Feed
            </Button>
            <div className="max-w-3xl mx-auto">
              {videoPosts.map((post) => (
                <VideoCard key={post.id} post={post}
                isLiked={likedPosts.has(post._id)}
                onLike={() => handleLike(post._id)}
                onComment={async (comment) => {
                  await handleAddComment(post._id, comment.text);
                  await fetchPosts(); 
                }}
                />
              ))}
            </div>
          </main>
        </div>
      )
}

export default page