import Image from 'next/image';
import { Heart, MessageCircle, Send } from 'lucide-react';
import type { Post } from '@/lib/placeholder-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <Avatar>
          <AvatarImage src={post.author.avatar.imageUrl} alt={post.author.name} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{post.author.name}</p>
          <p className="text-xs text-muted-foreground">{post.timestamp}</p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <p className="px-4 pb-4 text-sm">{post.content}</p>
        {post.image && (
          <div className="relative aspect-[3/2] w-full">
            <Image
              src={post.image.imageUrl}
              alt="Imagen de la publicación"
              fill
              className="object-cover"
              data-ai-hint={post.image.imageHint}
            />
          </div>
        )}
        {post.video && (
          <div className="aspect-video w-full bg-black">
             <video 
              src={post.video.videoUrl} 
              controls 
              className="w-full h-full"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2 flex justify-between">
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <Send className="h-4 w-4" />
          <span className="sr-only">Compartir</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
