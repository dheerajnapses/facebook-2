import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PostContent from "./Content/PostContent";
import { usePostStore } from "@/Store/usePostStore";
import { useEffect, useState } from "react";
import MutualFriends from "./Content/MutualFriends";
import { Home, Heart, Briefcase, GraduationCap, Phone, Mail, Cake, MapPin } from "lucide-react";
import EditBio from "./Content/EditBio";
import { PostSkeleton } from "@/lib/Skeleton";

export function ProfileContent({ activeTab, id,profileData,isOwner,loadProfile}) {
  const { userPosts,loading, fetchUserPost,handleSharePost ,handleLikePost,handleAddComment} = usePostStore();
  const [likedPosts, setLikedPosts] = useState(new Set()); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 
  useEffect(() => {
    if (id) {
      fetchUserPost(id);
    }
  }, [id, fetchUserPost]);


  useEffect(() => {
    // Load liked posts from local storage
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
      // Call the API to update the like status
      await handleLikePost(postId);
  
      // Optionally fetch updated posts
      await fetchUserPost(id);
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  };

 if(loading){
   <PostSkeleton/>
 }
  const tabContent = {
    posts: (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[70%] space-y-6">
        {userPosts.map((post) => (
         <PostContent
          key={post?._id}
          post={post} 
         isLiked={likedPosts.has(post._id)}
         onLike={() => handleLike(post._id)}
         onComment={async (comment) => {
           await handleAddComment(post._id, comment.text);
           await fetchUserPost(id); 
         }}
         onShare = {async() => {
          await handleSharePost(post._id)
          await fetchUserPost(id); 
        }}
         />
        ))}
        </div>
        {/* Right Sidebar (30% width) */}
        <div className="w-full lg:w-[30%]">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Intro</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{profileData?.bio?.bioText}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  <span>Lives in {profileData?.bio?.liveIn}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  <span>{profileData?.bio?.relationship}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>From {profileData?.bio?.hometown}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span>Works at {profileData?.bio?.workplace}</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  <span>Studied at {profileData?.bio?.education}</span>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src="/placeholder-user.jpg" alt="Follower" />
                  <AvatarFallback>F</AvatarFallback>
                </Avatar>
                <span>Followed by {profileData?.followingCount} people</span>
              </div>
              {isOwner && (
                 <Button className="w-full" onClick={() => setIsEditModalOpen(true)}>Edit Bio</Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    ),
    about: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-6 mb-4">
            <h2 className="text-xl font-semibold mb-4">About {"   "}{profileData?.username}</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                <span>Works at {profileData?.bio?.workplace}</span>
              </div>
              <div className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                <span>Studied at {profileData?.bio?.education}</span>
              </div>
              <div className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                <span>Lives in {profileData?.bio?.liveIn}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>From {profileData?.bio?.hometown}</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                <span>{profileData?.bio?.relationship}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <span>{profileData?.bio?.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <span>{profileData?.email}</span>
              </div>
              <div className="flex items-center">
                <Cake className="w-5 h-5 mr-2" />
                <span>Birthday: {new Date(profileData?.dateOfBirth).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
    friends: (
       <MutualFriends/>
    ),
    photos: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Photos</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Filter and display images */}
              {userPosts
                ?.filter((post) => post.mediaType === 'image' && post.mediaUrl) // Filter posts with images
                .map((post) => (
                  <img
                    key={post.id}
                    src={post.mediaUrl}
                    alt={`Post by ${post.userId?.username}`}
                    className="w-full h-auto rounded-lg"
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
    
  };

  return (
    <>
      {tabContent[activeTab] || null}
      <EditBio
        isOpen={isEditModalOpen}
        loadProfile={loadProfile}
        onClose={() => setIsEditModalOpen(false)}
        initialData={profileData?.bio}
        id={id}
      />
    </>
  );
}
