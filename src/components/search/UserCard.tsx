
import Image from 'next/image';
import type { User } from '@/lib/placeholder-data';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Star, Music, Building, School, Mic, User as UserIcon } from 'lucide-react';

interface UserCardProps {
  user: User;
}

const categoryDetails = {
    musician: { icon: Mic, label: 'Músico' },
    dancer: { icon: UserIcon, label: 'Bailarín' },
    music_school: { icon: School, label: 'Escuela de Música' },
    dance_school: { icon: School, label: 'Escuela de Baile' },
    venue: { icon: Building, label: 'Local' },
    event_organizer: { icon: Star, label: 'Organizador' },
};


export function UserCard({ user }: UserCardProps) {
  const detail = user.category ? categoryDetails[user.category] : null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/profile`} className="block">
        <div className="p-4">
            <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar.imageUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <h3 className="font-bold font-headline text-lg">{user.name}</h3>
                    {detail && (
                         <Badge variant="secondary" className="mt-1">
                            <detail.icon className="h-3 w-3 mr-1.5" />
                            {detail.label}
                        </Badge>
                    )}
                </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 h-10">{user.bio}</p>
        </div>
      </Link>
    </Card>
  );
}
