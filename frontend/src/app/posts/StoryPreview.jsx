import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const StoryPreview = ({ file, fileType, onClose, onPost, isNewStory, username, avatar,isLoading }) => {
  const Username = username?.split(" ").map((name) => name[0]).join("");
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md h-[70vh] flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="absolute top-4 left-4 z-10 flex items-center">
          <Avatar className="w-10 h-10 mr-2">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>{Username}</AvatarFallback>
          </Avatar>
          <span className="text-gray-800 dark:text-gray-200 font-semibold">{username}</span>
        </div>
        <div className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          {fileType === 'image' ? (
            <img src={file} alt="Story preview" className="max-w-full max-h-full object-contain" />
          ) : (
            <video src={file} className="max-w-full max-h-full object-contain" controls autoPlay />
          )}
        </div>
        {isNewStory && (
          <div className="absolute bottom-4 right-2 transform -translate-x-1/2">
            <Button onClick={onPost} className="bg-blue-500 hover:bg-blue-600 text-white">{isLoading ?'Loading...':'Share'}</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryPreview;
