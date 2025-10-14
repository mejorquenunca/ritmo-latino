
import Link from 'next/link';
import type { User } from '@/lib/placeholder-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CreatorCardProps {
  creator: User;
}

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Link href={`/profile`} className="flex flex-col items-center gap-2 group">
                    <Avatar className="h-24 w-24 border-2 border-transparent group-hover:border-primary transition-all">
                        <AvatarImage src={creator.avatar.imageUrl} alt={creator.name} />
                        <AvatarFallback>{creator.name?.charAt(0) || 'C'}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-center w-24 truncate">{creator.name}</p>
                </Link>
            </TooltipTrigger>
            <TooltipContent>
                <p>{creator.name}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  );
}
