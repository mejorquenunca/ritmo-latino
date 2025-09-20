
"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMusic } from "@/context/MusicContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1, Music, Volume2, Volume1, VolumeX, Loader2 } from "lucide-react";

function formatTime(seconds: number) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function FooterPlayer() {
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    const musicContext = useMusic();
    const { 
        currentSong, isPlaying, progress, duration, 
        isShuffle, repeatMode, volume,
        togglePlay, playNext, playPrevious, seek, toggleShuffle, toggleRepeat, setVolume
    } = musicContext || {};

    const placeholderClasses = "fixed bottom-16 md:bottom-0 left-0 right-0 h-24 bg-background/95 border-t z-40 flex items-center justify-between px-4 py-2";

    const VolumeIcon = useMemo(() => {
        if (!isClient || !volume || volume === 0) return VolumeX;
        if (volume < 0.5) return Volume1;
        return Volume2;
    }, [isClient, volume]);

    if (!isClient) {
         return (
            <footer className={placeholderClasses}>
                <div className="flex items-center gap-2 w-full justify-center text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <p>Cargando reproductor...</p>
                </div>
            </footer>
        );
    }
    
    if (!currentSong) {
        const showTsonLink = pathname !== '/tson';
        return (
            <footer className={placeholderClasses}>
                {/* Placeholder Info */}
                <div className="flex items-center gap-3 w-1/2 md:w-1/4 min-w-0">
                    <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Music className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold truncate text-sm">
                            {showTsonLink ? (
                                <Link href="/tson" className="hover:underline">
                                    Selecciona una canción
                                </Link>
                            ) : (
                                "Selecciona una canción"
                            )}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">para empezar a escuchar</p>
                    </div>
                </div>

                {/* Player Controls (visible but disabled) */}
                <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex flex-col items-center gap-2 w-full md:w-1/2 max-w-md opacity-50 pointer-events-none">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hidden md:inline-flex" disabled>
                            <Shuffle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                            <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button variant="default" size="icon" className="h-12 w-12 rounded-full" disabled>
                            <Play className="h-6 w-6" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                            <SkipForward className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hidden md:inline-flex" disabled>
                            <Repeat className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="w-full hidden md:flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-8 text-right">0:00</span>
                        <Slider value={[0]} max={100} disabled className="w-full" />
                        <span className="text-xs text-muted-foreground w-8 text-left">0:00</span>
                    </div>
                </div>
                
                {/* Disabled Volume Controls */}
                <div className="hidden md:flex w-1/4 justify-end items-center gap-2 opacity-50 pointer-events-none">
                    <Button variant="ghost" size="icon" disabled>
                        {VolumeIcon && <VolumeIcon className="h-5 w-5" />}
                    </Button>
                    <Slider value={[volume ? volume * 100 : 0]} disabled className="w-[100px]" />
                </div>
            </footer>
        );
    }

    return (
        <footer className={placeholderClasses}>
            {/* Song Info */}
            <div className="flex items-center gap-3 w-1/2 md:w-1/4 min-w-0">
                <Image 
                    src={currentSong.coverArt.imageUrl} 
                    alt={currentSong.title}
                    width={56}
                    height={56}
                    className="rounded-md"
                />
                <div className="overflow-hidden">
                    <p className="font-bold truncate text-sm">{currentSong.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
                </div>
            </div>

            {/* Player Controls */}
            <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex flex-col items-center gap-2 w-full md:w-1/2 max-w-md">
                <div className="flex items-center gap-2">
                    <Button variant={isShuffle ? "default" : "ghost"} size="icon" className="h-8 w-8 hidden md:inline-flex" onClick={toggleShuffle}>
                        <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={playPrevious}>
                        <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button variant="default" size="icon" className="h-12 w-12 rounded-full" onClick={togglePlay}>
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={playNext}>
                        <SkipForward className="h-4 w-4" />
                    </Button>
                     <Button variant={repeatMode !== 'off' ? "default" : "ghost"} size="icon" className="h-8 w-8 hidden md:inline-flex" onClick={toggleRepeat}>
                        {repeatMode === 'one' ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
                    </Button>
                </div>
                <div className="w-full hidden md:flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-8 text-right">{formatTime(progress)}</span>
                    <Slider 
                        value={[progress]}
                        max={duration}
                        onValueChange={(value) => seek(value[0])}
                        className="w-full"
                    />
                    <span className="text-xs text-muted-foreground w-8 text-left">{formatTime(duration)}</span>
                </div>
            </div>
            
            {/* Volume Controls */}
            <div className="hidden md:flex w-1/4 justify-end items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setVolume && setVolume(volume && volume > 0 ? 0 : 1)}>
                   {VolumeIcon && <VolumeIcon className="h-5 w-5" />}
                </Button>
                <Slider 
                    value={[volume ? volume * 100 : 0]}
                    onValueChange={(value) => setVolume && setVolume(value[0] / 100)}
                    className="w-[100px]"
                />
            </div>
        </footer>
    );
}
