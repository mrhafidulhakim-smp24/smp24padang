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
import { MONTHS } from "./constants";

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
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-md print:hidden">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      )}
      <CardHeader className="print:hidden">
        <div className="flex items-center justify-between print:hidden">
          <div>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(v) => onMonthChange(parseInt(v))}
            >
              <SelectTrigger className="w-40">
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
              <SelectTrigger className="w-28">
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

            <Button onClick={onAddNew}>
              <Plus className="mr-2 h-4 w-4" /> {addNewLabel}
            </Button>

            <Button onClick={onPrint}>
              <Printer className="mr-2 h-4 w-4" /> Cetak
            </Button>
          </div>
        </div>
      </CardHeader>
    </>
  );
}
