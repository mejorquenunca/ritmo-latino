
"use client";

import { useMemo, useState } from "react";
import { useMusic } from "@/context/MusicContext";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { PlaylistCard } from "./PlaylistCard";
import { users, type Song } from "@/lib/placeholder-data";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

export function PlaylistCarousel() {
  const { publishedPlaylists, songs: allSongs } = useMusic();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlaylists = useMemo(() => {
    if (!searchTerm) {
      return publishedPlaylists;
    }

    const lowercasedTerm = searchTerm.toLowerCase();

    return publishedPlaylists.filter(playlist => {
      const author = users.find(u => u.id === playlist.ownerId);
      if (author?.name.toLowerCase().includes(lowercasedTerm)) {
        return true;
      }
      if (playlist.name.toLowerCase().includes(lowercasedTerm)) {
        return true;
      }
      
      const songsInPlaylist = playlist.songIds.map(id => allSongs.find(s => s.id === id)).filter(Boolean) as Song[];

      return songsInPlaylist.some(song => 
        song.title.toLowerCase().includes(lowercasedTerm) ||
        song.artist.toLowerCase().includes(lowercasedTerm) ||
        song.album.toLowerCase().includes(lowercasedTerm)
      );
    });
  }, [publishedPlaylists, searchTerm, allSongs]);

  if (publishedPlaylists.length === 0) {
    return (
        <div className="text-center py-10 border rounded-lg bg-card">
            <p className="text-lg font-semibold">Aún no hay playlists publicadas.</p>
            <p className="text-muted-foreground">¡Ve a TSón y publica la tuya para que la comunidad la descubra!</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Busca por género, artista, canción..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredPlaylists.length > 0 ? (
        <Carousel 
            opts={{
                align: "start",
                loop: filteredPlaylists.length > 2,
            }}
            className="w-full"
        >
            <CarouselContent>
            {filteredPlaylists.map((playlist) => {
                const author = users.find(u => u.id === playlist.ownerId);
                return (
                    <CarouselItem key={playlist.id} className="md:basis-1/2 lg:basis-1/3">
                        <PlaylistCard playlist={playlist} author={author} />
                    </CarouselItem>
                )
            })}
            </CarouselContent>
            <CarouselPrevious className="ml-12"/>
            <CarouselNext className="mr-12"/>
        </Carousel>
      ) : (
        <div className="text-center py-10 border rounded-lg bg-card">
          <p className="text-lg font-semibold">No se encontraron playlists</p>
          <p className="text-muted-foreground">Intenta con una búsqueda diferente.</p>
        </div>
      )}
    </div>
  );
}
