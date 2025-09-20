
"use client";

import { useMusic } from "@/context/MusicContext";
import { songs as allSongs, type Song } from "@/lib/placeholder-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { SongTable } from "./SongTable";

export function MusicLibrary() {
  const { likedSongs, uploadedSongs } = useMusic();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold font-headline">Tu Librería</h2>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todas ({allSongs.length})</TabsTrigger>
          <TabsTrigger value="liked">Me Gusta ({likedSongs.length})</TabsTrigger>
          <TabsTrigger value="uploaded">Mis Subidas ({uploadedSongs.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <SongTable songs={allSongs} />
        </TabsContent>
        <TabsContent value="liked" className="mt-4">
          <SongTable songs={likedSongs} caption="Canciones que te gustan." />
        </TabsContent>
        <TabsContent value="uploaded" className="mt-4">
          <SongTable songs={uploadedSongs} caption="Canciones que has subido." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
