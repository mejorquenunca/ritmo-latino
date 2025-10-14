
"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
// import { events as initialEvents, type User } from '@/lib/placeholder-data';

export interface Event {
    id: string;
    title: string;
    description?: string;
    date: Date;
    location: string;
    mapUrl?: string;
    price: number | 'Gratis';
    organizer: { id: string; name: string; avatar: { imageUrl: string; }; };
    image: { id: string; url: string; alt: string; };
    category: string;
}

interface EventsContextType {
    events: Event[];
    addEvent: (newEvent: Event) => void;
    getEventById: (id: string) => Event | undefined;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
    const [events, setEvents] = useState<Event[]>([]);

    const addEvent = useCallback((newEvent: Event) => {
        setEvents(prev => [newEvent, ...prev]);
    }, []);

    const getEventById = useCallback((id: string) => {
        return events.find(event => event.id === id);
    }, [events]);

    const value = { events, addEvent, getEventById };

    return (
        <EventsContext.Provider value={value}>
            {children}
        </EventsContext.Provider>
    );
}

export function useEvents() {
    const context = useContext(EventsContext);
    if (context === undefined) {
        throw new Error("useEvents must be used within a EventsProvider");
    }
    return context;
}
