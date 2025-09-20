
"use client";

import Image from "next/image";
import Link from "next/link";
import { type Playlist, type Song, type User } from "@/lib/placeholder-data";
import { useMusic } from "@/context/MusicContext";
import { Card, CardContent } from "@/components/ui/card";
import { Play, ListMusic } from "lucide-react";
import { Button } from "../ui/button";

interface PlaylistCardProps {
  playlist: Playlist;
  author: User | undefined;
}

export function PlaylistCard({ playlist, author }: PlaylistCardProps) {
  const { songs, playSong } = useMusic();

  const playlistSongs = playlist.songIds
    .map(songId => songs.find(s => s.id === songId))
    .filter((s): s is Song => !!s);
  
  const coverArt = playlistSongs[0]?.coverArt.imageUrl || "https://picsum.photos/seed/playlist_fallback/300/300";

  const handlePlayPlaylist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0], playlistSongs);
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col group">
      <div className="relative aspect-square w-full">
        <Image
          src={coverArt}
          alt={`Carátula de ${playlist.name}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="text-xl font-bold font-headline text-white truncate">{playlist.name}</h3>
            {author && <p className="text-sm text-white/80 truncate">de {author.name}</p>}
        </div>
        <Button 
            variant="default"
            size="icon"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handlePlayPlaylist}
            disabled={playlistSongs.length === 0}
        >
            <Play className="h-7 w-7" />
        </Button>
      </div>
      <CardContent className="p-3">
        <div className="flex items-center text-sm text-muted-foreground">
            <ListMusic className="h-4 w-4 mr-2"/>
            <span>{playlistSongs.length} {playlistSongs.length === 1 ? 'canción' : 'canciones'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
