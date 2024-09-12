'use client'
import { useEffect, useState } from "react"
import Sidebar from "@/app/components/Sidebar"
import NewPostCard from "@/app/posts/NewPostCard"
import PostCard from "@/app/posts/PostCard"
import RightSidebar from "@/app/components/RightSidebar"
import { usePostStore } from "@/Store/usePostStore"
import StorySection from "../posts/AddStory"
import { PostSkeleton } from "@/lib/Skeleton"

const HomePage = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set()); 

  const { posts,handleSharePost,loading, fetchPosts, handleLikePost, handleAddComment } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const savedLikes = localStorage.getItem('likedPosts');
    if (savedLikes) {
      setLikedPosts(new Set(JSON.parse(savedLikes)));
    }
  }, []);

  const handleLike = async (postId) => {
    // Toggle like state locally
    const updatedLikedPosts = new Set(likedPosts);
    if (updatedLikedPosts.has(postId)) {
      updatedLikedPosts.delete(postId);
    } else {
      updatedLikedPosts.add(postId);
    }
    setLikedPosts(updatedLikedPosts);
    localStorage.setItem('likedPosts', JSON.stringify(Array.from(updatedLikedPosts)));

    try {
      await handleLikePost(postId);
      await fetchPosts();
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 px-4 py-6 md:ml-64 lg:mr-64 lg:max-w-2xl xl:max-w-3xl mx-auto">
          <div className="lg:ml-2 xl:ml-28">
            <StorySection/>
            <NewPostCard
              isPostModalOpen={isPostModalOpen}
              setIsPostModalOpen={setIsPostModalOpen}
            />
            <div className="mt-6 space-y-6">
            {loading
                ? Array(3) 
                    .fill(null)
                    .map((_, index) => <PostSkeleton key={index} />)
                :posts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  isLiked={likedPosts.has(post._id)}
                  onLike={() => handleLike(post._id)}
                  onComment={async (comment) => {
                    await handleAddComment(post._id, comment.text);
                    await fetchPosts();
                  }}
                  onShare = {async() => {
                    await handleSharePost(post._id)
                    await fetchPosts();
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block lg:w-64 xl:w-80 fixed right-0 top-16 bottom-0 overflow-y-auto p-4">
          <RightSidebar />
        </div>
      </main>
    </div>
  );
}

export default HomePage;
