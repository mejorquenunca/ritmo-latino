
import { AuthForm } from "@/components/auth/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="container mx-auto max-w-sm px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline text-primary">Crear Cuenta</CardTitle>
          <CardDescription>
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-primary hover:underline">
                Inicia Sesión
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" />
        </CardContent>
      </Card>
    </div>
  );
}
