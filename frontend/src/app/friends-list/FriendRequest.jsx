"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, UserMinus } from "lucide-react";
import { FriendCardSkeleton, NoFriendsMessage } from "@/lib/Skeleton";

const FriendRequest = ({ friendRequests, onAction }) => {
  const userPlaceholder = friendRequests?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
        >
          <Avatar className="h-32 w-32 roun mx-auto mb-4">
            {friendRequests?.profilePicture ? (
              <AvatarImage src={friendRequests.profilePicture} alt="@user" />
            ) : (
              <AvatarFallback className="dark:bg-gray-400">
                {userPlaceholder}
              </AvatarFallback>
            )}
          </Avatar>
          <h3 className="text-lg font-semibold text-center mb-4">
            {friendRequests?.username}
          </h3>
          <div className="flex flex-col justify-between">
            <Button className="bg-blue-600" size="lg" onClick={() => onAction("confirm", friendRequests._id)} >
              <UserPlus className="mr-2 h-4 w-4" />
              Confirm
            </Button>
            <Button variant="ghost" size="lg" className="mt-2 bg-gray-300"  onClick={() => onAction("delete", friendRequests._id)} >
              <UserMinus className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </motion.div>
    </AnimatePresence>
  );
};

export default FriendRequest;
