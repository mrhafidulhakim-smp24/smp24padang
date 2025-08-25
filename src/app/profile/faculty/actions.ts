
"use server";

import prisma from "@/lib/prisma";

export async function getStaff() {
  return await prisma.staff.findMany({
    orderBy: {
      createdAt: 'asc'
    }
  });
}
