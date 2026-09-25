"use client";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Printer } from "lucide-react";
import { MONTHS } from "./types";

interface SetoranHeaderProps {
  title: string;
  subtitle: string;
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  addNewLabel: string;
  onAddNew: () => void;
  onPrint: () => void;
  loading?: boolean;
}

export function SetoranHeader({
  title,
  subtitle,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  addNewLabel,
  onAddNew,
  onPrint,
  loading,
}: SetoranHeaderProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2020 + 6 },
    (_, i) => 2020 + i,
  );

  return (
    <>
      {loading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-xl print:hidden">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}
      <CardHeader className="print:hidden p-4 sm:p-6 border-b border-border/60">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-center">
          <div className="xl:col-span-5 space-y-1">
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          <div className="xl:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-center w-full">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(v) => onMonthChange(parseInt(v))}
            >
              <SelectTrigger className="w-full h-10 border-b-2 border-b-border font-medium">
                <SelectValue placeholder="Pilih bulan" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, idx) => (
                  <SelectItem key={m} value={(idx + 1).toString()}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(selectedYear)}
              onValueChange={(v) => onYearChange(parseInt(v))}
            >
              <SelectTrigger className="w-full h-10 border-b-2 border-b-border font-medium">
                <SelectValue placeholder="Pilih tahun" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={onAddNew}
              className="w-full h-10 btn-3d font-medium"
            >
              <Plus className="mr-1.5 h-4 w-4" /> {addNewLabel}
            </Button>

            <Button
              onClick={onPrint}
              variant="outline"
              className="w-full h-10 btn-3d font-medium border-b-2 border-b-border"
            >
              <Printer className="mr-1.5 h-4 w-4" /> Cetak
            </Button>
          </div>
        </div>
      </CardHeader>
    </>
  );
}
