
"use server";

import prisma from "@/lib/prisma";

export async function getStaff() {
  return prisma.staff.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
}
