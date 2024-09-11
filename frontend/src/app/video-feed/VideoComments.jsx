import { formatDate } from '@/lib/utils';
import React from 'react'
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const VideoComments = ({comments}) => {

  
  return (
          <>
                {  comments?.map((comment, index) => (
                              <div className="flex items-start space-x-2 mb-4">
                              <Avatar className="w-8 h-8">
                                      {comment?.user?.profilePicture ? (
                                    <AvatarImage src={comment?.user?.profilePicture} alt="@user" />
                                  ) : (
                                    <AvatarFallback className='dark:bg-gray-400'>{comment?.user?.username?.split(" ").map((name) => name[0]).join("")}</AvatarFallback>
                                  )}
                                      </Avatar>
                              <div className="flex-1">
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                                  <p className="font-semibold text-sm">{comment?.user?.username}</p>
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
          </>

      
  )
}

export default VideoComments