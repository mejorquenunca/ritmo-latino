
"use client";

import { useMemo, useState } from "react";
import { useEvents } from "@/context/EventsContext";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { EventCard } from "./EventCard";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";

export function VacilalaCarousel() {
  const { events } = useEvents();
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const categories = useMemo(() => {
    const allCategories = events.map(event => event.category);
    return ["Todos", ...Array.from(new Set(allCategories))];
  }, [events]);

  const filteredAndSortedEvents = useMemo(() => {
    const userLocation = null; // Simplificado para build

    // 1. Filter by category
    const filtered = selectedCategory === "Todos"
      ? events
      : events.filter(event => event.category === selectedCategory);

    // 2. Sort by location if user is logged in
    if (userLocation) {
        return filtered.sort((a, b) => {
            const aIsLocal = a.location.includes(userLocation);
            const bIsLocal = b.location.includes(userLocation);
            if (aIsLocal && !bIsLocal) return -1; // a comes first
            if (!aIsLocal && bIsLocal) return 1;  // b comes first
            return 0; // maintain original order
        });
    }

    return filtered;
  }, [events, selectedCategory, currentUser]);

  return (
    <div className="space-y-6">
       <div>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary sr-only">Próximos Eventos</h3>
        {filteredAndSortedEvents.length > 0 ? (
           <Carousel 
                opts={{
                    align: "start",
                    loop: filteredAndSortedEvents.length > 1,
                }}
                className="w-full"
            >
                <CarouselContent>
                {filteredAndSortedEvents.map((event) => (
                    <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                        <EventCard event={event} />
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12"/>
                <CarouselNext className="mr-12"/>
            </Carousel>
        ) : (
            <div className="text-center py-10 border rounded-lg bg-card">
              <p className="text-lg font-semibold">No se encontraron eventos</p>
              <p className="text-muted-foreground">No hay eventos para la categoría "{selectedCategory}".</p>
          </div>
        )}
      </div>
    </div>
  );
}

    