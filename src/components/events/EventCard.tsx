
"use client";

import Image from "next/image";
import Link from "next/link";
import { formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import { Calendar, MapPin, Ticket, User } from "lucide-react";
import type { Event } from "@/context/EventsContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // This effect runs on the client, where the timezone is available.
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const date = formatInTimeZone(event.date, timeZone, "eeee dd 'de' MMMM 'a las' HH:mm", { locale: es });
      setFormattedDate(date);
    } catch (error) {
      // Fallback for environments where Intl is not fully supported
      setFormattedDate(new Date(event.date).toLocaleString());
    }
  }, [event.date]);

  const LocationInfo = () => (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4" />
      <span>{event.location}</span>
    </div>
  );

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={event.image.imageUrl}
          alt={event.title}
          fill
          className="object-cover"
          data-ai-hint={event.image.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <Badge>{event.category}</Badge>
          <h3 className="text-xl font-bold font-headline text-white mt-2">{event.title}</h3>
        </div>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="capitalize">{formattedDate || "Cargando fecha..."}</span>
          </div>

          {event.mapUrl ? (
            <Link href={event.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <LocationInfo />
            </Link>
          ) : (
            <LocationInfo />
          )}

          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Organizado por {event.organizer.name}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 font-bold text-primary">
                <Ticket className="h-5 w-5"/>
                <span>{event.price === 'Gratis' ? 'Gratis' : `${event.price} €`}</span>
            </div>
            <Link href={`/events/${event.id}`} passHref>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    Ver Detalles
                </Badge>
            </Link>
        </div>
      </CardContent>
    </Card>
  );
}
