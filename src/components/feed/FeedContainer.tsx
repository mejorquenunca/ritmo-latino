'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useFeedStore } from '@/stores/feedStore';
import { VideoPost } from './VideoPost';
import { FeedNavigation } from './FeedNavigation';
import { VasílalaLoader } from '@/components/ui/animations';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

export const FeedContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const {
    posts,
    loading,
    error,
    hasMore,
    currentIndex,
    setCurrentIndex,
    loadMorePosts,
    refreshFeed,
  } = useFeedStore();

  // Initialize feed
  useEffect(() => {
    if (posts.length === 0) {
      refreshFeed();
    }
  }, [posts.length, refreshFeed]);

  // Handle scroll/swipe navigation
  const handleScroll = useCallback((direction: 'up' | 'down') => {
    if (direction === 'down' && currentIndex < posts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      
      // Load more posts when near the end
      if (currentIndex >= posts.length - 3 && hasMore && !loading) {
        loadMorePosts();
      }
    } else if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, posts.length, hasMore, loading, setCurrentIndex, loadMorePosts]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handleScroll('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleScroll('down');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleScroll]);

  // Touch/swipe navigation
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe) {
      handleScroll('down');
    } else if (isDownSwipe) {
      handleScroll('up');
    }
  };

  // Wheel navigation for desktop
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (e.deltaY > 0) {
      handleScroll('down');
    } else {
      handleScroll('up');
    }
  }, [handleScroll]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Error state
  if (error && posts.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error al cargar el feed</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button 
            onClick={refreshFeed}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading && posts.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <VasílalaLoader size="lg" text="Cargando videos..." />
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h2 className="text-xl font-bold mb-2">No hay videos disponibles</h2>
          <p className="text-gray-400 mb-6">
            Sé el primero en compartir contenido increíble
          </p>
          <Button 
            onClick={refreshFeed}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <FeedNavigation />
      <div 
        ref={containerRef}
        className="relative h-screen overflow-hidden bg-black"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
      {/* Video posts */}
      <div 
        className="relative h-full transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(-${currentIndex * 100}vh)`,
        }}
      >
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="absolute top-0 left-0 w-full h-full"
            style={{
              transform: `translateY(${index * 100}vh)`,
            }}
          >
            <VideoPost
              post={post}
              isActive={index === currentIndex}
              onVideoClick={() => {
                // Handle video click (pause/play, open details, etc.)
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation indicators */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
        {posts.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, index) => {
          const actualIndex = Math.max(0, currentIndex - 2) + index;
          return (
            <button
              key={actualIndex}
              onClick={() => setCurrentIndex(actualIndex)}
              className={`w-2 h-8 rounded-full transition-all duration-200 ${
                actualIndex === currentIndex
                  ? 'bg-yellow-500'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          );
        })}
      </div>

      {/* Loading indicator for more posts */}
      {loading && posts.length > 0 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <VasílalaLoader size="sm" />
        </div>
      )}

      {/* Refresh button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={refreshFeed}
        className="absolute top-4 left-4 text-white hover:bg-white/20"
        disabled={loading}
      >
        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
      </Button>

      {/* Instructions overlay (show on first visit) */}
      {currentIndex === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white/80 pointer-events-none">
          <div className="bg-black/50 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm mb-2">Desliza hacia arriba para ver más videos</p>
            <p className="text-xs text-gray-400">
              ↑ ↓ Flechas del teclado • Rueda del mouse • Deslizar
            </p>
          </div>
        </div>
      )}
    </div>
    </>
  );
};