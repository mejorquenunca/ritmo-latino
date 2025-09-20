
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export function GlobalSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const router = useRouter();

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchTerm)}&cat=${category}`);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex-grow w-full">
            <label htmlFor="search-input" className="sr-only">Buscar</label>
            <Input
              id="search-input"
              type="text"
              placeholder="Encuentra tu ritmo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="text-base"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo</SelectItem>
                <SelectItem value="creators">Creadores</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} aria-label="Buscar">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
