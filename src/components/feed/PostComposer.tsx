
"use client";

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { users, type Post } from '@/lib/placeholder-data';
import { ImageIcon, Video, Send, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface PostComposerProps {
  onAddPost: (newPost: Post) => void;
}

export function PostComposer({ onAddPost }: PostComposerProps) {
  const { currentUser } = useAuth();
  
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleIconClick = (type: 'image' | 'video') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : 'video/*';
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const handleSubmit = () => {
    if ((!content && !file) || !currentUser?.profile) return;

    const newPost: Post = {
      id: `p${Date.now()}`,
      author: currentUser.profile,
      content,
      timestamp: 'Ahora mismo',
      likes: 0,
      comments: 0,
      image: filePreview && file?.type.startsWith('image/') ? {
        id: `img${Date.now()}`,
        imageUrl: filePreview,
        imageHint: 'custom upload'
      } : undefined,
      video: filePreview && file?.type.startsWith('video/') ? {
        id: `vid${Date.now()}`,
        videoUrl: filePreview,
      } : undefined,
    };

    onAddPost(newPost);
    
    // Reset form
    setContent('');
    setFile(null);
    setFilePreview(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!currentUser) {
    return (
        <Card>
            <CardContent className="p-6 text-center">
                <p>
                    <Link href="/login" className="text-primary hover:underline">Inicia sesión</Link> para publicar.
                </p>
            </CardContent>
        </Card>
    )
  }

  const userProfile = currentUser.profile;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage src={userProfile?.avatar.imageUrl} alt={userProfile?.name} />
            <AvatarFallback>{userProfile?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="w-full">
            <Textarea
              placeholder={`¿Qué estás pensando, ${userProfile?.name.split(' ')[0]}?`}
              className="mb-2 bg-background border-2 focus-visible:ring-primary"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {filePreview && (
              <div className="mb-2 relative">
                {file?.type.startsWith('image/') ? (
                  <img src={filePreview} alt="Vista previa" className="rounded-lg max-h-80 w-full object-contain" />
                ) : file?.type.startsWith('video/') ? (
                  <video src={filePreview} controls className="rounded-lg max-h-80 w-full" />
                ) : (
                  <div className="p-4 bg-muted rounded-lg text-muted-foreground">
                    Archivo seleccionado: {file?.name}
                  </div>
                )}
                <Button variant="ghost" size="icon" className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full h-7 w-7" onClick={handleRemoveFile}>
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={() => handleIconClick('image')}>
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  <span className="sr-only">Añadir imagen</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleIconClick('video')}>
                  <Video className="w-5 h-5 text-muted-foreground" />
                  <span className="sr-only">Añadir video</span>
                </Button>
              </div>
              <Button onClick={handleSubmit} disabled={!content && !file}>
                Publicar
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
