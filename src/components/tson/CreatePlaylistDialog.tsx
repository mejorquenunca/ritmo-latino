
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMusic } from "@/context/MusicContext";
import { Plus } from "lucide-react";

export function CreatePlaylistDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { createPlaylist } = useMusic();

  const handleCreate = () => {
    if (name.trim()) {
      createPlaylist(name);
      setName("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Crear Playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Playlist</DialogTitle>
          <DialogDescription>
            Dale un nombre a tu nueva colección de canciones.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Ej: Salsa para la fiesta"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
