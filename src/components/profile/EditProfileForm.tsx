
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile, type AppUser } from "@/lib/firebase";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "../ui/separator";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";

const LATIN_GENRES = [
    "Salsa",
    "Bachata",
    "Merengue",
    "Reggaetón",
    "Cumbia",
    "Tango",
    "Mambo",
    "Vallenato",
    "Rock Latino",
    "Pop Latino"
];

const profileSchema = z.object({
  name: z.string().min(2, "El nombre es requerido."),
  bio: z.string().max(160, "La biografía no puede superar los 160 caracteres.").optional(),
  location: z.string().optional(),
  website: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')),
  category: z.string().optional(),
  socials: z.object({
    facebook: z.string().optional(),
    youtube: z.string().optional(),
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
  }).optional(),
  preferences: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function EditProfileForm() {
  const { currentUser, setProfile, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser?.profile?.name || "",
      bio: currentUser?.profile?.bio || "",
      location: currentUser?.profile?.location || "",
      website: currentUser?.profile?.website || "",
      category: currentUser?.profile?.category || "",
      socials: {
          facebook: currentUser?.profile?.socials?.facebook || '',
          instagram: currentUser?.profile?.socials?.instagram || '',
          tiktok: currentUser?.profile?.socials?.tiktok || '',
          youtube: currentUser?.profile?.socials?.youtube || '',
      },
      preferences: currentUser?.profile?.preferences || [],
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    if (!currentUser) {
      toast({ variant: "destructive", title: "Error", description: "Debes iniciar sesión para actualizar tu perfil." });
      return;
    }
    
    setIsSaving(true);
    try {
      await updateUserProfile(currentUser.uid, data);
      
      const updatedProfile: AppUser = {
        ...currentUser.profile!,
        ...data,
      };
      setProfile(updatedProfile); // Update context state

      toast({ title: "¡Perfil Actualizado!", description: "Tu información ha sido guardada con éxito." });
      router.push("/profile");
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar tu perfil." });
    } finally {
        setIsSaving(false);
    }
  }
  
  if (loading) {
      return <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin"/></div>
  }
  
  const isCreator = currentUser?.profile?.role === 'creator';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Elena Rosa" {...field} />
              </FormControl>
              <FormDescription>Este es tu nombre público.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografía</FormLabel>
              <FormControl>
                <Textarea placeholder="Cuéntanos un poco sobre ti..." {...field} />
              </FormControl>
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
                <Input placeholder="Ej: Madrid, España" {...field} />
              </FormControl>
              <FormDescription>Tu ciudad nos ayudará a mostrarte eventos y personas cercanas.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />
        
        <FormField
          control={form.control}
          name="preferences"
          render={() => (
            <FormItem>
                <div className="mb-4">
                    <FormLabel className="text-base">Preferencias Musicales</FormLabel>
                    <FormDescription>
                        Selecciona tus géneros favoritos para recibir mejores recomendaciones.
                    </FormDescription>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {LATIN_GENRES.map((item) => (
                        <FormField
                        key={item}
                        control={form.control}
                        name="preferences"
                        render={({ field }) => {
                            return (
                            <FormItem
                                key={item}
                                className="flex flex-row items-start space-x-3 space-y-0"
                            >
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...(field.value || []), item])
                                        : field.onChange(
                                            field.value?.filter(
                                                (value) => value !== item
                                            )
                                        )
                                    }}
                                />
                                </FormControl>
                                <FormLabel className="font-normal">
                                {item}
                                </FormLabel>
                            </FormItem>
                            )
                        }}
                        />
                    ))}
                </div>
              <FormMessage />
            </FormItem>
          )}
        />


        {isCreator && (
            <>
                <Separator />
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Perfil de Creador</h3>
                    <p className="text-sm text-muted-foreground">
                        Esta información será visible públicamente en tu perfil.
                    </p>
                </div>
                
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría de Creador</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="musician">Músico/Cantante</SelectItem>
                          <SelectItem value="dancer">Bailarín/a</SelectItem>
                          <SelectItem value="event_organizer">Organizador de Eventos</SelectItem>
                          <SelectItem value="music_school">Academia de Música</SelectItem>
                          <SelectItem value="dance_school">Academia de Baile</SelectItem>
                          <SelectItem value="venue">Local/Sala de Fiestas</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Página Web</FormLabel>
                      <FormControl>
                        <Input placeholder="https://tuweb.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="socials.instagram" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instagram</FormLabel>
                            <FormControl><Input placeholder="usuario" {...field} /></FormControl>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="socials.tiktok" render={({ field }) => (
                        <FormItem>
                            <FormLabel>TikTok</FormLabel>
                            <FormControl><Input placeholder="@usuario" {...field} /></FormControl>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="socials.facebook" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Facebook</FormLabel>
                            <FormControl><Input placeholder="tu-pagina" {...field} /></FormControl>
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="socials.youtube" render={({ field }) => (
                        <FormItem>
                            <FormLabel>YouTube</FormLabel>
                            <FormControl><Input placeholder="@tucanal" {...field} /></FormControl>
                        </FormItem>
                    )} />
                </div>
            </>
        )}

        <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
            Guardar Cambios
        </Button>
      </form>
    </Form>
  );
}

    