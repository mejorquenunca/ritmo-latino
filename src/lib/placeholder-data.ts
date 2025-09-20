
import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    // Fallback to a default image if not found, to prevent crashes.
    const defaultImage = PlaceHolderImages.find(img => img.id === 'avatar1');
    if (!defaultImage) throw new Error('Default placeholder image is missing.');
    return defaultImage;
  }
  return image;
};

export type CreatorCategory = 'musician' | 'dancer' | 'music_school' | 'dance_school' | 'venue' | 'event_organizer';

export interface User {
  id: string;
  name: string;
  avatar: ImagePlaceholder;
  cover?: ImagePlaceholder;
  bio?: string;
  role: 'fan' | 'creator';
  category?: CreatorCategory;
  location?: string;
  website?: string;
  socials?: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    tiktok?: string;
  };
  preferences?: string[];
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: ImagePlaceholder;
  video?: {
    id: string;
    videoUrl: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
}

export type EventCategory = "Concierto" | "Taller/Workshop" | "Social/Fiesta" | "Curso" | "Otro";

export interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  price: number | 'Gratis';
  organizer: User;
  image: ImagePlaceholder;
  category: EventCategory | string;
}

export const users: User[] = [
  { id: 'u1', name: 'Carlos Santana', avatar: getImage('avatar1'), role: 'creator', category: 'musician', bio: 'Guitarrista y amante de la salsa dura.', location: 'Madrid, España', preferences: ['Salsa', 'Rock Latino'] },
  { id: 'u2', name: 'Sofia Reyes', avatar: getImage('avatar2'), role: 'creator', category: 'musician', bio: 'Cantante, bailarina y reina de la bachata. 💃', location: 'Barcelona, España', preferences: ['Bachata', 'Pop Latino'] },
  { id: 'u3', name: 'Juan Luis Guerra', avatar: getImage('avatar3'), role: 'creator', category: 'musician', bio: 'La leyenda del merengue y la bachata.', location: 'Santo Domingo, República Dominicana', preferences: ['Merengue', 'Bachata'] },
  { id: 'u4', name: 'Elena Rosa', avatar: getImage('avatar4'), role: 'fan', bio: 'Bailarina de corazón.', location: 'Madrid, España', preferences: ['Salsa', 'Bachata', 'Cumbia'] },
  { id: 'u5', name: 'Marco Antonio', avatar: getImage('avatar5'), role: 'fan', location: 'Valencia, España' },
  { id: 'u6', name: 'DJ Sabor', avatar: getImage('avatar6'), role: 'creator', category: 'musician', bio: 'Mezclando los mejores temas latinos.', location: 'Madrid, España' },
  { id: 'u7', name: 'La Vida Loca', avatar: getImage('avatar7'), role: 'creator', category: 'event_organizer', bio: 'Promotora de eventos.', location: 'Barcelona, España' },
  { id: 'u8', name: 'Ritmo Dance Studio', avatar: getImage('avatar8'), role: 'creator', category: 'dance_school', bio: 'La mejor escuela de baile de la ciudad.', location: 'Madrid, España' },
];

export const posts: Post[] = [
  {
    id: 'p1',
    author: users[3],
    content: '¡Noche de salsa en la ciudad! La pasamos increíble. ¿Quién se apunta para la próxima? 🔥 #SalsaNight #LatinDance',
    image: getImage('post1'),
    timestamp: 'Hace 2h',
    likes: 125,
    comments: 12,
  },
  {
    id: 'p2',
    author: users[1],
    content: 'Recordando este atardecer bailando bachata en la playa. La música y el mar, la combinación perfecta. 🌅🎶',
    image: getImage('post2'),
    timestamp: 'Hace 1d',
    likes: 840,
    comments: 56,
  },
  {
    id: 'p3',
    author: users[0],
    content: 'Un honor compartir escenario con estos musicazos. ¡La energía del público fue electrizante! Gracias a todos.',
    image: getImage('post3'),
    timestamp: 'Hace 3d',
    likes: 2300,
    comments: 150,
  },
];

export const events: Event[] = [
    {
      id: 'e1',
      title: 'Noche de Salsa y Estrellas',
      date: new Date(new Date().setDate(new Date().getDate() + 7)),
      location: 'Salón de Baile La Clave, Madrid, España',
      price: 15,
      organizer: users[6],
      image: getImage('event1'),
      category: 'Social/Fiesta',
    },
    {
      id: 'e2',
      title: 'Taller de Bachata Dominicana',
      date: new Date(new Date().setDate(new Date().getDate() + 14)),
      location: 'Ritmo Dance Studio, Madrid, España',
      price: 25,
      organizer: users[7],
      image: getImage('event2'),
      category: 'Taller/Workshop',
    },
    {
      id: 'e3',
      title: 'Juan Luis Guerra en Concierto',
      date: new Date(new Date().setDate(new Date().getDate() + 30)),
      location: 'Estadio Nacional, Santo Domingo, República Dominicana',
      price: 80,
      organizer: users[2],
      image: getImage('event3'),
      category: 'Concierto',
    },
    {
      id: 'e4',
      title: 'Fiesta de Cumbia en Barcelona',
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      location: 'Sala Apolo, Barcelona, España',
      price: 20,
      organizer: users[6],
      image: getImage('event1'), // Reusing image for example
      category: 'Social/Fiesta',
    }
];

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverArt: ImagePlaceholder;
  audioUrl: string;
}

export const songs: Song[] = [
  { id: 's1', title: 'Guantanamera', artist: 'Celia Cruz', album: 'La Reina de la Salsa', duration: 250, coverArt: getImage('song_cover1'), audioUrl: 'https://storage.googleapis.com/test-utils-public/music/guantanamera.mp3' },
  { id: 's2', title: 'Oye Como Va', artist: 'Tito Puente', album: 'El Rey del Timbal', duration: 275, coverArt: getImage('song_cover2'), audioUrl: 'https://storage.googleapis.com/test-utils-public/music/oye-como-va.mp3' },
  { id: 's3', title: 'La Bilirrubina', artist: 'Juan Luis Guerra', album: 'Bachata Rosa', duration: 230, coverArt: getImage('song_cover3'), audioUrl: 'https://storage.googleapis.com/test-utils-public/music/la-bilirrubina.mp3' },
  { id: 's4', title: '1, 2, 3', artist: 'Sofía Reyes ft. Jason Derulo & De La Ghetto', album: 'Louder!', duration: 201, coverArt: getImage('song_cover4'), audioUrl: 'https://storage.googleapis.com/test-utils-public/music/1-2-3.mp3' },
  { id: 's5', title: 'Vivir Mi Vida', artist: 'Marc Anthony', album: '3.0', duration: 252, coverArt: getImage('song_cover5'), audioUrl: 'https://storage.googleapis.com/test-utils-public/music/vivir-mi-vida.mp3' },
];

export interface Playlist {
  id: string;
  name: string;
  ownerId: string;
  songIds: string[];
}

export const playlists: Playlist[] = [
  { id: 'pl1', name: 'Salsa Para Bailar', ownerId: 'u4', songIds: ['s1', 's2'] },
  { id: 'pl2', name: 'Favoritos de Bachata', ownerId: 'u4', songIds: ['s3'] },
  { id: 'pl3', name: 'Latin Pop Hits', ownerId: 'u2', songIds: ['s4', 's5'] }, // Collaborative
];

    