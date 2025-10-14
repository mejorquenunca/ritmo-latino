
"use client";

import Image from 'next/image';
import type { User } from '@/lib/placeholder-data';
import { posts as allPosts } from '@/lib/placeholder-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Link as LinkIcon, UserPlus, Star, Users, Settings } from 'lucide-react';
import { FeedList } from '../feed/FeedList';
import { PostComposer } from '../feed/PostComposer';
import { Separator } from '../ui/separator';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface ProfileCardProps {
  user: User;
  isCurrentUser?: boolean;
}

export function ProfileCard({ user, isCurrentUser = false }: ProfileCardProps) {
  const { currentUser } = useAuth();
  const coverImage = user.cover || PlaceHolderImages.find(img => img.id === 'cover1');
  const [posts, setPosts] = useState(() => allPosts.filter(p => p.author.id === user.id));

  const handleAddPost = (newPost: any) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };
  
  const canPost = isCurrentUser || (currentUser?.profile?.role === 'creator');

  return (
    <div className="space-y-8">
      <div className="rounded-lg overflow-hidden bg-card border">
        <div className="relative h-48 md:h-64 w-full">
          {coverImage && (
              <Image 
                  src={coverImage.imageUrl}
                  alt="Imagen de portada"
                  fill
                  className="object-cover"
                  data-ai-hint={coverImage.imageHint}
              />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10"></div>
        </div>
        
        <div className="px-6 pb-6 -mt-20 md:-mt-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end">
            <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-background shrink-0">
              <AvatarImage src={user.avatar.imageUrl} alt={user.name} />
              <AvatarFallback className="text-4xl">{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-2xl md:text-3xl font-bold font-headline">{user.name}</h1>
                <Badge variant={user.role === 'creator' ? 'default' : 'secondary'} className="gap-1.5 pl-2 pr-2.5">
                    {user.role === 'creator' ? <Star className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
                    <span>{user.role === 'creator' ? 'Creador' : 'Fan'}</span>
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-1">{user.bio || 'Amante de la música y el baile.'}</p>
            </div>
            <div className="flex-grow flex justify-center md:justify-end mt-4 md:mt-0 space-x-2">
                {isCurrentUser ? (
                    <Button variant="outline" asChild>
                      <Link href="/profile/edit">
                        <Settings className="mr-2 h-4 w-4"/>
                        Editar Perfil
                      </Link>
                    </Button>
                ) : (
                    <>
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4"/>
                        Seguir
                    </Button>
                    <Button variant="outline">
                        <Mail className="mr-2 h-4 w-4"/>
                        Mensaje
                    </Button>
                    </>
                )}
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground justify-center md:justify-start md:ml-[calc(9rem+1.5rem)]">
              {user.website && (
                <div className="flex items-center gap-1.5">
                    <LinkIcon className="h-4 w-4"/>
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{user.website.replace(/https?:\/\//, '')}</a>
                </div>
              )}
          </div>
        </div>
      </div>

      <Separator />

      <div className='max-w-2xl mx-auto'>
        { canPost &&
            <section aria-labelledby='post-composer-heading' className="mb-8">
                <h2 id='post-composer-heading' className='sr-only'>Crear una publicación</h2>
                <PostComposer onAddPost={handleAddPost} />
            </section>
        }
        <section aria-labelledby='user-feed-heading'>
          <h2 id='user-feed-heading' className="text-2xl font-bold font-headline mb-4 text-primary">Actividad Reciente</h2>
          <FeedList posts={posts} />
        </section>
      </div>

    </div>
  );
}
