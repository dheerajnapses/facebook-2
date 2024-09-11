'use client'
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, Users, MessageCircle, Menu, Bell, Video, User } from "lucide-react";
import { useRouter } from "next/navigation";
import useUserStore from "@/Store/userStore";
import useSidebarStore from "@/Store/sidebarStore"; 

const Sidebar = () =>{
   
  const router = useRouter()
  const {user} = useUserStore()
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const userPlaceholder = user?.username?.split(" ").map(name => name[0]).join("")
  const handleNavigation = (path)=> {
    router.push(path);
    if (isSidebarOpen) {
      toggleSidebar(); // Close the sidebar after navigation
    }
  };


return (
  <>
    <aside
     className={`fixed top-16 left-0 h-full w-64 p-4 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col z-50 md:z-0 ${
      isSidebarOpen ? "translate-x-0 bg-white dark:bg-[rgb(36,37,38)] shadow-lg" : "-translate-x-full"
    } ${isSidebarOpen ? "md:hidden" : ""} md:bg-transparent md:shadow-none`}
    >
      <div className="flex flex-col h-full overflow-y-auto">


        {/* Navigation Items */}
        <nav className="space-y-4 flex-grow">
        <div className="flex items-center space-x-2  cursor-pointer" onClick={() =>handleNavigation(`/user-profile/${user?._id}`)}>
          <Avatar className="h-10 w-10">
          {user?.profilePicture ?(
                    <AvatarImage
                     src={user.profilePicture}
                     alt="@user"
                    />
                  ):(
                    <AvatarFallback className='bg-gray-200 dark:bg-gray-400 shadow-lg'>{userPlaceholder}</AvatarFallback>
                  )}
          </Avatar>
          <span className="font-semibold">{user?.username}</span>
        </div>
          <Button onClick={() =>handleNavigation('/')} variant="ghost" className="w-full justify-start ">
            <Home className="mr-4"  /> Home
          </Button>
          <Button onClick={() =>handleNavigation('/friends-list')} variant="ghost" className="w-full justify-start ">
            <Users className="mr-4" /> Friends
          </Button>
          <Button onClick={() =>handleNavigation('/video-feed')} variant="ghost" className="w-full justify-start mb-2">
            <Video className="mr-4" /> Video
          </Button>
          <Button onClick={() =>handleNavigation(`/user-profile/${user?._id}`)} variant="ghost" className="w-full justify-start mb-2">
            <User className="mr-4" /> Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <MessageCircle className="mr-4" /> Messages
          </Button>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <Bell className="mr-4" /> Notifications
          </Button>
        </nav>

        {/* Footer Section */}
        <div className="mb-16">
          <Separator className="my-4" />
          <div className="flex items-center space-x-2 mb-4 cursor-pointer" onClick={() =>handleNavigation(`/user-profile/${user?._id}`)}>
            <Avatar className="h-8 w-8">
            {user?.profilePicture ?(
                    <AvatarImage
                     src={user.profilePicture}
                     alt="@user"
                    />
                  ):(
                    <AvatarFallback className='bg-gray-200 dark:bg-gray-400 shadow-lg'>{userPlaceholder}</AvatarFallback>
                  )}
            </Avatar>
            <span className="text-sm font-semibold">{user?.username}</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Privacy · Terms · Advertising ·</p>
            <p>· Meta © 2024</p>
          </div>
        </div>
      </div>
    </aside>
  </>
)
}

export default Sidebar;
