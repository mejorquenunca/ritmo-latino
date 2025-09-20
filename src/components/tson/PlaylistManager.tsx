
"use client";

import { useMusic } from "@/context/MusicContext";
import { type Playlist, type Song } from "@/lib/placeholder-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ListMusic, Play, Trash2, X, Copy, EyeOff, MoreHorizontal, Send } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CreatePlaylistDialog } from "./CreatePlaylistDialog";

function PlaylistAccordionItem({
  playlist,
  isCollaboration = false,
}: {
  playlist: Playlist;
  isCollaboration?: boolean;
}) {
  const {
    removeSongFromPlaylist,
    deletePlaylist,
    clonePlaylist,
    unfollowPlaylist,
    playSong,
    publishPlaylist, // <-- Get publish function
    songs,
  } = useMusic();
  
  const playlistSongs = playlist.songIds
    .map(songId => songs.find(s => s.id === songId))
    .filter((s): s is Song => !!s);
    
  const handlePlayPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0], playlistSongs);
    }
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.stopPropagation();
    publishPlaylist(playlist.id);
  };

  return (
    <AccordionItem value={playlist.id}>
      <div className="flex items-center gap-1 w-full pr-4">
         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePlayPlaylist} disabled={playlistSongs.length === 0}>
            <Play className="h-5 w-5 text-primary" />
        </Button>
        <AccordionTrigger className="hover:no-underline flex-1 py-4">
            <span className="truncate text-left">{playlist.name} ({playlistSongs.length})</span>
        </AccordionTrigger>
        {!isCollaboration && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePublish}>
                      <Send className="h-4 w-4 text-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Publicar en la comunidad</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
        )}
      </div>
      <AccordionContent>
        {playlistSongs.length > 0 ? (
          <div className="space-y-2 pl-8">
            {playlistSongs.map((song) => (
              <div key={song.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={song.coverArt.imageUrl}
                    alt={song.title}
                    width={32}
                    height={32}
                    className="rounded"
                  />
                  <div className="text-xs">
                    <p className="font-semibold truncate">{song.title}</p>
                    <p className="text-muted-foreground truncate">
                      {song.artist}
                    </p>
                  </div>
                </div>
                {!isCollaboration && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeSongFromPlaylist(playlist.id, song.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground pl-8">
            No hay canciones en esta playlist.
          </p>
        )}
         <div className="flex justify-end pr-4 mt-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                     {isCollaboration ? (
                        <>
                            <DropdownMenuItem onClick={() => clonePlaylist(playlist, `Copia de ${playlist.name}`)}>
                                <Copy className="mr-2 h-4 w-4" /> Clonar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => unfollowPlaylist(playlist.id)}>
                                <EyeOff className="mr-2 h-4 w-4" /> Ocultar
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <DropdownMenuItem className="text-destructive" onClick={() => deletePlaylist(playlist.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </AccordionContent>
    </AccordionItem>
  );
}


export function PlaylistManager() {
  const { playlists } = useMusic();
  const currentUser = "u4"; // Hardcoded user

  const myPlaylists = playlists.filter((p) => p.ownerId === currentUser);
  const collaborativePlaylists = playlists.filter(
    (p) => p.ownerId !== currentUser
  );

  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-headline">Playlists</h2>
            <CreatePlaylistDialog />
        </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <Accordion type="multiple" className="w-full">
            <h3 className="font-semibold text-muted-foreground px-4 mb-2">Mis Playlists</h3>
            {myPlaylists.length > 0 ? (
                myPlaylists.map((p) => <PlaylistAccordionItem key={p.id} playlist={p} />)
            ) : <p className="text-sm text-muted-foreground px-4">No has creado ninguna playlist.</p>}

            <h3 className="font-semibold text-muted-foreground px-4 mt-4 mb-2">Colaboraciones</h3>
            {collaborativePlaylists.length > 0 ? (
                collaborativePlaylists.map((p) => <PlaylistAccordionItem key={p.id} playlist={p} isCollaboration />)
            ) : <p className="text-sm text-muted-foreground px-4">No sigues ninguna playlist colaborativa.</p>}
        </Accordion>
      </div>
    </div>
  );
}
