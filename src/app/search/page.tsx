
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { users, type User } from "@/lib/placeholder-data";
import { UserCard } from "@/components/search/UserCard";
import { Loader2 } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("cat") || "all";

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(query.toLowerCase()) && user.role === 'creator'
  );

  const renderEmptyState = (type: string) => (
    <div className="text-center py-10">
      <p className="text-lg font-semibold">No se encontraron resultados para "{query}" en {type}.</p>
      <p className="text-muted-foreground">Intenta con una búsqueda diferente.</p>
    </div>
  );

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold font-headline mb-2">Resultados de Búsqueda</h1>
      <p className="text-muted-foreground mb-6">Mostrando resultados para: <span className="font-semibold text-primary">"{query}"</span></p>

      <Tabs defaultValue={category} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">Todo ({filteredUsers.length})</TabsTrigger>
          <TabsTrigger value="creators">Creadores ({filteredUsers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Creadores</h2>
              {filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUsers.map(user => <UserCard key={user.id} user={user} />)}
                </div>
              ) : renderEmptyState("Creadores")}
            </section>
          </div>
        </TabsContent>

        <TabsContent value="creators" className="mt-6">
            {filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUsers.map(user => <UserCard key={user.id} user={user} />)}
                </div>
            ) : renderEmptyState("Creadores")}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-10 w-10 animate-spin"/></div>}>
            <SearchResults />
        </Suspense>
    )
}
