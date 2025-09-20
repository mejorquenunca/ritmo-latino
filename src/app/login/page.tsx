
import { AuthForm } from "@/components/auth/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container mx-auto max-w-sm px-4 py-8">
       <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline text-primary">Iniciar Sesión</CardTitle>
          <CardDescription>
            ¿No tienes una cuenta?{' '}
            <Link href="/signup" className="text-primary hover:underline">
                Regístrate
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="login" />
        </CardContent>
      </Card>
    </div>
  );
}
