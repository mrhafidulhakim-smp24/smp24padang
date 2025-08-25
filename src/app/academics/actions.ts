
"use server";

import prisma from '@/lib/prisma';

export async function getAcademics() {
  const academics = await prisma.academics.findFirst();
  return academics;
}
