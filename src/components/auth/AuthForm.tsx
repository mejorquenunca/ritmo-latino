
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { auth, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Chrome, Loader2 } from "lucide-react";


const signupSchema = z.object({
    email: z.string().email({ message: "Por favor, introduce un email válido." }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
    role: z.enum(["fan", "creator"], { required_error: "Debes seleccionar un rol." }),
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
      role: "fan" as "fan" | "creator",
    },
  });

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        toast({ variant: "destructive", title: "Error de autenticación", description: error.message });
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof signupSchema | typeof loginSchema>) => {
    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const { email, password } = values as z.infer<typeof signupSchema>;
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        const { email, password } = values as z.infer<typeof loginSchema>;
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error de autenticación", description: error.message });
    } finally {
        setIsLoading(false);
    }
  };
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && currentUser) {
        if(currentUser.profile && (currentUser.profile.name === 'Usuario' || !currentUser.profile.name)) {
            if (pathname !== '/profile/edit') {
              router.push('/profile/edit');
            }
        } else if (pathname === '/login' || pathname === '/signup') {
            router.push('/');
        }
    }
  }, [currentUser, authLoading, router]);

  const isFormDisabled = isLoading || authLoading;
  const pathname = usePathname();

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
                    name="role"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>¿Cómo quieres unirte a Ritmo Latino?</FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                                disabled={isFormDisabled}
                                >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="fan" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Como Fan
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="creator" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Como Creador (Músico, Organizador, etc.)
                                    </FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                )}
                <Button type="submit" className="w-full" disabled={isFormDisabled}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : (mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')}
                </Button>
            </form>
       </Form>
    </div>
  );
}
