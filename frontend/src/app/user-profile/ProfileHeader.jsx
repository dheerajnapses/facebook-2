import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, X, Upload } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { fetchUserProfile, updateCoverPhoto, updateUserProfile } from "@/services/users.service";
import { useForm, Controller } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useUserStore from "@/Store/userStore";

export function ProfileHeader({id,profileData,isOwner,setProfileData,loadProfile}) {
  const [loading,setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCoverPhotoModalOpen, setIsCoverPhotoModalOpen] = useState(false)
  const [profilePictureFile, setProfilePictureFile] = useState(null); // Store selected profile picture
  const [coverPhotoFile, setCoverPhotoFile] = useState(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState(null); // Store preview URL for the profile picture
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const { setUser } = useUserStore();

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      username: profileData?.username,
      dateOfBirth: profileData?.dateOfBirth?.split("T")[0], // Ensure proper formatting
      gender: profileData?.gender,
    },
  });

  const profileImageInputRef = useRef(null);
  const coverImageInputRef = useRef(null);

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("gender", data.gender);

      // If a new profile picture is selected, append it
      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      } 

      // Call the update API with the form data
      const updatedProfile = await updateUserProfile(id, formData);
      console.log(updatedProfile)
      setProfileData({ ...profileData, ...updatedProfile });
      setIsEditModalOpen(false);
      setProfilePicturePreview(null);
      setUser(updatedProfile); 
      await loadProfile()
    } catch (error) {
      console.error("Error updating profile:", error);
    }finally{
      setLoading(false)
    }
  };



  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePictureFile(file); // Store the selected file in 
      
      // Generate a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setProfilePicturePreview(previewUrl);
    }
  };


  const handleCoverPhotoSubmit = async () => {
    if (coverPhotoFile) {
      try {
        setLoading(true)
        const formData = new FormData()
        formData.append('coverPhoto', coverPhotoFile)
        const updatedProfile = await updateCoverPhoto(id, formData)
        setProfileData({ ...profileData, coverPhoto: updatedProfile.coverPhoto })
        setIsCoverPhotoModalOpen(false)
        setCoverPhotoFile(null)
        setCoverPhotoPreview(null)
      } catch (error) {
        console.error('Error updating cover photo:', error)
      }finally{
        setLoading(false)
      }
    }
  }



  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setCoverPhotoFile(file)
      const previewUrl = URL.createObjectURL(file)
      setCoverPhotoPreview(previewUrl)
    }
  }



  return (
    <div className="relative">
    {/* Cover Photo */}
    <div className="relative h-64 md:h-80 bg-gray-300 overflow-hidden">
      <img
       src={profileData.coverPhoto}
        alt="Cover"
        className="w-full h-full object-cover"
      />
      {isOwner && (
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 flex items-center"
          onClick={() => setIsCoverPhotoModalOpen(true)}
        >
          <Camera className="mr-2 h-4 w-4" />
          Edit Cover Photo
        </Button>
      )}
    </div>

    {/* Profile Section */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
      <div className="flex flex-col md:flex-row items-center md:items-end md:space-x-5">
        <Avatar className="w-32 h-32 border-4 border-white">
               <AvatarImage
                      src={profileData?.profilePicture}
                      alt={profileData?.username}
                    />
          <AvatarFallback>
            {profileData?.username?.split(" ").map((name) => name[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="mt-4 md:mt-0 text-center md:text-left flex-grow">
          <h1 className="text-2xl font-bold">{profileData?.username}</h1>
          <p className="text-gray-600">{profileData?.followerCount} friends</p>
        </div>
        {isOwner && (
          <Button onClick={() => setIsEditModalOpen(true)} className="mt-4 md:mt-0">Edit Profile</Button>
        )}
      </div>
    </div>

    {/* Edit Profile Modal */}
    <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <Avatar className="w-24 h-24 mb-2">
                    <AvatarImage src={profilePicturePreview || profileData.profilePicture} alt={profileData.username} />
                    <AvatarFallback>{profileData.username.split(" ").map((name) => name[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    accept="image/*"
                    ref={profileImageInputRef}
                    className="hidden"
                    onChange={handleProfilePictureChange}

                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => profileImageInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Change Profile Picture
                  </Button>
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" {...register("username")} />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={(value) => setValue("gender", value)} defaultValue={profileData.gender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                   {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Cover Photo Edit Modal */}
      <AnimatePresence>
        {isCoverPhotoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Cover Photo</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsCoverPhotoModalOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  {coverPhotoPreview && (
                    <img src={coverPhotoPreview} alt="Cover Preview" className="w-full h-40 object-cover rounded-lg mb-4" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={coverImageInputRef}
                    className="hidden"
                    onChange={handleCoverPhotoChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => coverImageInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select New Cover Photo
                  </Button>
                </div>
                <Button 
                  onClick={handleCoverPhotoSubmit} 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={!coverPhotoFile}
                >
                     {loading ? 'Saving...' : 'Save Cover Photo'}
     
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  </div>
);
}