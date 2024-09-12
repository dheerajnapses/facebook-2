import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Send } from "lucide-react";
import { formatDate } from '@/lib/utils';
import PostComments from './PostComments';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const PostCard = ({ post, isLiked, onLike, onComment,onShare }) => {
  const userPostPlaceholder = post?.userId?.username?.split(" ").map((name) => name[0]).join("");
  const [showComments, setShowComments] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const commentInputRef = useRef(null);
  const router = useRouter()
  const handleCommentClick = () => {
    setShowComments(true);
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 0);
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
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="p-6 ">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 cursor-pointer "  onClick={() => router.push(`/user-profile/${post?.userId?._id}`)}>
              <Avatar>
                {post?.userId?.profilePicture ? (
                  <AvatarImage src={post?.userId?.profilePicture} alt="@user" />
                ) : (
                  <AvatarFallback className='dark:bg-gray-400'>{userPostPlaceholder}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-semibold">{post?.userId?.username}</p>
                <p className="text-sm text-gray-500">{formatDate(post?.createdAt)}</p>
              </div>
            </div>
            <Button variant="ghost" className='dark:hover:bg-gray-500' size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <p className="mb-4">{post?.content}</p>
          {post?.mediaUrl && post?.mediaType === 'image' && (
            <img
              src={post?.mediaUrl}
              alt="Post media"
              className="w-full h-auto rounded-lg mb-4"
            />
          )}
          
          {post?.mediaUrl && post?.mediaType === 'video' && (
            <video controls className="w-full h-[500px] rounded-lg mb-4">
              <source src={post?.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 cursor-pointer">{post?.likeCount} likes</span>
            <div className="flex gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 cursor-pointer" onClick={() => setShowComments(!showComments)} >{post?.commentCount} comments</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 cursor-pointer">{post?.shareCount} share</span>
            </div>
          </div>
          <Separator className="mb-2 dark:bg-gray-400" />
          <div className="flex justify-between mb-2">
            <Button variant="ghost" className={`flex-1 dark:hover:bg-gray-500 ${ isLiked? "text-blue-500" : "" }`} onClick={onLike}>
            <ThumbsUp
            className='mr-2 h-4 w-4 '
          />
              Like
            </Button>
            <Button variant="ghost" className="flex-1 dark:hover:bg-gray-500" onClick={handleCommentClick}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Comment
            </Button>
            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="flex-1 dark:hover:bg-gray-500" onClick={onShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
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
          <Separator className="mb-2 dark:bg-gray-400" />
          
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PostComments
                  post={post}
                  onComment={onComment}
                  commentInputRef={commentInputRef}
                />
        
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostCard;