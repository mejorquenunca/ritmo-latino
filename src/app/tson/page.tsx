
"use client";

import { useAuth } from "@/context/AuthContext";
import { MusicLibrary } from "@/components/tson/MusicLibrary";
import { PlaylistManager } from "@/components/tson/PlaylistManager";
import { SongUploader } from "@/components/tson/SongUploader";
import { Separator } from "@/components/ui/separator";
import { Music } from "lucide-react";

export default function TSonPage() {
  const { currentUser } = useAuth();
  const isCreator = currentUser?.profile?.role === 'creator';

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center justify-center gap-3">
          <Music className="h-10 w-10" />
          TSón
        </h1>
        <p className="text-muted-foreground mt-2">
          Tu espacio personal para descubrir, organizar y disfrutar la música latina.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MusicLibrary />
        </div>
        <div className="space-y-8">
          {isCreator && <SongUploader />}
          <Separator />
          <PlaylistManager />
        </div>
      </div>
    </div>
  );
}
