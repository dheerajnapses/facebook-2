"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Image as ImageIcon,
  Video,
  Smile,
  X,
  Plus,
  Laugh,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useUserStore from "@/Store/userStore";
import dynamic from 'next/dynamic';
import { usePostStore } from "@/Store/usePostStore";
import { Spinner } from "@/lib/Skeleton";

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const NewPostCard = ({
  isPostModalOpen,
  setIsPostModalOpen,
}) => {
  const { user } = useUserStore();
  const { handleCreatePost } = usePostStore();
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState("");

  const userPlaceholder = user?.username?.split(" ").map((name) => name[0]).join("");
  const fileInputRef = useRef(null);

  const handleEmojiClick = (emojiObject) => {
    setNewPostContent(prevContent => prevContent + emojiObject.emoji);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileType(file.type);
    setFilePreview(URL.createObjectURL(file)); // Create a preview URL for the selected file
  };
  const handleNewPost = async () => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append('content', newPostContent);
      if (selectedFile) {
        formData.append('media', selectedFile);
      }
      await handleCreatePost(formData);
      setNewPostContent('');
      setSelectedFile(null);
      setFilePreview(null);
      setIsPostModalOpen(false);
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <Avatar className="h-10 w-10 mt-1 ">
            {user?.profilePicture ? (
              <AvatarImage src={user?.profilePicture} alt="@user" />
            ) : (
              <AvatarFallback className='dark:bg-gray-400'>{userPlaceholder}</AvatarFallback>
            )}
          </Avatar>
          <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
            <DialogTrigger className="w-full">
              <Input
                 placeholder={`What's on your mind, ${user?.username || 'Your Name'}?`}
                readOnly
                className="cursor-pointer rounded-full h-12 dark:bg-[rgb(58,59,60)] placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <Separator className="my-2 dark:bg-slate-400" />
              <div className="flex justify-between ">
                <Button variant="ghost" className="flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Photo</span>
                </Button>
                <Button variant="ghost" className="flex items-center ">
                  <Video className="h-5 w-5 text-red-500 mr-2" />
                  <span>Video</span>
                </Button>
                <Button variant="ghost" className="flex items-center ">
                  <Laugh className="h-5 w-5 text-orange-500 mr-2" />
                  <span>Feeling</span>
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto" >
              <DialogHeader>
                <DialogTitle className="text-center">Create Post</DialogTitle>
              </DialogHeader>
              <Separator />
              <div className="flex items-center space-x-2 py-4">
                <Avatar className="h-10 w-10">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt="@user" />
                  ) : (
                    <AvatarFallback className='dark:bg-gray-400'>{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-semibold">{user?.username}</p>
                </div>
              </div>
              <Textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[100px] text-lg"
              />
              <AnimatePresence>
                {(showImageUpload || filePreview) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setShowImageUpload(false);
                        setSelectedFile(null);
                        setFilePreview(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {filePreview ? (
                      fileType.startsWith("image") ? (
                        <img src={filePreview} alt="Preview" className="w-full h-auto max-h-[300px] object-cover" />
                      ) : (
                        <video controls src={filePreview} className="w-full h-auto max-h-[300px] object-cover"></video>
                      )
                    ) : (
                      <>
                        <Plus className="h-12 w-12 text-gray-400 mb-2 cursor-pointer" onClick={() => fileInputRef.current.click()} />
                        <p className="text-center text-gray-500">Add Photos/Videos</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="bg-gray-200 dark:bg-muted p-4 rounded-lg mt-4">
                <p className="font-semibold mb-2">Add to your post</p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowImageUpload(!showImageUpload)}
                  >
                    <ImageIcon className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowImageUpload(!showImageUpload)}
                  >
                    <Video className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="h-4 w-4 text-yellow-500" />
                  </Button>
                </div>
              </div>
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className=" relative"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => setShowEmojiPicker(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Picker onEmojiClick={handleEmojiClick} />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleNewPost}
                  className="bg-blue-500 text-white"
                  disabled={loading} 
                >
               {loading ? 'Loading...' : 'Post'} 
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewPostCard;