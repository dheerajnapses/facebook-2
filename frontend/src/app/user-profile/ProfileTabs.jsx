'use client'
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileContent } from "./ProfileContent";

export function ProfileTabs({id,profileData,isOwner,loadProfile}) {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <ProfileContent activeTab={activeTab} profileData={profileData} isOwner={isOwner} loadProfile={loadProfile} id={id}/>
        </div>
      </Tabs>
    </div>
  );
}
