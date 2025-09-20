
"use client";

import { useMemo, useState } from "react";
import { users, type User, type CreatorCategory } from "@/lib/placeholder-data";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CreatorCard } from "./CreatorCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categoryLabels: Record<CreatorCategory, string> = {
    musician: 'Músicos',
    dancer: 'Bailarines',
    event_organizer: 'Organizadores',
    music_school: 'Academias de Música',
    dance_school: 'Academias de Baile',
    venue: 'Locales'
};

export function CreatorsCarousel() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const creators = useMemo(() => {
    return users.filter(user => user.role === 'creator');
  }, []);

  const categories = useMemo(() => {
    const allCategories = creators.map(creator => creator.category).filter(Boolean) as CreatorCategory[];
    return Array.from(new Set(allCategories));
  }, [creators]);

  const filteredCreators = useMemo(() => {
    if (selectedCategory === "all") {
      return creators;
    }
    return creators.filter(creator => creator.category === selectedCategory);
  }, [creators, selectedCategory]);

  return (
    <div className="space-y-4">
      <div className="w-full max-w-xs">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map(category => (
                      <SelectItem key={category} value={category}>
                          {categoryLabels[category] || category}
                      </SelectItem>
                  ))}
              </SelectContent>
          </Select>
      </div>

      {filteredCreators.length > 0 ? (
        <Carousel 
            opts={{
                align: "start",
                loop: filteredCreators.length > 5,
            }}
            className="w-full"
        >
            <CarouselContent className="-ml-1">
            {filteredCreators.map((creator) => (
                <CarouselItem key={creator.id} className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 pl-2">
                    <CreatorCard creator={creator} />
                </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious className="ml-12"/>
            <CarouselNext className="mr-12"/>
        </Carousel>
      ) : (
        <div className="text-center py-10 border rounded-lg bg-card">
          <p className="text-lg font-semibold">No se encontraron creadores</p>
          <p className="text-muted-foreground">No hay creadores para la categoría seleccionada.</p>
        </div>
      )}
    </div>
  );
}
