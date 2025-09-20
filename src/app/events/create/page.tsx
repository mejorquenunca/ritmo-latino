
import { CreateEventForm } from "@/components/events/CreateEventForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateEventPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline text-primary">Crea tu Próximo Evento</CardTitle>
          <CardDescription>
            Completa el siguiente formulario para dar a conocer tu evento a toda la comunidad de Ritmo Latino.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateEventForm />
        </CardContent>
      </Card>
    </div>
  );
}
