
"use client";

import { useRef, type ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { UploadCloud } from "lucide-react";
import { useMusic } from "@/context/MusicContext";
import type { Song } from "@/lib/placeholder-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

export function SongUploader() {
  const { addUploadedSong } = useMusic();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newSong: Song = {
        id: `uploaded-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Artista Desconocido",
        album: "Subidas",
        duration: 0, // Will be updated by the audio element
        coverArt: PlaceHolderImages.find(img => img.id === 'song_cover1')!,
        audioUrl: URL.createObjectURL(file),
      };
      addUploadedSong(newSong);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the input
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold font-headline">Sube tu Música</h2>
      <div 
        className={cn(
            "rounded-lg border-2 border-dashed bg-card text-card-foreground shadow-sm p-4 text-center",
            "transition-colors duration-200"
        )}
      >
        <Label 
            htmlFor="song-upload" 
            className={cn(
                "cursor-pointer w-full flex flex-col items-center justify-center space-y-2",
                "active:bg-secondary active:border-primary rounded-lg p-4 -m-4" // Apply active state here and use negative margin
            )}
        >
            <UploadCloud className="mx-auto h-10 w-10 text-primary"/>
            <p className="font-semibold text-primary">Haz clic para subir</p>
            <p className="text-xs text-muted-foreground">MP3, WAV, etc.</p>
        </Label>
        <Input 
            id="song-upload" 
            type="file" 
            className="hidden" 
            accept="audio/*" 
            ref={fileInputRef}
            onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
