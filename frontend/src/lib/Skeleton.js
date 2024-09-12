import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion";
import { UserX } from "lucide-react";

export const FriendCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
      <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
      <Skeleton className="h-8 w-full mb-2" />
      <Skeleton className="h-8 w-full" />
    </div>
  )
  
 export const PostSkeleton = () => (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex items-center mb-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="ml-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24 mt-1" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-48 w-full mb-4" />
        <div className="flex justify-between">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  )


 export const NoFriendsMessage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center w-full  p-8 text-center"
    >
      <UserX size={64} className="text-gray-400 mb-4" />
      <h3 className="text-2xl font-semibold mb-2">No Friend Requests</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Looks like you're all caught up! Why not explore and connect with new people?
      </p>

    </motion.div>
  );



  