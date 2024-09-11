import { useState,useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {  ChevronDown, ChevronUp, Send } from "lucide-react";  
import { formatDate } from '@/lib/utils';
import useUserStore from '@/Store/userStore';

const PostComments = ({post,onComment,commentInputRef}) => {
    const [showAllComments, setShowAllComments] = useState(false);
    const {user} = useUserStore()
    const [commentText, setCommentText] = useState("");  // Manage comment input
    const visibleComments = showAllComments ? post?.comments : post?.comments.slice(0, 1);

    const userPlaceholder = user?.username?.split(" ").map((name) => name[0]).join("");

    const handleCommentSubmit = async() => {
      if (commentText.trim()) {
        onComment({ text: commentText }); // Pass an object with 'text'
        setCommentText(""); // Clear input field after submission
      }
    };


  return (
    <div>
             {/* Comments Section */}
             <div className="mt-4">
            <h3 className="font-semibold mb-2">Comments</h3>
              <div className="max-h-60 overflow-y-auto pr-2">
                {  visibleComments?.map((comment, index) => (
                  <div key={index} className="flex items-start space-x-2 mb-2">
                    <Avatar className="w-8 h-8">
                    {comment?.user?.profilePicture ? (
                  <AvatarImage src={comment?.user?.profilePicture} alt="@user" />
                ) : (
                  <AvatarFallback className='dark:bg-gray-400'>{comment?.user?.username?.split(" ").map((name) => name[0]).join("")}</AvatarFallback>
                )}
                    </Avatar>
                    <div className='flex flex-col'>
                    <div className='dark:bg-[rgb(58,59,60)] p-2 rounded-lg'>
                      <p className="font-bold text-sm">{comment?.user?.username}</p>
                      <p className="text-sm">{comment?.text}</p>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                                  <Button variant="ghost" size="sm">Like</Button>
                                  <Button variant="ghost" size="sm">Reply</Button>
                                  <span>{formatDate(comment?.createdAt)}</span>
                                </div>
                    </div>
            
        
                  </div>
                ))}
              </div>
            {post?.comments.length > 1 && (
              <p
      
                className="w-40 mt-2 text-blue-600 dark:text-gray-300"
                onClick={() => setShowAllComments(!showAllComments)}
              >
                {showAllComments ? (
                  <>Show Less <ChevronUp className="ml-2 h-4 w-4" /></>
                ) : (
                  <>Show All Comments <ChevronDown className="ml-2 h-4 w-4" /></>
                )}
              </p>
            )}
          </div>

          {/* Comment Input with Submit Icon */}
          <div className="flex items-center space-x-2 mt-4">
            <Avatar className="w-8 h-8">
            {user?.profilePicture ? (
                  <AvatarImage src={user?.profilePicture} alt="@user" />
                ) : (
                  <AvatarFallback className='dark:bg-gray-400'>{userPlaceholder}</AvatarFallback>
                )}
            </Avatar>
            <Input 
              value={commentText}
              ref={commentInputRef}
              onChange={(e) => setCommentText(e.target.value)}  
              onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()} 
              placeholder="Write a comment..." 
              className="flex-grow cursor-pointer rounded-full h-12 dark:bg-[rgb(58,59,60)] placeholder:text-gray-500 dark:placeholder:text-gray-400" 
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCommentSubmit}  
              className="hover:bg-transparent"
            >
              <Send className="h-5 w-5 text-blue-500" /> 
            </Button>
          </div>
    </div>
  )
}

export default PostComments