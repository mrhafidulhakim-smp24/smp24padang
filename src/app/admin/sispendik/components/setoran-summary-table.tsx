"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

export interface SetoranSummaryRow {
  id: string | number;
  name: string;
  wasteTypes: string;
  setoranCount: number;
  totalKg: number;
  totalValue: number;
}

interface SetoranSummaryTableProps {
  printTitle: string;
  nameHeader: string;
  emptyMessage: string;
  items: SetoranSummaryRow[];
  onManage: (row: SetoranSummaryRow) => void;
  onDelete: (row: SetoranSummaryRow) => void;
}

export function SetoranSummaryTable({
  printTitle,
  nameHeader,
  emptyMessage,
  items,
  onManage,
  onDelete,
}: SetoranSummaryTableProps) {
  return (
    <div className="w-full min-w-0 space-y-4">
      {/* Judul khusus Cetak / Print */}
      <div className="hidden print:block text-center mb-6">
        <h1 className="text-2xl font-bold">{printTitle}</h1>
      </div>

      {/* Desktop Table dengan Container 3D adaptif */}
      <div className="hidden lg:block w-full min-w-0 table-container-3d print:block print:overflow-visible print:border-0 print:shadow-none">
        <Table className="w-full min-w-[700px] text-sm print:min-w-0">
          <TableHeader>
            <tr className="border-b bg-muted/60">
              <TableHead className="font-semibold text-foreground py-3.5 px-4 w-[25%]">
                {nameHeader}
              </TableHead>
              <TableHead className="font-semibold text-foreground py-3.5 px-4 w-[25%]">
                Jenis Sampah
              </TableHead>
              <TableHead className="font-semibold text-foreground py-3.5 px-4 text-center w-[12%]">
                Jumlah Setoran
              </TableHead>
              <TableHead className="font-semibold text-foreground py-3.5 px-4 text-right w-[13%]">
                Total (Kg)
              </TableHead>
              <TableHead className="font-semibold text-foreground py-3.5 px-4 text-right w-[15%]">
                Total (Rp)
              </TableHead>
              <TableHead className="font-semibold text-foreground py-3.5 px-4 text-right w-[10%] print:hidden">
                Aksi
              </TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <TableCell className="font-semibold text-foreground px-4 py-3">
                    {row.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground px-4 py-3">
                    <span
                      className="inline-block max-w-[240px] truncate"
                      title={row.wasteTypes || "-"}
                    >
                      {row.wasteTypes || "-"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-medium px-4 py-3">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {row.setoranCount} setoran
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium px-4 py-3">
                    {row.totalKg.toLocaleString("id-ID", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    kg
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary px-4 py-3">
                    Rp {row.totalValue.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right px-4 py-3 print:hidden">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 btn-3d"
                        title="Kelola Setoran"
                        onClick={() => onManage(row)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 btn-3d"
                        title="Hapus"
                        onClick={() => onDelete(row)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile/Tablet Card Grid View (3D Tactile Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden print:hidden w-full">
        {items.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed p-8 text-center text-muted-foreground bg-muted/20">
            {emptyMessage}
          </div>
        ) : (
          items.map((row) => (
            <Card key={row.id} className="card-3d card-3d-hover">
              <CardContent className="space-y-3.5 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
                  <div className="min-w-0">
                    <p className="font-bold text-base text-foreground truncate">
                      {row.name}
                    </p>
                    <p
                      className="text-xs text-muted-foreground truncate mt-0.5"
                      title={row.wasteTypes || "-"}
                    >
                      {row.wasteTypes || "-"}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-primary px-2.5 py-1 rounded-md bg-primary/10">
                    Rp {row.totalValue.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm bg-muted/40 p-2.5 rounded-lg border border-border/50">
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Jumlah Setoran
                    </span>
                    <span className="font-semibold text-foreground">
                      {row.setoranCount} kali
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Total Berat
                    </span>
                    <span className="font-semibold text-foreground">
                      {row.totalKg.toLocaleString("id-ID", {
                        maximumFractionDigits: 2,
                      })}{" "}
                      kg
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full btn-3d font-medium border-b-2"
                    onClick={() => onManage(row)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1.5" /> Kelola
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full btn-3d font-medium"
                    onClick={() => onDelete(row)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
