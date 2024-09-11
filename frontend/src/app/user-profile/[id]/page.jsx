'use client';
import { useEffect, useState } from "react";
import { ProfileHeader } from "../ProfileHeader";
import { ProfileTabs } from "../ProfileTabs";
import { useParams } from "next/navigation";
import { fetchUserProfile } from "@/services/users.service";
import { Spinner } from "@/lib/Skeleton";

export default function UserProfile() {
  const params = useParams();  
  const id = params.id;

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // Move loadProfile function out of useEffect
  const loadProfile = async () => {
    try {
      const response = await fetchUserProfile(id);
      setProfileData(response.profile);
      setIsOwner(response?.isOwner);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile data on component mount or when the id changes
  useEffect(() => {
    if (id) {
      loadProfile();
    }
  }, [id]);

  if (loading) {
    return <Spinner />; // Render a spinner or loader while fetching data
  }

  if (!profileData) {
    return <div>User profile not found</div>;
  }

  return (
    <div>
      {/* Pass the loadProfile function to ProfileHeader and ProfileTabs */}
      <ProfileHeader
        profileData={profileData}
        setProfileData={setProfileData}
        isOwner={isOwner}
        id={id}
        loadProfile={loadProfile}  // Pass loadProfile function
      />
      <ProfileTabs
        profileData={profileData}
        setProfileData={setProfileData}
        isOwner={isOwner}
        id={id}
        loadProfile={loadProfile}  // Pass loadProfile function
      />
    </div>
  );
}
