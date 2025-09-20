
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, Send, Sparkles, XCircle } from "lucide-react";
import { useEvents, type Event } from "@/context/EventsContext";
import { useToast } from "@/hooks/use-toast";
import { users } from "@/lib/placeholder-data";
import { useState } from "react";
import Image from "next/image";
import { enhanceImage } from "@/ai/flows/enhance-image-flow";
import { Textarea } from "../ui/textarea";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const eventSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres."),
  description: z.string().max(2000, "La descripción no puede superar los 2000 caracteres.").optional(),
  location: z.string().min(5, "La ubicación debe tener al menos 5 caracteres."),
  mapUrl: z.string().url({ message: "Por favor, introduce una URL válida." }).optional().or(z.literal('')),
  date: z.date({
    required_error: "Se requiere una fecha para el evento.",
  }),
  hour: z.string({ required_error: "La hora es requerida." }),
  minute: z.string({ required_error: "Los minutos son requeridos." }),
  totalTickets: z.coerce.number().min(1, "Debe haber al menos 1 entrada disponible."),
  price: z.coerce.number().optional(),
  isFree: z.boolean().default(false),
  category: z.string({ required_error: "Debes seleccionar una categoría." }),
  customCategory: z.string().optional(),
  image: z.any()
    .refine((files) => files?.length > 0 ? files?.[0]?.size <= MAX_FILE_SIZE : true, `El tamaño máximo es 5MB.`)
    .refine(
      (files) => files?.length > 0 ? ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type) : true,
      "Solo se aceptan formatos .jpg, .jpeg, .png y .webp."
    ).optional(),
}).refine(data => !data.isFree ? data.price !== undefined && data.price > 0 : true, {
  message: "El precio debe ser mayor a 0 si el evento no es gratis.",
  path: ["price"],
}).refine(data => data.category !== "Otro..." || (data.customCategory && data.customCategory.length > 2), {
  message: "Debes especificar la categoría si seleccionas 'Otro'.",
  path: ["customCategory"],
});

type EventFormValues = z.infer<typeof eventSchema>;

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minutes = ['00', '15', '30', '45'];


export function CreateEventForm() {
  const router = useRouter();
  const { addEvent } = useEvents();
  const { toast } = useToast();
  const currentUser = users.find(u => u.role === 'event_organizer') || users[6];
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      mapUrl: "",
      isFree: false,
      price: 0,
      customCategory: "",
      totalTickets: 1,
    },
  });

  const watchCategory = form.watch("category");
  const watchIsFree = form.watch("isFree");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setImagePreview(null);
    }
  };

  const removeImage = () => {
    form.setValue('image', null, { shouldValidate: true });
    setImagePreview(null);
  }

  const handleEnhanceImage = async () => {
    if (!imagePreview) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, sube una imagen primero.",
      });
      return;
    }
    
    setIsEnhancing(true);
    try {
      const result = await enhanceImage({ imageDataUri: imagePreview });
      setImagePreview(result.enhancedImageDataUri);

      // Convert the enhanced base64 image back to a File object to keep form data consistent
      const response = await fetch(result.enhancedImageDataUri);
      const blob = await response.blob();
      const enhancedFile = new File([blob], "enhanced-image.png", { type: blob.type });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(enhancedFile);
      form.setValue('image', dataTransfer.files, { shouldValidate: true });
      
      toast({
        title: "¡Imagen Mejorada!",
        description: "Tu imagen ha sido mejorada con IA.",
      });
    } catch (error) {
      console.error("Error enhancing image:", error);
      toast({
        variant: "destructive",
        title: "Error de IA",
        description: "No se pudo mejorar la imagen en este momento.",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  function onSubmit(data: EventFormValues) {
    const finalCategory = data.category === "Otro..." ? data.customCategory! : data.category;
    
    const combinedDate = new Date(data.date);
    combinedDate.setHours(parseInt(data.hour, 10));
    combinedDate.setMinutes(parseInt(data.minute, 10));
    
    const newEvent: Event = {
        id: `evt-${Date.now()}`,
        title: data.title,
        description: data.description,
        date: combinedDate,
        location: data.location,
        mapUrl: data.mapUrl || undefined,
        price: data.isFree ? 'Gratis' : data.price!,
        organizer: currentUser,
        image: {
            id: `evt-img-${Date.now()}`,
            imageUrl: imagePreview || "https://picsum.photos/seed/event_fallback/400/500",
            imageHint: 'event poster',
            description: `Poster for ${data.title}`
        },
        category: finalCategory,
    };

    addEvent(newEvent);
    
    toast({
      title: "¡Evento Creado!",
      description: `"${data.title}" ha sido publicado con éxito.`,
    });
    router.push(`/events/${newEvent.id}`);
  }
  
  const imageRef = form.register("image");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título del Evento</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Gran Concierto de Salsa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción Detallada</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe tu evento: ¿qué lo hace especial?, ¿cuál es el programa?, ¿hay código de vestimenta?, etc."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Esta descripción aparecerá en la página de detalles del evento.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Estadio Nacional, Sala La Clave" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="mapUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enlace de Google Maps (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://maps.app.goo.gl/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
                <FormItem className="flex flex-col md:col-span-1">
                <FormLabel>Fecha</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(field.value, "PPP", { locale: es })
                        ) : (
                            <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="hour"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="HH" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {hours.map(hour => <SelectItem key={hour} value={hour}>{hour}</SelectItem>)}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="minute"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Minutos</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="MM" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {minutes.map(min => <SelectItem key={min} value={min}>{min}</SelectItem>)}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="totalTickets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total de Entradas</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100" {...field} onChange={event => field.onChange(+event.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio por Entrada (€)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="25.50" {...field} disabled={watchIsFree} onChange={event => field.onChange(+event.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                    <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                            form.setValue('price', 0);
                        }
                    }}
                    />
                </FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel>
                    Marcar si el evento es Gratis
                    </FormLabel>
                    <FormDescription>
                    Si marcas esta opción, el precio se establecerá en 0.
                    </FormDescription>
                </div>
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría para tu evento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Concierto">Concierto</SelectItem>
                  <SelectItem value="Taller/Workshop">Taller/Workshop</SelectItem>
                  <SelectItem value="Social/Fiesta">Social/Fiesta</SelectItem>
                  <SelectItem value="Curso">Curso</SelectItem>
                  <SelectItem value="Otro...">Otro...</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {watchCategory === "Otro..." && (
            <FormField
            control={form.control}
            name="customCategory"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Especifica la Categoría</FormLabel>
                <FormControl>
                    <Input placeholder="Ej: Competencia de Baile" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        )}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen del Evento</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...imageRef}
                  onChange={(e) => {
                    handleImageChange(e);
                    field.onChange(e.target.files);
                  }}
                />
              </FormControl>
              <FormMessage />

              {imagePreview && (
                <div className="relative w-full max-w-sm mx-auto aspect-[4/5] mt-4">
                  <Image
                    src={imagePreview}
                    alt="Vista previa del evento"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8"
                    onClick={removeImage}
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
              )}

              <div className="mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  disabled={!imagePreview || isEnhancing}
                  onClick={handleEnhanceImage}
                >
                  <Sparkles
                    className={`mr-2 h-4 w-4 ${
                      isEnhancing ? "animate-spin" : ""
                    }`}
                  />
                  {isEnhancing ? "Mejorando..." : "Mejorar con IA"}
                </Button>
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          Publicar Evento <Send className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
