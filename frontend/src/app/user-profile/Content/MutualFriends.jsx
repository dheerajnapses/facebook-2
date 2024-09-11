"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useFriendsStore from "@/Store/userFriendsStore";

const MutualFriends = () => {
  const { fetchMutualFriends, mutualFriends, unfollow } = useFriendsStore();

  useEffect(() => {
    fetchMutualFriends();
  }, [fetchMutualFriends]);

  const handleUnfollow = async (userId) => {
    await unfollow(userId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Mutual Friends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mutualFriends.map((friend, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-start justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    {friend?.profilePicture ? (
                      <AvatarImage src={friend?.profilePicture} alt="@user" />
                    ) : (
                      <AvatarFallback className="dark:bg-gray-400">
                        {friend?.username
                          ?.split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-semibold">{friend.username}</p>
                    <p className="text-sm text-gray-500">
                      {friend.followerCount} followers
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={async () => {
                        await handleUnfollow(friend._id);
                        await fetchMutualFriends();
                      }}
                    >
                      Unfollow
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MutualFriends;
