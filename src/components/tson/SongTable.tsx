
"use client";

import Image from "next/image";
import { Heart, PlusCircle, MoreHorizontal, ListMusic, Play } from "lucide-react";
import { useMusic } from "@/context/MusicContext";
import { type Song, type Playlist } from "@/lib/placeholder-data";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SongTableProps {
  songs: Song[];
  caption?: string;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function SongTable({ songs, caption = "Una colección de las mejores canciones latinas." }: SongTableProps) {
  const { playSong, likedSongs, toggleLikeSong, playlists, addSongToPlaylist } = useMusic();
  const myPlaylists = playlists.filter(p => p.ownerId === 'u4'); // Hardcoded current user

  const isLiked = (songId: string) => likedSongs.some(s => s.id === songId);

  if (songs.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <ListMusic className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-semibold">No hay canciones aquí</p>
        <p className="text-muted-foreground">{caption.replace('Canciones', 'Aún no tienes canciones')}</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Título</TableHead>
            <TableHead className="hidden md:table-cell">Álbum</TableHead>
            <TableHead className="text-right">Duración</TableHead>
            <TableHead className="w-[50px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song) => (
            <TableRow key={song.id} onDoubleClick={() => playSong(song, songs)} className="cursor-pointer">
              <TableCell>
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => playSong(song)}
                >
                  <Play className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TableCell>
              <TableCell>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => toggleLikeSong(song)}
                >
                  <Heart className={cn("h-4 w-4", isLiked(song.id) ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                </Button>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Image
                    src={song.coverArt.imageUrl}
                    alt={song.title}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  <div>
                    <p className="font-semibold truncate">{song.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">{song.album}</TableCell>
              <TableCell className="text-right text-muted-foreground">{formatDuration(song.duration)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>Añadir a playlist</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {myPlaylists.map(p => (
                            <DropdownMenuItem key={p.id} onClick={() => addSongToPlaylist(p.id, song)}>
                                {p.name}
                            </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Helper cn function for conditional classnames
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
