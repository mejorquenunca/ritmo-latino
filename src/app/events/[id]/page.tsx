
"use client";

import { useEvents } from "@/context/EventsContext";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Ticket, User, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";

export default function EventDetailPage() {
  const params = useParams();
  const { getEventById } = useEvents();
  const eventId = typeof params.id === 'string' ? params.id : '';
  const event = getEventById(eventId);

  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (event) {
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const date = formatInTimeZone(event.date, timeZone, "eeee dd 'de' MMMM 'a las' HH:mm", { locale: es });
        setFormattedDate(date);
      } catch (error) {
        setFormattedDate(new Date(event.date).toLocaleString());
      }
    }
  }, [event]);

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p className="text-lg">Cargando evento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card className="overflow-hidden">
        {/* Hero Image */}
        <div className="relative aspect-video w-full">
          <Image
            src={event.image.imageUrl}
            alt={`Imagen de ${event.title}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="p-6">
          <Badge>{event.category}</Badge>
          <h1 className="text-4xl font-bold font-headline text-primary mt-2">{event.title}</h1>
        </div>

        <Separator />

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold font-headline mb-3">Sobre el Evento</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {event.description || 'No hay una descripción detallada para este evento.'}
              </p>
            </div>
            <div>
                <h2 className="text-2xl font-semibold font-headline mb-3">Galería</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="relative aspect-square">
                        <Image src={event.image.imageUrl} alt="Galería de evento 1" fill className="rounded-lg object-cover" />
                    </div>
                    {/* Placeholder for more gallery images */}
                </div>
            </div>
          </div>

          {/* Key Info Sidebar */}
          <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Detalles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                     <div className="flex items-start gap-3">
                        <Calendar className="h-4 w-4 mt-1 shrink-0" />
                        <span className="capitalize">{formattedDate || "Cargando fecha..."}</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 mt-1 shrink-0" />
                        <span>{event.location}</span>
                    </div>
                     <div className="flex items-start gap-3">
                        <User className="h-4 w-4 mt-1 shrink-0" />
                        <span>Organizado por {event.organizer.name}</span>
                    </div>
                    <div className="flex items-center gap-3 font-bold text-primary">
                        <Ticket className="h-5 w-5"/>
                        <span>{event.price === 'Gratis' ? 'Gratis' : `${event.price} €`}</span>
                    </div>
                    <Separator/>
                    <Button className="w-full">
                        Comprar Entradas
                    </Button>
                </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
