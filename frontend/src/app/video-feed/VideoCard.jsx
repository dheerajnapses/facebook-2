'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, Users, MessageCircle, Bell, ThumbsUp, Share2, Clock, ChevronLeft, Send } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import VideoComments from './VideoComments'
import useUserStore from '@/Store/userStore'


const VideoCard = ({ post, isLiked, onComment, onLike,onShare }) => {
  const [showComments, setShowComments] = useState(false)
  const commentInputRef = useRef(null)
  const [commentText, setCommentText] = useState(""); 
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  const {user} = useUserStore() 
  const userPlaceholder = user?.username?.split(" ").map((name) => name[0]).join("");
  const userPostPlaceholder = post?.userId?.username?.split(" ").map((name) => name[0]).join("")

  const handleCommentClick = () => {
    setShowComments(true)
    setTimeout(() => {
      commentInputRef.current?.focus()
    }, 0)
  }

  const handleCommentSubmit = async() => {
    if (commentText.trim()) {
      onComment({ text: commentText }); // Pass an object with 'text'
      setCommentText(""); // Clear input field after submission
    }
  };

 
  const generateShareableUrl = () => {
    return `https://facebook-theta.vercel.app/user-profile/${post?.userId?._id}`
  }

  const handleShare = (platform) => {
    const url = generateShareableUrl();
    let shareUrl;

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setIsShareDialogOpen(false);
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
    setIsShareDialogOpen(false);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-[rgb(36,37,38)] rounded-lg mb-8 shadow-lg overflow-hidden"
    >
      <div>
        <div className="flex items-center justify-between mb-4 px-4 mt-2">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              {post?.userId?.profilePicture ? (
                <AvatarImage src={post?.userId?.profilePicture} alt="@user" />
              ) : (
                <AvatarFallback className='dark:bg-gray-400'>{userPostPlaceholder}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-semibold">{post?.userId?.username}</h3>
            </div>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">{formatDate(post?.createdAt)}</span>
          </div>
        </div>
        <div className="relative aspect-video bg-black mb-4">
          {post?.mediaUrl && (
            <video controls className="w-full h-[500px] rounded-lg mb-4">
              <source src={post?.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
   
        <div className="flex justify-between px-2 mb-2 items-center">
          <div className="flex space-x-4">
            <Button variant="ghost" className="flex items-center" onClick={onLike}>
              <ThumbsUp className={`mr-2 h-4 w-4 ${isLiked ? 'text-blue-500' : ''}`} />
              <span>Like</span>
            </Button>
            <Button variant="ghost" className="flex items-center" onClick={handleCommentClick}>
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>Comment</span>
            </Button>
            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="flex items-center" onClick={onShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share this post</DialogTitle>
                  <DialogDescription>
                    Choose how you want to share this post
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                  <Button onClick={() => handleShare('facebook')}>Share on Facebook</Button>
                  <Button onClick={() => handleShare('twitter')}>Share on Twitter</Button>
                  <Button onClick={() => handleShare('linkedin')}>Share on LinkedIn</Button>
                  <Button onClick={() => handleShare('copy')}>Copy Link</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <Button variant="ghost" size="sm" >
              {post?.likeCount} likes
            </Button>
            <Button variant="ghost" size="sm"  onClick={() => setShowComments(!showComments)}>
              {post?.commentCount} Comments
            </Button>
            <Button variant="ghost" size="sm"  >
              {post?.shareCount} share
            </Button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4"
          >
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <VideoComments key={post._id} comments={post.comments} />
            </ScrollArea>
            <div className="flex items-center mt-4">
            <Avatar className="w-8 h-8">
            {user?.profilePicture ? (
                  <AvatarImage src={user?.profilePicture} alt="@user" />
                ) : (
                  <AvatarFallback className='dark:bg-gray-400'>{userPlaceholder}</AvatarFallback>
                )}
            </Avatar>
              <Input
                ref={commentInputRef}
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()} 
                className="flex-1 mr-2"
              />
              <Button onClick={handleCommentSubmit}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default VideoCard