
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditProfilePage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline text-primary">Completa tu Perfil</CardTitle>
          <CardDescription>
            ¡Bienvenido a Ritmo Latino! Ayúdanos a conocerte mejor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
