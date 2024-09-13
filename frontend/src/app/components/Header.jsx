'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  MessageCircle,
  Search,
  Moon,
  Sun,
  Home,
  Video,
  Menu,
  Users,
  LogOut,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import Image from "next/image";
import useUserStore from "@/Store/userStore";
import useSidebarStore from "@/Store/sidebarStore";
import { logout } from "@/services/auth.service";
import { getAllUsers } from "@/services/post.service";
import Loader from "@/lib/Loader";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItem, setActiveItem] = useState("home");
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();
  const { user, clearUser } = useUserStore();
  const { toggleSidebar } = useSidebarStore();
  const userPlaceholder = user?.username?.split(" ").map((name) => name[0]).join("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        setUserList(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = userList.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
      setIsSearchOpen(true);
    } else {
      setFilteredUsers([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery, userList]);

  const handleNavigation = (path, item) => {
    router.push(path);
    setActiveItem(item);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchOpen(false);
    console.log("Searching for:", searchQuery);
  };

  const handleUserClick = async (userId) => {
    try {
      setLoading(true);
      setIsSearchOpen(false);
      setSearchQuery("");
      await router.push(`/user-profile/${userId}`);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      router.push('/user-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearchClose = (event) => {
    // Delay closing to allow click events to process
    setTimeout(() => {
      if (!searchRef.current?.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }, 200);
  };

  useEffect(() => {
    document.addEventListener('click', handleSearchClose);
    return () => {
      document.removeEventListener('click', handleSearchClose);
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <header className="bg-white dark:bg-[rgb(36,37,38)] text-foreground shadow-md h-16 fixed top-0 left-0 right-0 z-50 p-2">
      <div className="mx-auto flex justify-between items-center p-2">
        <div className="flex items-center gap-2 md:gap-4">
          <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
            <Image
              src="/images/Facebook_Logo.png"
              width={40}
              height={40}
              alt="Facebook Logo"
              onClick={() => handleNavigation("/")}
            />
          </h1>
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-8 w-40 md:w-64 h-10 bg-gray-100 dark:bg-[rgb(58,59,60)] rounded-full"
                  placeholder="Search Facebook"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                />
              </div>
              {isSearchOpen && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg mt-1 z-50">
                  <div className="p-2">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center space-x-8 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                          onClick={() => handleUserClick(user?._id)}
                        >    
                          <Search className="absolute text-sm text-gray-400" />
                          <div className="flex items-center gap-2"> 
                            <Avatar className="h-8 w-8">
                              {user.profilePicture ? (
                                <AvatarImage src={user.profilePicture} alt={user.username} />
                              ) : (
                                <AvatarFallback>{user.username[0]}</AvatarFallback>
                              )}
                            </Avatar>
                            <span>{user.username}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">No users found</div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
        {/* Navigation bar */}
        <nav className="hidden md:flex justify-around w-[40%] max-w-md">
          {[
            { icon: Home, path: "/", name: "home" },
            { icon: Video, path: "/video-feed", name: "video" },
            { icon: Users, path: "/friends-list", name: "friends" },
          ].map(({ icon: Icon, path, name }) => (
            <Button
              key={name}
              variant="ghost"
              size="icon"
              className={`relative text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-transparent ${
                activeItem === name ? "text-blue-600" : ""
              } transition-colors duration-300`}
              onClick={() => handleNavigation(path, name)}
            >
              <Icon />
            </Button>
          ))}
        </nav>
        {/* User profile and menu */}
        <div className="flex space-x-2 md:space-x-4 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-600"
            onClick={toggleSidebar}
          >
            <Menu />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hidden md:block dark:text-gray-400">
            <Bell />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hidden md:block dark:text-gray-400">
            <MessageCircle />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt="@user" />
                  ) : (
                    <AvatarFallback className="dark:bg-gray-400">{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 z-50" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      {user?.profilePicture ? (
                        <AvatarImage src={user.profilePicture} alt="@user" />
                      ) : (
                        <AvatarFallback className="dark:bg-gray-400">{userPlaceholder}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {user?.username}
                      </p>
                      <p className="text-xs leading-none mt-2 text-gray-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigation(`/user-profile/${user?._id}`)}>
                <User /> <span className="ml-2">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircle /><span className="ml-2">Messages</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "light" ? (
                  <>
                    <Moon className="mr-2" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="mr-2" />
                    <span>Light Mode</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut /> <span className="ml-2">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;