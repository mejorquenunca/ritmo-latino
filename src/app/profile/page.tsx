
"use client";

import { ProfileCard } from "@/components/profile/ProfileCard";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, loading, router]);


  if (loading || !currentUser?.profile) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-10 w-10 animate-spin"/>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <ProfileCard user={currentUser.profile} isCurrentUser={true} />
    </div>
  );
}

