
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Chrome, Loader2 } from "lucide-react";


const signupSchema = z.object({
    email: z.string().email({ message: "Por favor, introduce un email válido." }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
    displayName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
});

const loginSchema = z.object({
    email: z.string().email({ message: "Por favor, introduce un email válido." }),
    password: z.string().min(1, { message: "La contraseña es requerida." }),
});

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(mode === 'signup' ? signupSchema : loginSchema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
    },
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast({ 
        title: "¡Bienvenido a Vasílala!", 
        description: "Has iniciado sesión correctamente." 
      });
    } catch (error: any) {
      if (error.message !== 'Ventana cerrada por el usuario' && error.message !== 'Solicitud cancelada') {
        toast({ 
          variant: "destructive", 
          title: "Error de autenticación", 
          description: error.message 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof signupSchema | typeof loginSchema>) => {
    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const { email, password, displayName } = values as z.infer<typeof signupSchema>;
        await signUpWithEmail(email, password, displayName);
        toast({ 
          title: "¡Cuenta creada exitosamente!", 
          description: "Bienvenido a Vasílala. Tu cuenta se ha creado como Fan." 
        });
      } else {
        const { email, password } = values as z.infer<typeof loginSchema>;
        await signInWithEmail(email, password);
        toast({ 
          title: "¡Bienvenido de vuelta!", 
          description: "Has iniciado sesión correctamente." 
        });
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Error de autenticación", 
        description: error.message 
      });
    } finally {
        setIsLoading(false);
    }
  };
  
  const pathname = usePathname();
  const isFormDisabled = isLoading || authLoading;

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && currentUser) {
      if (pathname === '/login' || pathname === '/signup') {
        router.push('/');
      }
    }
  }, [currentUser, authLoading, router, pathname]);

  return (
    <div className="space-y-6">
       <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isFormDisabled}>
            {authLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Conectando...</> : <> <Chrome className="mr-2 h-4 w-4" /> Continuar con Google </>}
       </Button>
       
       <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
          </div>
        </div>

       <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="tu@email.com" {...field} disabled={isFormDisabled} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} disabled={isFormDisabled}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                {mode === 'signup' && (
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nombre completo</FormLabel>
                            <FormControl>
                                <Input placeholder="Tu nombre completo" {...field} disabled={isFormDisabled} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {mode === 'signup' && (
                    <div className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300">
                        <p className="font-semibold text-yellow-500 mb-2">ℹ️ Información importante:</p>
                        <p>Todas las cuentas nuevas se crean como <strong>Fan</strong>. Si eres artista, DJ, organizador de eventos, etc., podrás solicitar un upgrade después del registro.</p>
                    </div>
                )}
                <Button type="submit" className="w-full" disabled={isFormDisabled}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : (mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')}
                </Button>
            </form>
       </Form>
    </div>
  );
}
