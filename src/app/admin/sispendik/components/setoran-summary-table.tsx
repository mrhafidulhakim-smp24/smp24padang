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
    <>
      <div className="hidden print:block text-center mb-4">
        <h1 className="text-xl font-bold">{printTitle}</h1>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded border print:block print:overflow-visible print:rounded-none print:border-0">
        <Table className="min-w-full print:min-w-0">
          <TableHeader>
            <TableRow>
              <TableHead>{nameHeader}</TableHead>
              <TableHead>Jenis Sampah</TableHead>
              <TableHead>Jumlah Setoran</TableHead>
              <TableHead>Total (Kg)</TableHead>
              <TableHead>Total (Rp)</TableHead>
              <TableHead className="text-right print:hidden">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.wasteTypes || "-"}</TableCell>
                  <TableCell>{row.setoranCount}</TableCell>
                  <TableCell>
                    {row.totalKg.toLocaleString("id-ID", {
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    Rp {row.totalValue.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right print:hidden">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        title="Kelola Setoran"
                        onClick={() => onManage(row)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        title="Hapus"
                        onClick={() => onDelete(row)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards View */}
      <div className="space-y-4 md:hidden print:hidden">
        {items.length === 0 ? (
          <div className="rounded-lg border p-4 text-center">{emptyMessage}</div>
        ) : (
          items.map((row) => (
            <Card key={row.id} className="border">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{row.name}</p>
                    <p
                      className="text-xs text-muted-foreground truncate max-w-[200px]"
                      title={row.wasteTypes || "-"}
                    >
                      {row.wasteTypes || "-"}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    Rp {row.totalValue.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Setoran</span>
                    <span>{row.setoranCount}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Total Kg</span>
                    <span>
                      {row.totalKg.toLocaleString("id-ID", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    size="sm"
                    variant="outline"
                    onClick={() => onManage(row)}
                  >
                    Kelola
                  </Button>
                  <Button
                    className="flex-1"
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(row)}
                  >
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
