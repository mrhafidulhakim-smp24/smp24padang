
"use client";

import Image from "next/image";
import { getStaff } from "./actions";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useMemo } from "react";
import type { staff as StaffSchema } from "@/lib/db/schema";
import { type InferSelectModel } from 'drizzle-orm';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

type Staff = InferSelectModel<typeof StaffSchema>;

export default function FacultyPage() {
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getStaff().then(setAllStaff);
  }, []);

  const filteredStaff = useMemo(() => {
    return allStaff
      .filter((member) => {
        if (filter === "all") return true;
        if (filter === "homeroom") return !!member.homeroomOf;
        return member.position === filter;
      })
      .filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.subject && member.subject.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [allStaff, searchTerm, filter]);

  const positions = useMemo(() => {
    const uniquePositions = [...new Set(allStaff.map(s => s.position))];
    return uniquePositions;
  }, [allStaff]);


  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Guru & Staf
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Temui para pendidik dan staf berpengalaman yang berdedikasi untuk membimbing siswa kami.
        </p>
      </div>

      <div className="my-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari nama, jabatan, atau mapel..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter berdasarkan Jabatan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Jabatan</SelectItem>
            <SelectItem value="homeroom">Wali Kelas</SelectItem>
            {positions.map(pos => (
               <SelectItem key={pos} value={pos}>{pos}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <section>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 md:grid-cols-4 lg:grid-cols-5">
          {filteredStaff.map((member) => (
            <div key={member.id} className="flex flex-col items-center text-center group">
              <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <Image 
                  src={member.imageUrl || "https://placehold.co/150x150.png"}
                  alt={member.name} 
                  fill
                  style={{objectFit: 'cover'}}
                />
              </div>
              <h3 className="mt-4 text-xl font-bold text-primary">{member.name}</h3>
              <p className="font-semibold text-base text-accent">{member.position}</p>
              <p className="text-sm text-muted-foreground">{member.subject}</p>
               {member.homeroomOf && (
                <Badge variant="secondary" className="mt-2">
                  Wali Kelas {member.homeroomOf}
                </Badge>
              )}
            </div>
          ))}
        </div>
         {filteredStaff.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <p>Tidak ada staf yang cocok dengan kriteria pencarian Anda.</p>
          </div>
        )}
      </section>
    </div>
  );
}
