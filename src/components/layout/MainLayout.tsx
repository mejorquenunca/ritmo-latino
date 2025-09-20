
"use client";

import type { ReactNode } from 'react';
import { Header } from './Header';
import { FooterPlayer } from '../tson/FooterPlayer';

export function MainLayout({ children }: { children: ReactNode }) {
  // We add padding to the bottom of the main content to avoid being overlapped 
  // by the mobile nav and the music player.
  const mainStyle: React.CSSProperties = {
     // Space for mobile nav (4rem) + music player (6rem or 96px)
     paddingBottom: 'calc(4rem + 96px)', 
  };
  const mobileOnlyStyle: React.CSSProperties = {
    paddingBottom: 'calc(4rem + 96px)',
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* 
        The pb-[160px] is for desktop (player height 96px)
        The md:pb-24 is to override for mobile (nav 64px + player 96px = 160px)
        This seems counter-intuitive, but padding is applied differently with flex-grow
      */}
      <main className="flex-grow pb-40 md:pb-[calc(4rem+96px)]">
        {children}
      </main>
      <FooterPlayer />
    </div>
  );
}

    