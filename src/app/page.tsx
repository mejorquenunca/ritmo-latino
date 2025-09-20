
"use client";

import { useState } from 'react';
import { PostComposer } from '@/components/feed/PostComposer';
import { FeedList } from '@/components/feed/FeedList';
import { Separator } from '@/components/ui/separator';
import { posts as initialPosts, type Post } from '@/lib/placeholder-data';
import { VacilalaCarousel } from '@/components/events/VacilalaCarousel';
import { PlaylistCarousel } from '@/components/tson/PlaylistCarousel';
import { CreatorsCarousel } from '@/components/creators/CreatorsCarousel';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const handleAddPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
      
      <section aria-labelledby="vacilala-heading" className="space-y-8">
          <h2 id="vacilala-heading" className="text-2xl font-bold font-headline mb-4">Vacílala</h2>
          <VacilalaCarousel />
      </section>

      <Separator className="my-8" />

      <section aria-labelledby="playlists-heading" className="space-y-8">
        <h2 id="playlists-heading" className="text-2xl font-bold font-headline mb-4">Playlists de la Comunidad</h2>
        <PlaylistCarousel />
      </section>

      <Separator className="my-8" />

      <section aria-labelledby="creators-heading" className="space-y-8">
        <h2 id="creators-heading" className="text-2xl font-bold font-headline mb-4">Creadores</h2>
        <CreatorsCarousel />
      </section>

      <Separator className="my-8" />

      <section aria-labelledby="crea-tu-ritmo-heading" className="space-y-6 max-w-2xl mx-auto">
        <h2 id="crea-tu-ritmo-heading" className="text-2xl font-bold font-headline mb-4">Crea tu Ritmo</h2>
        <PostComposer onAddPost={handleAddPost} />
        <FeedList posts={posts} />
      </section>
    </div>
  );
}
